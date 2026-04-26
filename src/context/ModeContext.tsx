'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Mode } from '@/types';

interface ModeContextType {
  mode: Mode;
  toggleMode: () => void;
  isAnimating: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('sandbox');
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMode = () => {
    setIsAnimating(true);
    setMode((prev) => (prev === 'sandbox' ? 'arena' : 'sandbox'));
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode, isAnimating }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
