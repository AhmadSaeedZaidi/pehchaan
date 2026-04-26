import { NextRequest, NextResponse } from "next/server";
import {
  ensureSchema,
  createUser,
  getUserByGitHubUsername,
  updateUserProfile,
  type SkillEstimates,
  type User,
} from "@/lib/db";
import {
  fetchGitHubProfile,
  fetchGitHubTopRepos,
  summarizeLanguages,
  type GitHubProfile,
  type GitHubRepo,
} from "@/lib/github";
import { tavilySearch, formatRetrievedContext } from "@/lib/tavily";
import { callGemini, parseJsonResponse } from "@/lib/gemini";

interface OnboardRequestBody {
  githubUsername: string;
}

interface AnalystOutput {
  displayName?: string;
  primaryLanguages?: string[];
  skillEstimates?: SkillEstimates;
  profileSummary?: string;
}

const ANALYST_SYSTEM_INSTRUCTIONS = `
You are Pehchaan's Talent Analyst — an experienced senior engineer who evaluates
self-taught developers based on their public GitHub footprint and any web context.

You will be given:
  1. Raw GitHub profile data (bio, repo counts, top languages)
  2. Up to 8 of the user's most recently active repositories
  3. Web search results that may corroborate or extend that picture

Your job is to produce a calibrated, honest, structured profile snapshot.

Hard rules:
- Output ONLY a single valid JSON object — no markdown, no prose before or after.
- Skill scores are integers 0–100. Be conservative: 50 = average, 70 = solid, 85+ = expert.
- If signal is weak (no description, no repos, no web hits), score conservatively
  and say so in profileSummary.
- Never fabricate facts about the person. If something is unclear, omit it.
- profileSummary must be 1–2 punchy sentences (max 220 chars), in plain English,
  written in third person ("they ..."), no marketing fluff.

Output schema:
{
  "displayName": string,                      // their real or display name; may be the username
  "primaryLanguages": string[],               // top 1–5 languages, ranked
  "skillEstimates": {
    "backend":  number,                       // 0–100
    "frontend": number,
    "database": number,
    "devops":   number,
    "security": number
  },
  "profileSummary": string                    // 1–2 sentences, third person
}
`.trim();

function buildAnalystPrompt(
  username: string,
  profile: GitHubProfile,
  repos: GitHubRepo[],
  webContext: string,
): string {
  const langCounts = summarizeLanguages(repos);
  const langTable = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => `- ${lang}: ${count} repo(s)`)
    .join("\n") || "(no languages detected)";

  const repoLines =
    repos
      .slice(0, 8)
      .map(
        (r, i) =>
          `${i + 1}. ${r.name}${r.language ? ` (${r.language})` : ""} — ${
            r.description?.slice(0, 140) ?? "no description"
          } [★${r.stars}]`,
      )
      .join("\n") || "(no public repositories)";

  return `
## GitHub Profile (verified data)
- Username: @${username}
- Display name: ${profile.name ?? "(none)"}
- Bio: ${profile.bio ?? "(empty)"}
- Public repos: ${profile.publicRepos}
- Followers: ${profile.followers}
- Account created: ${profile.createdAt}
- Location: ${profile.location ?? "(unknown)"}

## Languages used (across recent repos)
${langTable}

## Recent repositories
${repoLines}

## Retrieved web context
${webContext}

Produce the JSON profile now.
`.trim();
}

async function enrichProfile(
  username: string,
  profile: GitHubProfile,
  repos: GitHubRepo[],
): Promise<{
  enrichment: Parameters<typeof updateUserProfile>[1];
  geminiAvailable: boolean;
}> {
  // Retrieval — only call Tavily if there's an API key configured
  const { results: tavilyResults } = await tavilySearch(
    `Software engineer ${username} site:github.com OR programming projects`,
    5,
  );
  const webContext = formatRetrievedContext(tavilyResults);

  const baseEnrichment: Parameters<typeof updateUserProfile>[1] = {
    displayName: profile.name ?? username,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    githubUrl: profile.htmlUrl,
    primaryLanguages: Object.entries(summarizeLanguages(repos))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang),
  };

  if (!process.env.GEMINI_API_KEY) {
    return { enrichment: baseEnrichment, geminiAvailable: false };
  }

  try {
    const userMessage = buildAnalystPrompt(username, profile, repos, webContext);
    const raw = await callGemini({
      systemInstructions: ANALYST_SYSTEM_INSTRUCTIONS,
      userMessage,
      temperature: 0.25,
      maxOutputTokens: 1024,
    });
    const analysis = parseJsonResponse<AnalystOutput>(raw);

    return {
      enrichment: {
        ...baseEnrichment,
        displayName: analysis.displayName ?? baseEnrichment.displayName,
        primaryLanguages:
          analysis.primaryLanguages?.length
            ? analysis.primaryLanguages
            : baseEnrichment.primaryLanguages,
        skillEstimates: analysis.skillEstimates ?? {},
        profileSummary: analysis.profileSummary ?? null,
      },
      geminiAvailable: true,
    };
  } catch (err) {
    console.error("Gemini analyst step failed:", err);
    // Fall back to base enrichment without skill estimates / summary
    return { enrichment: baseEnrichment, geminiAvailable: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureSchema();

    const body = (await request.json()) as OnboardRequestBody;
    const githubUsername = body.githubUsername?.trim();

    if (!githubUsername) {
      return NextResponse.json(
        { error: "githubUsername is required" },
        { status: 400 },
      );
    }
    if (!/^[a-zA-Z0-9-]{1,39}$/.test(githubUsername)) {
      return NextResponse.json(
        {
          error:
            "Invalid GitHub username (alphanumeric and dashes only, max 39 chars)",
        },
        { status: 400 },
      );
    }

    // 1. RETRIEVAL — verify the GitHub user actually exists
    const profile = await fetchGitHubProfile(githubUsername);
    if (!profile) {
      return NextResponse.json(
        { error: `GitHub user @${githubUsername} not found` },
        { status: 404 },
      );
    }
    const repos = await fetchGitHubTopRepos(githubUsername, 8);

    // 2. CHECK / CREATE — get or insert
    let user: User | undefined = await getUserByGitHubUsername(githubUsername);
    const isNew = !user;
    if (!user) user = await createUser(profile.username);

    // 3. AUGMENTED GENERATION — Tavily + Gemini analyst
    const { enrichment, geminiAvailable } = await enrichProfile(
      profile.username,
      profile,
      repos,
    );
    const updated = await updateUserProfile(user.id, enrichment);

    return NextResponse.json(
      {
        message: isNew
          ? "User onboarded successfully"
          : "Welcome back",
        isNew,
        user: updated ?? user,
        meta: {
          retrievedRepos: repos.length,
          geminiAnalysis: geminiAvailable,
        },
      },
      { status: isNew ? 201 : 200 },
    );
  } catch (error) {
    console.error("Onboard route error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error during onboarding" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const githubUsername = searchParams.get("githubUsername");

  if (!githubUsername) {
    return NextResponse.json(
      { error: "githubUsername query parameter is required" },
      { status: 400 },
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
      { status: 500 },
    );
  }
}
