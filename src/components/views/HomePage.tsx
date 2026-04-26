'use client';

import React, { useState } from 'react';
import { GraduationCap, Sword, ChevronRight } from 'lucide-react';

interface HomePageProps {
  onEnterTraining: () => void;
  onEnterArena: () => void;
}

const trainingSteps = ['Pick a skill', 'Find the bug', 'Fix it', 'Level up'];
const arenaSteps = ['Pick a challenge', 'Race the clock', 'Earn your badge'];

export default function HomePage({ onEnterTraining, onEnterArena }: HomePageProps) {
  const [hoveredPath, setHoveredPath] = useState<'training' | 'trial' | null>(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div className="pt-24 sm:pt-28 pb-8 text-center px-4 sm:px-6">
        <p
          className="text-[10px] sm:text-xs font-mono tracking-widest uppercase mb-3 sm:mb-4 opacity-60"
          style={{ color: 'var(--cyan)' }}
        >
          Pehchaan — پہچان
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight" style={{ color: 'var(--text)' }}>
          The Unrecognised<br />
          <span style={{ color: 'var(--cyan)' }}>Get Verified</span>
        </h1>
        <p className="text-sm sm:text-base max-w-sm sm:max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-3)' }}>
          Stop watching others get credit for your work.<br className="hidden sm:block" />
          Prove what you can actually build.
        </p>
      </div>

      {/* Two Paths — stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0">
        {/* Training — Left */}
        <button
          onMouseEnter={() => setHoveredPath('training')}
          onMouseLeave={() => setHoveredPath(null)}
          onClick={onEnterTraining}
          className="relative overflow-hidden transition-all duration-500 group sm:flex-1"
          style={{
            minHeight: '320px',
            opacity: hoveredPath === 'trial' ? 0.7 : 1,
          }}
        >
          {/* Background image — brighter overlay */}
          <div className="absolute inset-0">
            <img src="/left.png" alt="Training" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.05) 100%)' }}
            />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between p-7 sm:p-10 lg:p-14" style={{ minHeight: '320px' }}>
            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border backdrop-blur-sm flex-shrink-0"
                  style={{ background: 'rgba(0,196,114,0.15)', borderColor: 'rgba(0,196,114,0.25)' }}
                >
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#00ff88' }} />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">The Sandbox</h2>
                  <p className="text-xs sm:text-sm" style={{ color: 'rgba(0,255,136,0.75)' }}>Zero pressure training</p>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3 mb-7 sm:mb-10">
                {trainingSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(0,255,136,0.15)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-white/90">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold tracking-wide" style={{ color: '#00ff88' }}>
              Start Training
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="h-px sm:h-auto sm:w-px" style={{ background: 'rgba(255,255,255,0.15)' }} />

        {/* Arena — Right */}
        <button
          onMouseEnter={() => setHoveredPath('trial')}
          onMouseLeave={() => setHoveredPath(null)}
          onClick={onEnterArena}
          className="relative overflow-hidden transition-all duration-500 group sm:flex-1"
          style={{
            minHeight: '320px',
            opacity: hoveredPath === 'training' ? 0.7 : 1,
          }}
        >
          {/* Background image — brighter overlay */}
          <div className="absolute inset-0">
            <img src="/right.png" alt="Arena" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.05) 100%)' }}
            />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between p-7 sm:p-10 lg:p-14" style={{ minHeight: '320px' }}>
            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border backdrop-blur-sm flex-shrink-0"
                  style={{ background: 'rgba(0,180,216,0.15)', borderColor: 'rgba(0,180,216,0.25)' }}
                >
                  <Sword className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#00d4ff' }} />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">The Arena</h2>
                  <p className="text-xs sm:text-sm" style={{ color: 'rgba(0,212,255,0.75)' }}>High-stakes verification</p>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3 mb-7 sm:mb-10">
                {arenaSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.25)', color: '#00d4ff' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-white/90">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold tracking-wide" style={{ color: '#00d4ff' }}>
              Enter Arena
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="border-t py-4 px-4 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs" style={{ color: 'var(--text-3)' }}>
          <span>© 2026 Pehchaan</span>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="hover:underline">Docs</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}
