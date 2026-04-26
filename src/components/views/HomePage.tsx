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
  const [hovered, setHovered] = useState<'training' | 'arena' | null>(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="pt-20 sm:pt-24 pb-6 sm:pb-8 text-center px-4 sm:px-6">
        {/* Big bilingual title */}
        <div className="mb-4 sm:mb-5">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Pehchaan
          </h1>
          <p
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{
              color: 'var(--cyan)',
              fontFamily: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif',
              lineHeight: 1.6,
            }}
          >
            پہچان
          </p>
        </div>

        <h2
          className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-snug"
          style={{ color: 'var(--text)' }}
        >
          The Unrecognised <span style={{ color: 'var(--cyan)' }}>Get Verified</span>
        </h2>

        <p
          className="text-sm sm:text-base max-w-sm sm:max-w-lg mx-auto leading-relaxed"
          style={{ color: 'var(--text-3)' }}
        >
          Stop watching others get credit for your work.<br className="hidden sm:block" />
          Prove what you can actually build.
        </p>
      </div>

      {/* ── Two Paths ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0">

        {/* Training — Left */}
        <button
          onMouseEnter={() => setHovered('training')}
          onMouseLeave={() => setHovered(null)}
          onClick={onEnterTraining}
          className="relative overflow-hidden sm:flex-1 group text-left"
          style={{ minHeight: '340px' }}
        >
          {/* Image — zooms on hover */}
          <div className="absolute inset-0">
            <img
              src="/left.png"
              alt="Training"
              className="w-full h-full object-cover"
              style={{
                transform: hovered === 'training' ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
            {/* Overlay: near-transparent default → dark on hover */}
            <div
              className="absolute inset-0"
              style={{
                background: hovered === 'training'
                  ? 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.18) 100%)'
                  : 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.0) 100%)',
                transition: 'background 0.4s ease',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-7 sm:p-10 lg:p-14" style={{ minHeight: '340px' }}>
            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border backdrop-blur-sm flex-shrink-0"
                  style={{ background: 'rgba(0,196,114,0.18)', borderColor: 'rgba(0,196,114,0.3)' }}
                >
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#00ff88' }} />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">The Sandbox</h3>
                  <p className="text-xs sm:text-sm" style={{ color: 'rgba(0,255,136,0.8)' }}>Zero pressure training</p>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3 mb-7 sm:mb-10">
                {trainingSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(0,255,136,0.15)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88' }}
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
              <ChevronRight
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200"
                style={{ transform: hovered === 'training' ? 'translateX(4px)' : 'translateX(0)' }}
              />
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="h-px sm:h-auto sm:w-px bg-white/20" />

        {/* Arena — Right */}
        <button
          onMouseEnter={() => setHovered('arena')}
          onMouseLeave={() => setHovered(null)}
          onClick={onEnterArena}
          className="relative overflow-hidden sm:flex-1 group text-left"
          style={{ minHeight: '340px' }}
        >
          {/* Image — zooms on hover */}
          <div className="absolute inset-0">
            <img
              src="/right.png"
              alt="Arena"
              className="w-full h-full object-cover"
              style={{
                transform: hovered === 'arena' ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
            {/* Overlay: near-transparent default → dark on hover */}
            <div
              className="absolute inset-0"
              style={{
                background: hovered === 'arena'
                  ? 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.18) 100%)'
                  : 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.0) 100%)',
                transition: 'background 0.4s ease',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-7 sm:p-10 lg:p-14" style={{ minHeight: '340px' }}>
            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border backdrop-blur-sm flex-shrink-0"
                  style={{ background: 'rgba(0,180,216,0.18)', borderColor: 'rgba(0,180,216,0.3)' }}
                >
                  <Sword className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#00d4ff' }} />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">The Arena</h3>
                  <p className="text-xs sm:text-sm" style={{ color: 'rgba(0,212,255,0.8)' }}>High-stakes verification</p>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3 mb-7 sm:mb-10">
                {arenaSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)', color: '#00d4ff' }}
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
              <ChevronRight
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200"
                style={{ transform: hovered === 'arena' ? 'translateX(4px)' : 'translateX(0)' }}
              />
            </div>
          </div>
        </button>
      </div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer
        className="border-t"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img src="/pehchaan_logo.png" alt="Pehchaan" className="h-6 w-6 object-contain opacity-80" />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>Pehchaan</span>
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>© 2026</span>
          </div>
          <p className="text-xs text-center sm:text-left" style={{ color: 'var(--text-3)' }}>
            Open infrastructure for unrecognised talent · Pakistan & beyond
          </p>
          <div className="flex items-center gap-5 text-xs" style={{ color: 'var(--text-3)' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-colors"
              style={{ color: 'var(--text-3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              GitHub
            </a>
            <a
              href="mailto:hello@pehchaan.dev"
              className="hover:underline transition-colors"
              style={{ color: 'var(--text-3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              Contact
            </a>
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-mono border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}
            >
              v0.1-mvp
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
