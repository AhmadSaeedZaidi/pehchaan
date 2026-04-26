import { NextRequest, NextResponse } from "next/server";
import {
  getUser,
  updateUserScore,
  addBadge,
  updateUserStatus,
  ensureSchema,
} from "@/lib/db";
import { callGemini, parseJsonResponse } from "@/lib/gemini";
import { trainingModules, brokenCodeSamples, hints } from "@/data/mockData";

interface VerifyRequestBody {
  userId: string;
  challengeId: string;
  submittedCode: string;
}

interface GradingResult {
  success: boolean;
  score: number;       // 0–100
  feedback: string;    // 1–2 sentences
  bugIdentified: string;
  improvements?: string[];
}

const CHALLENGE_COMPLETION_POINTS = 400;

const GRADING_SYSTEM_INSTRUCTIONS = `
You are Pehchaan's Code Adjudicator — a senior staff engineer who grades developer
fixes with the precision of a code review.

You will be given retrieved context for a single training challenge:
  1. The challenge title and description
  2. The original buggy code
  3. The canonical hint describing the bug
  4. The user's submitted fix

You must determine whether the user genuinely identified and resolved the core
bug — not just made cosmetic changes or hidden the symptom.

Hard rules:
- Output ONLY a single valid JSON object. No markdown, no prose before or after.
- "success" is true ONLY if the core bug is fixed correctly.
- A regex search for the right keyword does NOT count — the fix must be semantically
  correct in context.
- "score" reflects the QUALITY of the fix, not just whether it works:
    0–30  = made it worse / fundamentally wrong
   31–60  = bug touched but not fully solved, or new bugs introduced
   61–80  = correct fix, could be cleaner
   81–100 = correct, idiomatic, production-quality fix
- "feedback" is 1 to 2 short sentences (max 30 words), direct and actionable.
- "bugIdentified" describes — in 1 short sentence — what bug the user fixed
  (or what they *should* have fixed if they failed).
- "improvements" is optional: 0–3 bullet-style hints (max 12 words each).

Output schema:
{
  "success": boolean,
  "score": number,
  "feedback": string,
  "bugIdentified": string,
  "improvements": string[]
}
`.trim();

export async function POST(request: NextRequest) {
  try {
    await ensureSchema();

    const body = (await request.json()) as VerifyRequestBody;
    const { userId, challengeId, submittedCode } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId is required and must be a string" },
        { status: 400 },
      );
    }
    if (!challengeId || typeof challengeId !== "string") {
      return NextResponse.json(
        { error: "challengeId is required and must be a string" },
        { status: 400 },
      );
    }
    if (!submittedCode || typeof submittedCode !== "string") {
      return NextResponse.json(
        { error: "submittedCode is required and must be a string" },
        { status: 400 },
      );
    }

    const user = await getUser(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is not configured" },
        { status: 500 },
      );
    }

    // RAG retrieval — pull challenge metadata, original buggy code, and canonical hint
    const challenge = trainingModules.find((m) => m.id === challengeId);
    const originalCode = brokenCodeSamples[challengeId];
    const canonicalHint = hints[challengeId];

    if (!challenge || !originalCode) {
      return NextResponse.json(
        { error: `Unknown challengeId: ${challengeId}` },
        { status: 400 },
      );
    }

    const userMessage = `
## Challenge
- Title: ${challenge.title}
- Description: ${challenge.description}
- Tech stack: ${challenge.techStack}
- Difficulty: ${challenge.difficulty}

## Original buggy code
\`\`\`
${originalCode}
\`\`\`

## Canonical hint (the actual bug)
${canonicalHint ?? "(no hint available)"}

## User's submitted fix
\`\`\`
${submittedCode}
\`\`\`

Grade this submission now and return JSON only.
`.trim();

    const raw = await callGemini({
      systemInstructions: GRADING_SYSTEM_INSTRUCTIONS,
      userMessage,
      temperature: 0.15,
      maxOutputTokens: 1024,
    });

    let grading: GradingResult;
    try {
      grading = parseJsonResponse<GradingResult>(raw);
    } catch (parseErr) {
      console.error("Failed to parse Gemini grading response:", raw, parseErr);
      return NextResponse.json(
        { error: "Grading service returned malformed JSON" },
        { status: 502 },
      );
    }

    if (
      typeof grading.success !== "boolean" ||
      typeof grading.score !== "number" ||
      typeof grading.feedback !== "string"
    ) {
      return NextResponse.json(
        { error: "Grading service returned invalid shape" },
        { status: 502 },
      );
    }

    grading.score = Math.min(100, Math.max(0, Math.round(grading.score)));

    let updatedUser = user;
    let pointsAwarded = 0;

    if (grading.success) {
      pointsAwarded = Math.round(
        (challenge.points || 100) * (grading.score / 100),
      );
      const afterScore = await updateUserScore(userId, pointsAwarded);
      const afterBadge = await addBadge(userId, challengeId);
      const afterStatus = await updateUserStatus(userId, "Verified Dev");
      updatedUser = afterStatus ?? afterBadge ?? afterScore ?? user;
    }

    return NextResponse.json({
      grading,
      updatedUser,
      pointsAwarded,
    });
  } catch (error) {
    console.error("Verify route error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error during verification" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId query parameter is required" },
      { status: 400 },
    );
  }

  try {
    await ensureSchema();
    const user = await getUser(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      userId: user.id,
      githubUsername: user.githubUsername,
      ptsScore: user.ptsScore,
      status: user.status,
      completedChallenges: user.badges,
    });
  } catch (error) {
    console.error("Verify GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
