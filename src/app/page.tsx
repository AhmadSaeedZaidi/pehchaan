'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import HomePage from '@/components/views/HomePage';
import SandboxView from '@/components/views/SandboxView';
import ArenaView from '@/components/views/ArenaView';
import ProfileView from '@/components/views/ProfileView';
import { ModeProvider } from '@/context/ModeContext';

type View = 'home' | 'sandbox' | 'arena' | 'profile';

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-[68px] left-4 sm:left-6 z-40 flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors"
      style={{
        background: 'var(--bg)',
        borderColor: 'var(--border)',
        color: 'var(--text-3)',
      }}
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}

function MainContent() {
  const [view, setView] = useState<View>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setIsLoggedIn(true)}
        onProfileClick={() => setView('profile')}
      />

      {view !== 'home' && <BackButton onClick={() => setView('home')} />}

      {view === 'home' && (
        <HomePage
          onEnterTraining={() => setView('sandbox')}
          onEnterArena={() => setView('arena')}
        />
      )}
      {view === 'sandbox' && <SandboxView />}
      {view === 'arena' && <ArenaView />}
      {view === 'profile' && <ProfileView />}
    </div>
  );
}

export default function Home() {
  return (
    <ModeProvider>
      <MainContent />
    </ModeProvider>
  );
}
