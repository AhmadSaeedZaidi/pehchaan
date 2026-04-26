import { NextRequest, NextResponse } from "next/server";
import { getUser, updateUserScore, addBadge, updateUserStatus } from "@/lib/db";

// Request body interface
interface VerifyRequestBody {
  userId: string;
  challengeId: string;
  submittedCode: string;
}

// LLM grading response interface
interface LLMGradingResponse {
  success: boolean;
  score: number;
  feedback: string;
}

// OpenAI API response interface
interface OpenAIChoice {
  message: {
    content: string;
  };
}

interface OpenAIResponse {
  choices: OpenAIChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Points awarded for successful challenge completion
const CHALLENGE_COMPLETION_POINTS = 400;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: VerifyRequestBody = await request.json();
    const { userId, challengeId, submittedCode } = body;

    // Validate input
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

    // Find the user
    const user = getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Construct the system prompt for code evaluation
    const systemPrompt = `You are an expert code evaluator. The user was tasked with fixing a broken code repository. Here is their submitted code: \n\n ${submittedCode} \n\n Analyze it. Did they successfully fix the bug without breaking the rest of the component? Reply ONLY with a valid JSON object matching this schema: { "success": boolean, "score": number (0-100), "feedback": "One short, punchy sentence explaining why they passed or failed." }`;

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: "Please evaluate my submitted code for the challenge.",
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API returned status ${openaiResponse.status}`);
    }

    const openaiData: OpenAIResponse = await openaiResponse.json();

    // Extract and parse the LLM's response
    const llmContent = openaiData.choices[0]?.message?.content;

    if (!llmContent) {
      throw new Error("No content received from OpenAI API");
    }

    // Parse the JSON response from the LLM
    let gradingResult: LLMGradingResponse;
    try {
      gradingResult = JSON.parse(llmContent);
    } catch {
      console.error("Failed to parse LLM response as JSON:", llmContent);
      throw new Error("Invalid JSON response from LLM");
    }

    // Validate the grading result structure
    if (
      typeof gradingResult.success !== "boolean" ||
      typeof gradingResult.score !== "number" ||
      typeof gradingResult.feedback !== "string"
    ) {
      console.error("Invalid grading result structure:", gradingResult);
      throw new Error("Malformed grading result from LLM");
    }

    // Clamp score to valid range
    const clampedScore = Math.min(100, Math.max(0, gradingResult.score));
    gradingResult.score = clampedScore;

    // Initialize updated user variable
    let updatedUser = user;

    // If the challenge was successful, update the user's profile
    if (gradingResult.success) {
      // Add 400 points to the user's PTS score
      const userWithUpdatedScore = updateUserScore(userId, CHALLENGE_COMPLETION_POINTS);
      
      // Add the challengeId to the user's badges
      const userWithBadge = addBadge(userId, challengeId);
      
      // Update status to "Verified Dev"
      const userWithStatus = updateUserStatus(userId, "Verified Dev");

      // Use the most recent updated user (from status update)
      updatedUser = userWithStatus || user;

      // Add a friendly badge format
      addBadge(userId, `challenge_${challengeId}`);
    }

    // Return the LLM's JSON response alongside the updated user object
    return NextResponse.json(
      {
        grading: gradingResult,
        updatedUser,
        pointsAwarded: gradingResult.success ? CHALLENGE_COMPLETION_POINTS : 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify route error:", error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Return a generic error for other failures
    return NextResponse.json(
      { error: "Internal server error during verification" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check verification status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId query parameter is required" },
      { status: 400 }
    );
  }

  const user = getUser(userId);

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      userId: user.id,
      githubUsername: user.githubUsername,
      ptsScore: user.ptsScore,
      status: user.status,
      completedChallenges: user.badges,
    },
    { status: 200 }
  );
}