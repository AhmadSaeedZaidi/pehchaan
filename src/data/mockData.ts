import { TrainingModule, Bounty, UserProfile, TerminalLine } from '@/types';

export const trainingModules: TrainingModule[] = [
  {
    id: 'react-state-1',
    title: 'React State Management',
    description: 'Component re-renders infinitely. Figure out why.',
    techStack: 'React',
    difficulty: 'beginner',
    points: 10,
    hintCost: 5,
  },
  {
    id: 'python-api-1',
    title: 'Python Async',
    description: 'Data gets corrupted under load. Race condition somewhere.',
    techStack: 'Python',
    difficulty: 'intermediate',
    points: 25,
    hintCost: 10,
  },
  {
    id: 'node-async-1',
    title: 'Node Callbacks',
    description: 'Server hangs after a few requests. Classic callback issue.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    points: 20,
    hintCost: 8,
  },
  {
    id: 'sql-injection-1',
    title: 'Database Query',
    description: 'Login is vulnerable. User input meets SQL somewhere.',
    techStack: 'SQL',
    difficulty: 'advanced',
    points: 35,
    hintCost: 15,
  },
  {
    id: 'react-hooks-1',
    title: 'React Hooks',
    description: 'useEffect runs forever. Check the dependency array.',
    techStack: 'React',
    difficulty: 'beginner',
    points: 15,
    hintCost: 5,
  },
  {
    id: 'express-middleware-1',
    title: 'Express Middleware',
    description: 'Auth is being bypassed. Order matters.',
    techStack: 'Express.js',
    difficulty: 'advanced',
    points: 40,
    hintCost: 15,
  },
];

