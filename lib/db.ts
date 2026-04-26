// In-memory mock database for Pehchaan
// This array persists for the lifetime of the server process

export interface User {
  id: string;
  githubUsername: string;
  ptsScore: number;
  badges: string[];
  status: "Unverified" | "Initiate" | "Verified Dev";
}

// In-memory user store
const users: User[] = [];

/**
 * Generate a unique ID for new users
 */
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get a user by their ID
 * @param id - The user's unique ID
 * @returns The user object or undefined if not found
 */
export function getUser(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

/**
 * Get a user by their GitHub username
 * @param githubUsername - The GitHub username to search for
 * @returns The user object or undefined if not found
 */
export function getUserByGitHubUsername(githubUsername: string): User | undefined {
  return users.find(
    (user) => user.githubUsername.toLowerCase() === githubUsername.toLowerCase()
  );
}

/**
 * Create a new user in the mock database
 * @param githubUsername - The GitHub username for the new user
 * @returns The newly created user object
 */
export function createUser(githubUsername: string): User {
  const newUser: User = {
    id: generateId(),
    githubUsername,
    ptsScore: 150,
    badges: [],
    status: "Unverified",
  };
  users.push(newUser);
  return newUser;
}

/**
 * Update a user's PTS score
 * @param id - The user's unique ID
 * @param additionalPts - The points to add to the user's score
 * @returns The updated user object or undefined if not found
 */
export function updateUserScore(id: string, additionalPts: number): User | undefined {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return undefined;
  }
  users[userIndex].ptsScore += additionalPts;
  return users[userIndex];
}

/**
 * Add a badge to a user
 * @param id - The user's unique ID
 * @param badge - The badge to add
 * @returns The updated user object or undefined if not found
 */
export function addBadge(id: string, badge: string): User | undefined {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return undefined;
  }
  if (!users[userIndex].badges.includes(badge)) {
    users[userIndex].badges.push(badge);
  }
  return users[userIndex];
}

/**
 * Update a user's status
 * @param id - The user's unique ID
 * @param status - The new status
 * @returns The updated user object or undefined if not found
 */
export function updateUserStatus(
  id: string,
  status: "Unverified" | "Initiate" | "Verified Dev"
): User | undefined {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return undefined;
  }
  users[userIndex].status = status;
  return users[userIndex];
}