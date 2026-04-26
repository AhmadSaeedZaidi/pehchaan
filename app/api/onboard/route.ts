import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByGitHubUsername } from "@/lib/db";

// Request body interface
interface OnboardRequestBody {
  githubUsername: string;
}

// Tavily API response interface
interface TavilySearchResponse {
  results?: Array<{
    url: string;
    content: string;
    title: string;
  }>;
  answer?: string;
  images?: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: OnboardRequestBody = await request.json();
    const { githubUsername } = body;

    // Validate input
    if (!githubUsername || typeof githubUsername !== "string") {
      return NextResponse.json(
        { error: "githubUsername is required and must be a string" },
        { status: 400 }
      );
    }

    // Sanitize the username (remove whitespace)
    const sanitizedUsername = githubUsername.trim();

    if (sanitizedUsername.length === 0) {
      return NextResponse.json(
        { error: "githubUsername cannot be empty" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = getUserByGitHubUsername(sanitizedUsername);
    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already onboarded",
          user: existingUser,
        },
        { status: 200 }
      );
    }

    // Call Tavily API to search for GitHub profile info
    const tavilyApiKey = process.env.TAVILY_API_KEY;

    if (!tavilyApiKey) {
      // If no API key, create user anyway for development purposes
      const newUser = createUser(sanitizedUsername);
      return NextResponse.json(
        {
          message: "User onboarded successfully (Tavily API not configured)",
          user: newUser,
          tavilyData: null,
        },
        { status: 201 }
      );
    }

    const tavilySearchQuery = `Find the GitHub profile, bio, and top repositories for ${sanitizedUsername}`;

    const tavilyResponse = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tavilyApiKey}`,
      },
      body: JSON.stringify({
        query: tavilySearchQuery,
        search_depth: "basic",
        max_results: 5,
        include_answer: true,
        include_images: false,
      }),
    });

    if (!tavilyResponse.ok) {
      const errorText = await tavilyResponse.text();
      console.error("Tavily API error:", errorText);
      throw new Error(`Tavily API returned status ${tavilyResponse.status}`);
    }

    const tavilyData: TavilySearchResponse = await tavilyResponse.json();

    // Create new user with starting PTS score of 150
    const newUser = createUser(sanitizedUsername);

    // Return the new user object with success message and Tavily data
    return NextResponse.json(
      {
        message: "User onboarded successfully",
        user: newUser,
        tavilyData: tavilyData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Onboard route error:", error);

    // Handle specific error types
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

// Optional: Add GET handler for checking onboarding status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const githubUsername = searchParams.get("githubUsername");

  if (!githubUsername) {
    return NextResponse.json(
      { error: "githubUsername query parameter is required" },
      { status: 400 }
    );
  }

  const existingUser = getUserByGitHubUsername(githubUsername);

  if (!existingUser) {
    return NextResponse.json(
      { exists: false, user: null },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      exists: true,
      user: existingUser,
    },
    { status: 200 }
  );
}