import { neon } from "@neondatabase/serverless";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is not set");
  return neon(url);
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

export async function ensureSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id              TEXT PRIMARY KEY,
      github_username TEXT UNIQUE NOT NULL,
      pts_score       INTEGER NOT NULL DEFAULT 150,
      badges          TEXT[]  NOT NULL DEFAULT '{}',
      status          TEXT    NOT NULL DEFAULT 'Unverified',
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  // Idempotent additive migrations for the enriched profile fields
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name      TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url        TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio               TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS github_url        TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS primary_languages TEXT[] NOT NULL DEFAULT '{}'`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS skill_estimates   JSONB  NOT NULL DEFAULT '{}'::jsonb`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_summary   TEXT`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserStatus = "Unverified" | "Initiate" | "Verified Dev";

export interface SkillEstimates {
  backend?: number;
  frontend?: number;
  database?: number;
  devops?: number;
  security?: number;
}

export interface User {
  id: string;
  githubUsername: string;
  ptsScore: number;
  badges: string[];
  status: UserStatus;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  githubUrl: string | null;
  primaryLanguages: string[];
  skillEstimates: SkillEstimates;
  profileSummary: string | null;
}

export interface ProfileEnrichment {
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  githubUrl?: string | null;
  primaryLanguages?: string[];
  skillEstimates?: SkillEstimates;
  profileSummary?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToUser(row: any): User {
  return {
    id: row.id,
    githubUsername: row.github_username,
    ptsScore: row.pts_score,
    badges: row.badges ?? [],
    status: row.status,
    displayName: row.display_name ?? null,
    avatarUrl: row.avatar_url ?? null,
    bio: row.bio ?? null,
    githubUrl: row.github_url ?? null,
    primaryLanguages: row.primary_languages ?? [],
    skillEstimates: (row.skill_estimates ?? {}) as SkillEstimates,
    profileSummary: row.profile_summary ?? null,
  };
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function getUser(id: string): Promise<User | undefined> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
  return rows[0] ? rowToUser(rows[0]) : undefined;
}

export async function getUserByGitHubUsername(
  githubUsername: string,
): Promise<User | undefined> {
  const sql = getSql();
  const rows =
    await sql`SELECT * FROM users WHERE LOWER(github_username) = LOWER(${githubUsername})`;
  return rows[0] ? rowToUser(rows[0]) : undefined;
}

export async function createUser(githubUsername: string): Promise<User> {
  const sql = getSql();
  const id = generateId();
  const rows = await sql`
    INSERT INTO users (id, github_username)
    VALUES (${id}, ${githubUsername})
    RETURNING *
  `;
  return rowToUser(rows[0]);
}

export async function updateUserScore(
  id: string,
  additionalPts: number,
): Promise<User | undefined> {
  const sql = getSql();
  const rows = await sql`
    UPDATE users
    SET pts_score = pts_score + ${additionalPts}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? rowToUser(rows[0]) : undefined;
}

export async function addBadge(
  id: string,
  badge: string,
): Promise<User | undefined> {
  const sql = getSql();
  const rows = await sql`
    UPDATE users
    SET badges = array_append(
      array_remove(badges, ${badge}::text),
      ${badge}::text
    )
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? rowToUser(rows[0]) : undefined;
}

export async function updateUserStatus(
  id: string,
  status: UserStatus,
): Promise<User | undefined> {
  const sql = getSql();
  const rows = await sql`
    UPDATE users SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return rows[0] ? rowToUser(rows[0]) : undefined;
}

/**
 * Persist enriched profile data produced by the GitHub + Tavily + Gemini pipeline.
 * Only updates fields that are actually provided.
 */
export async function updateUserProfile(
  id: string,
  enrichment: ProfileEnrichment,
): Promise<User | undefined> {
  const sql = getSql();
  const rows = await sql`
    UPDATE users
    SET
      display_name      = COALESCE(${enrichment.displayName ?? null},   display_name),
      avatar_url        = COALESCE(${enrichment.avatarUrl ?? null},     avatar_url),
      bio               = COALESCE(${enrichment.bio ?? null},           bio),
      github_url        = COALESCE(${enrichment.githubUrl ?? null},     github_url),
      primary_languages = COALESCE(${enrichment.primaryLanguages ?? null}::text[], primary_languages),
      skill_estimates   = COALESCE(${JSON.stringify(enrichment.skillEstimates ?? null)}::jsonb, skill_estimates),
      profile_summary   = COALESCE(${enrichment.profileSummary ?? null}, profile_summary)
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? rowToUser(rows[0]) : undefined;
}
