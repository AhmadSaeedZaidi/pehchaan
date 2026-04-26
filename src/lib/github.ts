export interface GitHubProfile {
  username: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  location: string | null;
  blog: string | null;
  htmlUrl: string;
}

export interface GitHubRepo {
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
  topics: string[];
}

const GH_HEADERS: HeadersInit = { Accept: "application/vnd.github+json" };

export async function fetchGitHubProfile(
  username: string,
): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      { headers: GH_HEADERS, next: { revalidate: 600 } },
    );
    if (!res.ok) return null;
    const d = await res.json();
    return {
      username: d.login,
      name: d.name,
      bio: d.bio,
      avatarUrl: d.avatar_url,
      publicRepos: d.public_repos ?? 0,
      followers: d.followers ?? 0,
      following: d.following ?? 0,
      createdAt: d.created_at,
      location: d.location,
      blog: d.blog,
      htmlUrl: d.html_url,
    };
  } catch {
    return null;
  }
}

export async function fetchGitHubTopRepos(
  username: string,
  limit = 8,
): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(
        username,
      )}/repos?sort=pushed&per_page=${limit}&type=owner`,
      { headers: GH_HEADERS, next: { revalidate: 600 } },
    );
    if (!res.ok) return [];
    const repos = (await res.json()) as Array<{
      name: string;
      full_name: string;
      description: string | null;
      language: string | null;
      stargazers_count?: number;
      forks_count?: number;
      pushed_at: string;
      topics?: string[];
    }>;
    return repos.map((r) => ({
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
      pushedAt: r.pushed_at,
      topics: r.topics ?? [],
    }));
  } catch {
    return [];
  }
}

export function summarizeLanguages(repos: GitHubRepo[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) out[r.language] = (out[r.language] ?? 0) + 1;
  }
  return out;
}
