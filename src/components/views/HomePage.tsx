'use client';

import React, { useState } from 'react';
import { GraduationCap, Sword, ChevronRight, ArrowRight, CheckCircle2, Zap, Target } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import { useUser } from '@/context/UserContext';

interface HomePageProps {
  onEnterTraining: () => void;
  onEnterArena: () => void;
}

const trainingSteps = ['Pick a skill', 'Find the bug', 'Fix it', 'Level up'];
const arenaSteps = ['Pick a challenge', 'Race the clock', 'Earn your badge'];

export default function HomePage({ onEnterTraining, onEnterArena }: HomePageProps) {
  const [hovered, setHovered] = useState<'training' | 'arena' | null>(null);
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="pt-20 sm:pt-24 pb-8 sm:pb-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Bilingual title */}
          <div className="mb-5 sm:mb-6">
            <h1
              className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Pehchaan
            </h1>
            <p
              className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.4]"
              style={{
                color: 'var(--cyan)',
                fontFamily: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif',
              }}
            >
              پہچان
            </p>
          </div>

          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-5 leading-snug"
            style={{ color: 'var(--text)' }}
          >
            The Unrecognised <span style={{ color: 'var(--cyan)' }}>Get Verified</span>
          </h2>

          <p
            className="text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed mb-7 sm:mb-9"
            style={{ color: 'var(--text-3)' }}
          >
            An open infrastructure layer that maps informal tech talent to real opportunities.
            Stop watching others get credit for your work — prove what you can build.
          </p>

          {/* Welcome banner — only when logged in */}
          {user && (
            <div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border mb-7 sm:mb-9"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
              }}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.displayName ?? user.githubUsername} className="w-6 h-6 rounded-full" />
              ) : (
                <GithubIcon className="w-4 h-4" style={{ color: 'var(--text-2)' }} />
              )}
              <span className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>
                Welcome back, <span style={{ color: 'var(--text)' }}>{user.displayName ?? user.githubUsername}</span>
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(0,196,114,0.15)', color: 'var(--green)' }}
              >
                {user.ptsScore} PTS
              </span>
            </div>
          )}

          {/* Stats row — NeetCode-style */}
          <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl mx-auto mb-1">
            <StatPill icon={<Zap className="w-4 h-4" />} value="6" label="Sandbox modules" color="var(--green)" />
            <StatPill icon={<Target className="w-4 h-4" />} value="5" label="Arena bounties" color="var(--cyan)" />
            <StatPill icon={<CheckCircle2 className="w-4 h-4" />} value="AI" label="Adjudicated" color="#d97706" />
          </div>
        </div>
      </div>

      {/* ── Two Paths ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0">
        <PathCard
          variant="training"
          imageSrc="/left.png"
          title="The Sandbox"
          subtitle="Zero pressure training"
          icon={<GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />}
          steps={trainingSteps}
          ctaLabel="Start Training"
          accent="#00ff88"
          accentBgFaint="rgba(0,255,136,0.15)"
          accentBgStrong="rgba(0,196,114,0.18)"
          accentBorder="rgba(0,255,136,0.3)"
          isHovered={hovered === 'training'}
          isOtherHovered={hovered === 'arena'}
          onMouseEnter={() => setHovered('training')}
          onMouseLeave={() => setHovered(null)}
          onClick={onEnterTraining}
        />

        {/* Divider */}
        <div className="h-px sm:h-auto sm:w-px bg-white/20" />

        <PathCard
          variant="arena"
          imageSrc="/right.png"
          title="The Arena"
          subtitle="High-stakes verification"
          icon={<Sword className="w-6 h-6 sm:w-7 sm:h-7" />}
          steps={arenaSteps}
          ctaLabel="Enter Arena"
          accent="#00d4ff"
          accentBgFaint="rgba(0,180,216,0.15)"
          accentBgStrong="rgba(0,180,216,0.18)"
          accentBorder="rgba(0,180,216,0.3)"
          isHovered={hovered === 'arena'}
          isOtherHovered={hovered === 'training'}
          onMouseEnter={() => setHovered('arena')}
          onMouseLeave={() => setHovered(null)}
          onClick={onEnterArena}
        />
      </div>

      {/* ── How it works strip ───────────────────────────────── */}
      <div
        className="border-t border-b py-10 px-4 sm:px-6"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[10px] uppercase tracking-widest font-mono font-semibold mb-2 text-center"
            style={{ color: 'var(--cyan)' }}
          >
            How verification works
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={{ color: 'var(--text)' }}>
            Skill, not credentials.
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                num: '01',
                title: 'Sign in with GitHub',
                desc: 'Enter your handle. We fetch your public profile, repos and web context.',
              },
              {
                num: '02',
                title: 'AI builds your profile',
                desc: 'Tavily retrieves context, Gemini analyses it, your real skill profile is generated.',
              },
              {
                num: '03',
                title: 'Earn your Trust Score',
                desc: 'Fix real bugs in The Arena. Get scored by AI. Build cryptographic badges.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="rounded-xl p-5 sm:p-6 border transition-all"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
              >
                <div
                  className="text-xs font-mono font-semibold mb-3"
                  style={{ color: 'var(--cyan)' }}
                >
                  STEP {item.num}
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                  {item.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {!user && (
            <div className="text-center mt-8">
              <p className="text-sm mb-3" style={{ color: 'var(--text-3)' }}>
                Ready to be seen for what you actually do?
              </p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onEnterArena();
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: 'var(--cyan)' }}
              >
                Get verified <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
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
            >
              GitHub
            </a>
            <a
              href="mailto:hello@pehchaan.dev"
              className="hover:underline transition-colors"
              style={{ color: 'var(--text-3)' }}
            >
              Contact
            </a>
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-mono border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}
            >
              v0.2-mvp
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function StatPill({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1 px-3 py-3 sm:py-4 rounded-xl border"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-1.5" style={{ color }}>
        {icon}
        <span className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: 'var(--text)' }}>{value}</span>
      </div>
      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
        {label}
      </span>
    </div>
  );
}

