export type Mode = 'sandbox' | 'arena';

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  techStack: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
}

export interface Bounty {
  id: string;
  title: string;
  repo: string;
  techStack: string;
  difficulty: number;
  passRate: number;
  totalAttempts: number;
  timeLimit: number; // in seconds
  reward: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: Date;
  challenge: string;
  completionTime: string;
  techStack: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  reputation: number;
  isVerified: boolean;
  github: string;
  whatsapp: string;
  skills: {
    backend: number;
    frontend: number;
    database: number;
    devops: number;
    security: number;
  };
  badges: Badge[];
}

export interface TerminalLine {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
}
