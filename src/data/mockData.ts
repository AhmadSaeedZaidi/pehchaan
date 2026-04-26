import { TrainingModule, Bounty, UserProfile, TerminalLine } from '@/types';

export const trainingModules: TrainingModule[] = [
  {
    id: 'dist-sys-1',
    title: 'Distributed Deadlock',
    description: 'Two microservices are stuck in a deadly embrace over DB locks.',
    techStack: 'Node.js',
    difficulty: 'advanced',
    points: 150,
  },
  {
    id: 'python-race-1',
    title: 'Thread Pool Race Condition',
    description: 'Shared state in a thread pool is resulting in silent data corruption.',
    techStack: 'Python',
    difficulty: 'advanced',
    points: 120,
  },
  {
    id: 'react-memory-1',
    title: 'WebGL Memory Leak',
    description: 'Canvas context isn''t cleared, crashing the entire browser tab.',
    techStack: 'React',
    difficulty: 'intermediate',
    points: 80,
  },
  {
    id: 'ws-sync-1',
    title: 'WebSocket Desync',
    description: 'Out-of-order packets causing wildly divergent client states.',
    techStack: 'TypeScript',
    difficulty: 'advanced',
    points: 140,
  },
];

export const bounties: Bounty[] = [
  {
    id: 'k8s-gauntlet',
    title: 'K8s Cluster Failure',
    repo: 'cluster-control-plane',
    techStack: 'Go / K8s',
    difficulty: 5,
    passRate: 4,
    totalAttempts: 512,
    timeLimit: 3600,
    reward: 1500,
  },
  {
    id: 'rust-concurrency',
    title: 'Rust Mutex Poisoning',
    repo: 'high-freq-trader',
    techStack: 'Rust',
    difficulty: 5,
    passRate: 8,
    totalAttempts: 892,
    timeLimit: 2400,
    reward: 1200,
  },
  {
    id: 'python-django',
    title: 'Django N+1 Crisis',
    repo: 'django-orm-hell',
    techStack: 'Python',
    difficulty: 4,
    passRate: 18,
    totalAttempts: 654,
    timeLimit: 2100,
    reward: 600,
  },
];

export const mockUser: UserProfile = {
  name: 'Ahmad Saeed',
  avatar: 'AS',
  reputation: 2847,
  isVerified: true,
  github: 'https://github.com/AhmadSaeedZaidi',
  whatsapp: '+92 300 1234567',
  skills: {
    backend: 90,
    frontend: 40,
    database: 85,
    devops: 60,
    security: 75,
  },
  badges: []
};

export const generateTerminalLines = (techStack: string): TerminalLine[] => {
  return [
    { id: '1', type: 'error', message: \FATAL: Uncaught Exception in \-server\, timestamp: new Date().toISOString() },
    { id: '2', type: 'error', message: 'Maximum call stack size exceeded', timestamp: new Date().toISOString() },
  ];
};

export const brokenCodeSamples: Record<string, string> = {
  'dist-sys-1': \// DB Locks are freezing
async function transferFunds(fromId, toId, amount) {
  const fromLock = await acquireLock(fromId);
  const toLock = await acquireLock(toId);
  // ... transfer logic ...
}\,
  'python-race-1': \# Thread unsafety
count = 0
def increment():
    global count
    count += 1
\,
  'react-memory-1': \// Leaking canvas context
useEffect(() => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  // nothing gets cleaned up
}, [...data]);
\,
  'ws-sync-1': \// Out of order WS messages processing
socket.on('message', async (data) => {
  const state = await fetchState();
  updateState({ ...state, ...data });
});
\
};