interface PathCardProps {
  variant: 'training' | 'arena';
  imageSrc: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  steps: string[];
  ctaLabel: string;
  accent: string;
  accentBgFaint: string;
  accentBgStrong: string;
  accentBorder: string;
  isHovered: boolean;
  isOtherHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

function PathCard({
  imageSrc,
  title,
  subtitle,
  icon,
  steps,
  ctaLabel,
  accent,
  accentBgFaint,
  accentBgStrong,
  accentBorder,
  isHovered,
  isOtherHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: PathCardProps) {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="relative overflow-hidden sm:flex-1 group text-left"
      style={{
        minHeight: '380px',
        opacity: isOtherHovered ? 0.65 : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
          style={{
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isHovered
              ? 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.20) 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0.0) 100%)',
            transition: 'background 0.4s ease',
          }}
        />
      </div>

      <div
        className="relative z-10 h-full flex flex-col justify-between p-7 sm:p-10 lg:p-14"
        style={{ minHeight: '380px' }}
      >
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border backdrop-blur-sm flex-shrink-0"
              style={{ background: accentBgStrong, borderColor: accentBorder, color: accent }}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">{title}</h3>
              <p className="text-xs sm:text-sm" style={{ color: `color-mix(in srgb, ${accent} 80%, white 20%)` }}>
                {subtitle}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3 mb-7 sm:mb-10">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0"
                  style={{ background: accentBgFaint, border: `1px solid ${accentBorder}`, color: accent }}
                >
                  {i + 1}
                </span>
                <span className="text-sm sm:text-base font-medium text-white/90">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide" style={{ color: accent }}>
          {ctaLabel}
          <ChevronRight
            className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200"
            style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}
          />
        </div>
      </div>
    </button>
  );
}
