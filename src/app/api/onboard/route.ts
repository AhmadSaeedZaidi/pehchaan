import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByGitHubUsername, ensureSchema } from "@/lib/db";

interface OnboardRequestBody {
  githubUsername: string;
}

interface TavilySearchResponse {
  results?: Array<{ url: string; content: string; title: string }>;
  answer?: string;
}

export async function POST(request: NextRequest) {
  try {
    await ensureSchema();

    const body: OnboardRequestBody = await request.json();
    const { githubUsername } = body;

    if (!githubUsername || typeof githubUsername !== "string") {
      return NextResponse.json(
        { error: "githubUsername is required and must be a string" },
        { status: 400 }
      );
    }

    const sanitizedUsername = githubUsername.trim();
    if (sanitizedUsername.length === 0) {
      return NextResponse.json(
        { error: "githubUsername cannot be empty" },
        { status: 400 }
      );
    }

    const existingUser = await getUserByGitHubUsername(sanitizedUsername);
    if (existingUser) {
      return NextResponse.json(
        { message: "User already onboarded", user: existingUser },
        { status: 200 }
      );
    }

    const tavilyApiKey = process.env.TAVILY_API_KEY;
    let tavilyData: TavilySearchResponse | null = null;

    if (tavilyApiKey) {
      try {
        const tavilyResponse = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tavilyApiKey}`,
          },
          body: JSON.stringify({
            query: `GitHub profile bio and top repositories for ${sanitizedUsername}`,
            search_depth: "basic",
            max_results: 5,
            include_answer: true,
            include_images: false,
          }),
        });
        if (tavilyResponse.ok) {
          tavilyData = await tavilyResponse.json();
        }
      } catch {
        // Non-fatal — proceed without Tavily data
      }
    }

    const newUser = await createUser(sanitizedUsername);

    return NextResponse.json(
      { message: "User onboarded successfully", user: newUser, tavilyData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Onboard route error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error during onboarding" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const githubUsername = searchParams.get("githubUsername");

  if (!githubUsername) {
    return NextResponse.json(
      { error: "githubUsername query parameter is required" },
      { status: 400 }
    );
  }

  try {
    await ensureSchema();
    const user = await getUserByGitHubUsername(githubUsername);
    return NextResponse.json({ exists: !!user, user: user ?? null });
  } catch (error) {
    console.error("Onboard GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
