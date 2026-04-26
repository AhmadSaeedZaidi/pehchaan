'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import HomePage from '@/components/views/HomePage';
import SandboxView from '@/components/views/SandboxView';
import ArenaView from '@/components/views/ArenaView';
import ProfileView from '@/components/views/ProfileView';
import { ModeProvider, useMode } from '@/context/ModeContext';

function MainContent() {
  const [view, setView] = useState<'home' | 'sandbox' | 'arena' | 'profile'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleProfileClick = () => {
    setView('profile');
  };

  const handleEnterTraining = () => {
    setView('sandbox');
  };

  const handleEnterArena = () => {
    setView('arena');
  };

  const handleBackHome = () => {
    setView('home');
  };

  return (
    <>
      <Header 
        isLoggedIn={isLoggedIn} 
        onLoginClick={handleLogin}
        onProfileClick={handleProfileClick}
      />
      
      {view === 'home' && (
        <HomePage 
          isLoggedIn={isLoggedIn} 
          onEnterTraining={handleEnterTraining}
          onEnterArena={handleEnterArena}
        />
      )}
      
      {view === 'sandbox' && (
        <>
          <button 
            onClick={handleBackHome}
            className="fixed top-24 left-6 z-50 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm hover:bg-white/5"
          >
            Back
          </button>
          <SandboxView />
        </>
      )}
      
      {view === 'arena' && (
        <>
          <button 
            onClick={handleBackHome}
            className="fixed top-24 left-6 z-50 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm hover:bg-white/5"
          >
            Back
          </button>
          <ArenaView />
        </>
      )}
      
      {view === 'profile' && (
        <>
          <button 
            onClick={handleBackHome}
            className="fixed top-24 left-6 z-50 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm hover:bg-white/5"
          >
            Back
          </button>
          <ProfileView />
        </>
      )}
    </>
  );
}

export default function Home() {
  return (
    <ModeProvider>
      <MainContent />
    </ModeProvider>
  );
}
