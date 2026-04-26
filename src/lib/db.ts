import { neon } from "@neondatabase/serverless";

// Initialise Neon SQL client (throws at call-time if DATABASE_URL is missing)
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
      id            TEXT PRIMARY KEY,
      github_username TEXT UNIQUE NOT NULL,
      pts_score     INTEGER NOT NULL DEFAULT 150,
      badges        TEXT[]  NOT NULL DEFAULT '{}',
      status        TEXT    NOT NULL DEFAULT 'Unverified',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  githubUsername: string;
  ptsScore: number;
  badges: string[];
  status: "Unverified" | "Initiate" | "Verified Dev";
}

// ---------------------------------------------------------------------------
// Helpers to map DB rows → User
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToUser(row: any): User {
  return {
    id: row.id,
    githubUsername: row.github_username,
    ptsScore: row.pts_score,
    badges: row.badges ?? [],
    status: row.status,
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
  githubUsername: string
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
  additionalPts: number
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
  badge: string
): Promise<User | undefined> {
  const sql = getSql();
  // array_append only adds if not already present via array_remove trick
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
  status: "Unverified" | "Initiate" | "Verified Dev"
): Promise<User | undefined> {
  const sql = getSql();
  const rows = await sql`
    UPDATE users SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return rows[0] ? rowToUser(rows[0]) : undefined;
}
