import { NextRequest, NextResponse } from "next/server";
import {
  getUser,
  updateUserScore,
  addBadge,
  updateUserStatus,
  ensureSchema,
} from "@/lib/db";

interface VerifyRequestBody {
  userId: string;
  challengeId: string;
  submittedCode: string;
}

interface LLMGradingResponse {
  success: boolean;
  score: number;
  feedback: string;
}

interface GeminiPart {
  text: string;
  thought?: boolean;
}

interface GeminiResponse {
  candidates: Array<{
    content: { parts: GeminiPart[] };
  }>;
}

const CHALLENGE_COMPLETION_POINTS = 400;
const GEMINI_MODEL = "gemma-4-31b-it";

export async function POST(request: NextRequest) {
  try {
    await ensureSchema();

    const body: VerifyRequestBody = await request.json();
    const { userId, challengeId, submittedCode } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId is required and must be a string" },
        { status: 400 }
      );
    }
    if (!challengeId || typeof challengeId !== "string") {
      return NextResponse.json(
        { error: "challengeId is required and must be a string" },
        { status: 400 }
      );
    }
    if (!submittedCode || typeof submittedCode !== "string") {
      return NextResponse.json(
        { error: "submittedCode is required and must be a string" },
        { status: 400 }
      );
    }

    const user = await getUser(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are an expert code evaluator for a developer verification platform.

The user submitted the following code as their fix for a buggy challenge:

\`\`\`
${submittedCode}
\`\`\`

Analyze whether they successfully identified and fixed the bug without breaking anything else. Be strict but fair.

Reply ONLY with a valid JSON object — no markdown fences, no explanation outside the JSON:
{"success": boolean, "score": number, "feedback": "One short punchy sentence."}

Where:
- success: true only if the core bug is genuinely fixed
- score: 0–100 representing quality of the fix
- feedback: one concise sentence (max 15 words)`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024, // needs room for thinking tokens + response
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API returned status ${geminiResponse.status}`);
    }

    const geminiData: GeminiResponse = await geminiResponse.json();
    // Gemma 4 returns thinking tokens first (thought: true) — find the actual response part
    const parts = geminiData.candidates[0]?.content?.parts ?? [];
    const llmContent = parts.find((p) => !p.thought)?.text;

    if (!llmContent) throw new Error("No content received from Gemini API");

    let gradingResult: LLMGradingResponse;
    try {
      // Strip any accidental markdown fences the model may emit
      const cleaned = llmContent.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      gradingResult = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse Gemini response as JSON:", llmContent);
      throw new Error("Invalid JSON response from Gemini");
    }

    if (
      typeof gradingResult.success !== "boolean" ||
      typeof gradingResult.score !== "number" ||
      typeof gradingResult.feedback !== "string"
    ) {
      throw new Error("Malformed grading result from Gemini");
    }

    gradingResult.score = Math.min(100, Math.max(0, gradingResult.score));

    let updatedUser = user;

    if (gradingResult.success) {
      await updateUserScore(userId, CHALLENGE_COMPLETION_POINTS);
      await addBadge(userId, challengeId);
      updatedUser = (await updateUserStatus(userId, "Verified Dev")) ?? user;
    }

    return NextResponse.json({
      grading: gradingResult,
      updatedUser,
      pointsAwarded: gradingResult.success ? CHALLENGE_COMPLETION_POINTS : 0,
    });
  } catch (error) {
    console.error("Verify route error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error during verification" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId query parameter is required" },
      { status: 400 }
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
      { status: 500 }
    );
  }
}
