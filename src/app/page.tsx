'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import HomePage from '@/components/views/HomePage';
import SandboxView from '@/components/views/SandboxView';
import ArenaView from '@/components/views/ArenaView';
import ProfileView from '@/components/views/ProfileView';
import { ModeProvider } from '@/context/ModeContext';
import { useUser } from '@/context/UserContext';

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
  const { user } = useUser();
  const [view, setView] = useState<View>('home');
  const [loginOpen, setLoginOpen] = useState(false);

  function requireLogin(target: View) {
    if (user) {
      setView(target);
    } else {
      setLoginOpen(true);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Header
        onLoginClick={() => setLoginOpen(true)}
        onProfileClick={() => requireLogin('profile')}
        onLogoClick={() => setView('home')}
      />

      {view !== 'home' && <BackButton onClick={() => setView('home')} />}

      {view === 'home' && (
        <HomePage
          onEnterTraining={() => setView('sandbox')}
          onEnterArena={() => requireLogin('arena')}
        />
      )}
      {view === 'sandbox' && <SandboxView />}
      {view === 'arena' && <ArenaView />}
      {view === 'profile' && <ProfileView />}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
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
