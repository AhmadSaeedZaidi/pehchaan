'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface AuthUser {
  id: string;
  githubUsername: string;
  ptsScore: number;
  badges: string[];
  status: 'Unverified' | 'Initiate' | 'Verified Dev';
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  githubUrl: string | null;
  primaryLanguages: string[];
  skillEstimates: {
    backend?: number;
    frontend?: number;
    database?: number;
    devops?: number;
    security?: number;
  };
  profileSummary: string | null;
}

interface UserContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (githubUsername: string) => Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
  updateUser: (u: AuthUser) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const STORAGE_KEY = 'pehchaan-user';

function loadFromStorage(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(loadFromStorage());
  }, []);

  const persist = useCallback((u: AuthUser | null) => {
    setUser(u);
    if (typeof window !== 'undefined') {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login: UserContextValue['login'] = useCallback(
    async (githubUsername) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/onboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ githubUsername }),
        });
        const data = await res.json();
        if (!res.ok) {
          const message = data?.error ?? 'Login failed';
          setError(message);
          return { ok: false as const, error: message };
        }
        const authUser = data.user as AuthUser;
        persist(authUser);
        return { ok: true as const, user: authUser };
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Network error';
        setError(message);
        return { ok: false as const, error: message };
      } finally {
        setLoading(false);
      }
    },
    [persist],
  );

  const logout = useCallback(() => {
    persist(null);
  }, [persist]);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(
        `/api/onboard?githubUsername=${encodeURIComponent(user.githubUsername)}`,
      );
      const data = await res.json();
      if (data?.user) persist(data.user as AuthUser);
    } catch {
      /* swallow */
    }
  }, [user, persist]);

  return (
    <UserContext.Provider
      value={{ user, loading, error, login, logout, refresh, updateUser: persist }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