export const bounties: Bounty[] = [
  {
    id: 'react-gauntlet',
    title: 'React',
    repo: 'react-complex-form',
    techStack: 'React',
    difficulty: 4,
    passRate: 23,
    totalAttempts: 1247,
    timeLimit: 1800,
    reward: 500,
  },
  {
    id: 'express-node',
    title: 'Express.js',
    repo: 'express-api-skeleton',
    techStack: 'Express.js',
    difficulty: 5,
    passRate: 12,
    totalAttempts: 892,
    timeLimit: 2400,
    reward: 750,
  },
  {
    id: 'python-django',
    title: 'Django',
    repo: 'django-rest-framework',
    techStack: 'Python',
    difficulty: 4,
    passRate: 18,
    totalAttempts: 654,
    timeLimit: 2100,
    reward: 600,
  },
  {
    id: 'typescript-api',
    title: 'TypeScript',
    repo: 'ts-api-gateway',
    techStack: 'TypeScript',
    difficulty: 5,
    passRate: 8,
    totalAttempts: 423,
    timeLimit: 2700,
    reward: 900,
  },
  {
    id: 'mongodb-lab',
    title: 'MongoDB',
    repo: 'mongo-aggregation',
    techStack: 'MongoDB',
    difficulty: 3,
    passRate: 31,
    totalAttempts: 1567,
    timeLimit: 1500,
    reward: 400,
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
  badges: [
    {
      id: 'badge-1',
      name: 'React Logic Master',
      description: 'Level 4 Challenge in 2m 14s',
      earnedAt: new Date('2026-04-25T14:30:00'),
      challenge: 'React',
      completionTime: '2m 14s',
      techStack: 'React',
    },
    {
      id: 'badge-2',
      name: 'Node.js Survivor',
      description: 'Level 3 Challenge in 4m 02s',
      earnedAt: new Date('2026-04-24T10:15:00'),
      challenge: 'Express.js',
      completionTime: '4m 02s',
      techStack: 'Node.js',
    },
    {
      id: 'badge-3',
      name: 'TypeScript Architect',
      description: 'Level 5 Challenge in 8m 45s',
      earnedAt: new Date('2026-04-20T16:00:00'),
      challenge: 'TypeScript',
      completionTime: '8m 45s',
      techStack: 'TypeScript',
    },
    {
      id: 'badge-4',
      name: 'Backend Baron',
      description: 'All Backend challenges completed',
      earnedAt: new Date('2026-04-15T12:00:00'),
      challenge: 'Backend Certification',
      completionTime: '45m 30s',
      techStack: 'Backend',
    },
  ],
};

export const generateTerminalLines = (techStack: string): TerminalLine[] => {
  const lines: TerminalLine[] = [
    {
      id: '1',
      type: 'error',
      message: `FATAL: Uncaught Exception in ${techStack.toLowerCase()}-server`,
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'warning',
      message: 'Memory leak detected in component tree',
      timestamp: new Date().toISOString(),
    },
    {
      id: '3',
      type: 'error',
      message: 'Maximum call stack size exceeded',
      timestamp: new Date().toISOString(),
    },
    {
      id: '4',
      type: 'info',
      message: 'Attempting graceful recovery...',
      timestamp: new Date().toISOString(),
    },
    {
      id: '5',
      type: 'error',
      message: 'Database connection pool exhausted',
      timestamp: new Date().toISOString(),
    },
  ];
  return lines;
};

export const brokenCodeSamples: Record<string, string> = {
  'react-state-1': `import React, { useState, useEffect } from 'react';

function LoginComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, []);
  
  return (
    <div>
      {loading ? <p>Loading...</p> : <p>Welcome, {user.name}</p>}
    </div>
  );
}`,
  'python-api-1': `import asyncio
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
user_cache = {}

class UserUpdate(BaseModel):
    name: str
    email: str

@app.post("/update/{user_id}")
async def update_user(user_id: int, update: UserUpdate):
    current = user_cache.get(user_id, {})
    await asyncio.sleep(0.1)
    user_cache[user_id] = {**current, **update.dict()}
    return user_cache[user_id]`,
  'node-async-1': `const express = require('express');
const app = express();

function readFileCallback(filename, callback) {
  const fs = require('fs');
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) callback(err);
    callback(null, data);
  });
}

app.get('/file', (req, res) => {
  readFileCallback('data.txt', (err, data) => {
    if (err) return res.status(500).send('Error');
    readFileCallback('meta.txt', (err2, meta) => {
      if (err2) return res.status(500).send('Error');
      res.json({ data, meta });
    });
  });
});

app.listen(3000);`,
  'sql-injection-1': `const mysql = require('mysql2');
const db = mysql.createConnection({ host: 'localhost', database: 'app' });

function getUser(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const query = "SELECT * FROM users WHERE username = '" + username +
                "' AND password = '" + password + "'";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ success: false });
    }
  });
}`,
  'react-hooks-1': `import React, { useState, useEffect } from 'react';

function SearchComponent({ query }) {
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(\`/api/search?q=\${query}\`)
      .then(r => r.json())
      .then(data => {
        setResults(data);
        setCount(count + 1);
      });
  }, [query, count]);

  return (
    <div>
      <p>Searches: {count}</p>
      {results.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  );
}`,
  'express-middleware-1': `const express = require('express');
const app = express();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || token !== 'secret') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/public', (req, res) => {
  res.json({ message: 'Public endpoint' });
});

app.use(authMiddleware);

app.get('/admin', (req, res) => {
  res.json({ message: 'Admin only' });
});

app.get('/dashboard', (req, res) => {
  res.json({ data: 'Protected data' });
});

app.listen(3000);`,
};

export const hints: Record<string, string> = {
  'react-state-1': 'Check the useEffect cleanup. Add a return statement.',
  'python-api-1': 'Use a lock for concurrent modifications.',
  'node-async-1': 'Use Promise.all() or async/await.',
  'sql-injection-1': 'Never concatenate user input into SQL.',
  'react-hooks-1': 'Check the dependency array.',
  'express-middleware-1': 'Middleware order matters.',
};
