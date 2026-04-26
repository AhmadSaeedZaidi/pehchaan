import { NextRequest, NextResponse } from "next/server";
import {
  getUser,
  updateUserScore,
  addBadge,
  updateUserStatus,
  ensureSchema,
} from "@/lib/db";
import { callGemini, parseJsonResponse } from "@/lib/gemini";
import { bounties } from "@/data/mockData";

interface ArenaRequestBody {
  userId: string;
  bountyId: string;
  submittedCode: string;
}

interface GradingResult {
  success: boolean;
  score: number;
  feedback: string;
  bugIdentified: string;
  improvements?: string[];
}

const ARENA_GRADING_SYSTEM_INSTRUCTIONS = `
You are Pehchaan's Arena Adjudicator — an unforgiving, high-stakes system that evaluates code fixes under time pressure.

You will be given:
  1. The Arena Bounty details
  2. The user's submitted code

Your job is to determine if the submitted code is robust, technically sound, and fully resolves common failure modes for the specified tech stack.
Since the original code was a generic buggy template, you must infer if the user addressed the obvious flaws (e.g., missing type checks, unhandled promise rejections, memory leaks).

Hard rules:
- Output ONLY a single valid JSON object. No markdown.
- "success" is true ONLY if the code is production-ready and free of obvious logical or runtime errors.
- "score": (0-100)
    0-40: Broken, doesn't compile, or introduces new bugs.
   41-70: Works but hacky, missing error handling, poor performance.
   71-89: Solid fix, but could be optimized.
   90-100: Flawless, idiomatic, production-grade.
- "feedback": 1 to 2 short sentences, brutal and direct.
- "bugIdentified": 1 short sentence identifying the core issue they fixed or failed to fix.
- "improvements": 0-3 bullet points for optimization.

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

    const body = (await request.json()) as ArenaRequestBody;
    const { userId, bountyId, submittedCode } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    if (!bountyId || typeof bountyId !== "string") {
      return NextResponse.json({ error: "bountyId is required" }, { status: 400 });
    }
    if (!submittedCode || typeof submittedCode !== "string") {
      return NextResponse.json({ error: "submittedCode is required" }, { status: 400 });
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

    const bounty = bounties.find((b) => b.id === bountyId);
    if (!bounty) {
      return NextResponse.json({ error: \`Unknown bountyId: \${bountyId}\` }, { status: 400 });
    }

    const userMessage = \`
## Arena Bounty
- Title: \${bounty.title}
- Repo: \${bounty.repo}
- Tech Stack: \${bounty.techStack}

## User's Submitted Code
\`\`\`
\${submittedCode}
\`\`\`

Evaluate this submission immediately.
\`.trim();

    const raw = await callGemini({
      systemInstructions: ARENA_GRADING_SYSTEM_INSTRUCTIONS,
      userMessage,
      temperature: 0.2,
      maxOutputTokens: 1024,
    });

    let grading: GradingResult;
    try {
      grading = parseJsonResponse<GradingResult>(raw);
    } catch (parseErr) {
      return NextResponse.json(
        { error: "Grading service returned malformed JSON" },
        { status: 502 },
      );
    }

    grading.score = Math.min(100, Math.max(0, Math.round(grading.score)));

    let updatedUser = user;
    let pointsAwarded = 0;

    if (grading.success) {
      pointsAwarded = Math.round(bounty.reward * (grading.score / 100));
      const afterScore = await updateUserScore(userId, pointsAwarded);
      const afterBadge = await addBadge(userId, bountyId);
      updatedUser = afterBadge ?? afterScore ?? user;
    }

    return NextResponse.json({
      grading,
      updatedUser,
      pointsAwarded,
    });
  } catch (error) {
    console.error("Arena API error:", error);
    return NextResponse.json(
      { error: "Internal server error during evaluation" },
      { status: 500 },
    );
  }
}
