'use client';

import React, { useState } from 'react';
import { GraduationCap, Sword, ChevronRight, ArrowRight, CheckCircle2, Zap, Target, Sparkles, Code2, Layers } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import { useUser } from '@/context/UserContext';

interface HomePageProps {
  onEnterTraining: () => void;
  onEnterArena: () => void;
}

const trainingSteps = ['Pick a skill', 'Find the bug', 'Fix it', 'Level up'];
const arenaSteps = ['Pick a challenge', 'Race the clock', 'Earn your badge'];

// Floating decorative elements - ONLY in gutters/borders, never overlapping content
const FloatingElements = () => {
  const elements = [
    // TOP EDGE (y: 0-4%) - across the top
    { top: '1%', left: '2%', opacity: 0.18, anim: 'slow', icon: 'code', color: 'cyan' },
    { top: '0.5%', left: '8%', opacity: 0.15, anim: 'medium', text: '</>', color: 'green' },
    { top: '2%', left: '15%', opacity: 0.16, anim: 'fast', icon: 'sparkles', color: 'cyan' },
    { top: '1%', left: '22%', opacity: 0.14, anim: 'slow', icon: 'layers', color: 'green' },
    { top: '0.5%', left: '30%', opacity: 0.18, anim: 'medium', text: '{ }', color: 'cyan' },
    { top: '2%', left: '38%', opacity: 0.15, anim: 'fast', icon: 'code', color: 'green' },
    { top: '1%', left: '45%', opacity: 0.16, anim: 'slow', text: '[]', color: 'cyan' },
    { top: '0.5%', left: '52%', opacity: 0.18, anim: 'medium', icon: 'layers', color: 'green' },
    { top: '2%', left: '60%', opacity: 0.15, anim: 'fast', icon: 'sparkles', color: 'cyan' },
    { top: '1%', left: '68%', opacity: 0.16, anim: 'slow', text: '=>', color: 'green' },
    { top: '0.5%', left: '75%', opacity: 0.18, anim: 'medium', icon: 'code', color: 'cyan' },
    { top: '2%', left: '82%', opacity: 0.15, anim: 'fast', text: 'fn', color: 'green' },
    { top: '1%', left: '90%', opacity: 0.16, anim: 'slow', icon: 'layers', color: 'cyan' },
    { top: '0.5%', left: '96%', opacity: 0.14, anim: 'medium', icon: 'sparkles', color: 'green' },

    // LEFT GUTTER (x: 0-30%, y: 5-95%) - 30% width gutter
    { top: '8%', left: '3%', opacity: 0.16, anim: 'slow', icon: 'code', color: 'cyan' },
    { top: '14%', left: '6%', opacity: 0.12, anim: 'fast', text: '</>', color: 'green' },
    { top: '20%', left: '3%', opacity: 0.14, anim: 'medium', icon: 'layers', color: 'cyan' },
    { top: '26%', left: '9%', opacity: 0.12, anim: 'slow', icon: 'sparkles', color: 'green' },
    { top: '32%', left: '3%', opacity: 0.16, anim: 'fast', text: '[]', color: 'cyan' },
    { top: '38%', left: '12%', opacity: 0.12, anim: 'medium', icon: 'code', color: 'green' },
    { top: '44%', left: '6%', opacity: 0.14, anim: 'slow', text: '&&', color: 'cyan' },
    { top: '50%', left: '9%', opacity: 0.12, anim: 'fast', icon: 'layers', color: 'green' },
    { top: '56%', left: '3%', opacity: 0.16, anim: 'medium', icon: 'sparkles', color: 'cyan' },
    { top: '62%', left: '12%', opacity: 0.12, anim: 'slow', text: '=>', color: 'green' },
    { top: '68%', left: '6%', opacity: 0.14, anim: 'fast', icon: 'code', color: 'cyan' },
    { top: '74%', left: '9%', opacity: 0.12, anim: 'medium', text: ';;', color: 'green' },
    { top: '80%', left: '3%', opacity: 0.16, anim: 'slow', icon: 'layers', color: 'cyan' },
    { top: '86%', left: '12%', opacity: 0.12, anim: 'fast', icon: 'sparkles', color: 'green' },
    { top: '92%', left: '6%', opacity: 0.14, anim: 'medium', text: '!!', color: 'cyan' },

    // RIGHT GUTTER (x: 70-100%, y: 5-95%) - 30% width gutter
    { top: '8%', left: '94%', opacity: 0.16, anim: 'slow', icon: 'code', color: 'green' },
    { top: '14%', left: '91%', opacity: 0.12, anim: 'fast', text: '</>', color: 'cyan' },
    { top: '20%', left: '94%', opacity: 0.14, anim: 'medium', icon: 'layers', color: 'green' },
    { top: '26%', left: '88%', opacity: 0.12, anim: 'slow', icon: 'sparkles', color: 'cyan' },
    { top: '32%', left: '94%', opacity: 0.16, anim: 'fast', text: '[]', color: 'green' },
    { top: '38%', left: '85%', opacity: 0.12, anim: 'medium', icon: 'code', color: 'cyan' },
    { top: '44%', left: '91%', opacity: 0.14, anim: 'slow', text: '||', color: 'green' },
    { top: '50%', left: '88%', opacity: 0.12, anim: 'fast', icon: 'layers', color: 'cyan' },
    { top: '56%', left: '94%', opacity: 0.16, anim: 'medium', icon: 'sparkles', color: 'green' },
    { top: '62%', left: '85%', opacity: 0.12, anim: 'slow', text: '=>', color: 'cyan' },
    { top: '68%', left: '91%', opacity: 0.14, anim: 'fast', icon: 'code', color: 'green' },
    { top: '74%', left: '88%', opacity: 0.12, anim: 'medium', text: 'fn', color: 'cyan' },
    { top: '80%', left: '94%', opacity: 0.16, anim: 'slow', icon: 'layers', color: 'green' },
    { top: '86%', left: '85%', opacity: 0.12, anim: 'fast', icon: 'sparkles', color: 'cyan' },
    { top: '92%', left: '91%', opacity: 0.14, anim: 'medium', text: '//', color: 'green' },

    // BOTTOM EDGE (y: 96-100%) - across the bottom
    { top: '97%', left: '2%', opacity: 0.16, anim: 'slow', icon: 'layers', color: 'cyan' },
    { top: '98%', left: '8%', opacity: 0.14, anim: 'medium', text: '{ }', color: 'green' },
    { top: '96%', left: '15%', opacity: 0.18, anim: 'fast', icon: 'code', color: 'cyan' },
    { top: '99%', left: '22%', opacity: 0.12, anim: 'slow', icon: 'sparkles', color: 'green' },
    { top: '97%', left: '30%', opacity: 0.16, anim: 'medium', text: '[]', color: 'cyan' },
    { top: '96%', left: '38%', opacity: 0.14, anim: 'fast', icon: 'layers', color: 'green' },
    { top: '98%', left: '45%', opacity: 0.18, anim: 'slow', icon: 'code', color: 'cyan' },
    { top: '97%', left: '52%', opacity: 0.12, anim: 'medium', text: '=>', color: 'green' },
    { top: '99%', left: '60%', opacity: 0.16, anim: 'fast', icon: 'sparkles', color: 'cyan' },
    { top: '96%', left: '68%', opacity: 0.14, anim: 'slow', icon: 'layers', color: 'green' },
    { top: '98%', left: '75%', opacity: 0.18, anim: 'medium', text: 'fn', color: 'cyan' },
    { top: '97%', left: '82%', opacity: 0.12, anim: 'fast', icon: 'code', color: 'green' },
    { top: '96%', left: '90%', opacity: 0.16, anim: 'slow', icon: 'sparkles', color: 'cyan' },
    { top: '99%', left: '96%', opacity: 0.14, anim: 'medium', text: '</>', color: 'green' },

    // Dense: LEFT GUTTER row 2 (fills the 30% gutter better)
    { top: '11%', left: '4%', opacity: 0.10, anim: 'slow', text: '()', color: 'cyan' },
    { top: '17%', left: '7%', opacity: 0.10, anim: 'fast', icon: 'code', color: 'green' },
    { top: '23%', left: '4%', opacity: 0.10, anim: 'medium', text: '==', color: 'cyan' },
    { top: '29%', left: '10%', opacity: 0.10, anim: 'slow', icon: 'layers', color: 'green' },
    { top: '35%', left: '4%', opacity: 0.10, anim: 'fast', text: '&&', color: 'cyan' },
    { top: '41%', left: '7%', opacity: 0.10, anim: 'medium', icon: 'sparkles', color: 'green' },
    { top: '47%', left: '4%', opacity: 0.10, anim: 'slow', text: '!!', color: 'cyan' },
    { top: '53%', left: '10%', opacity: 0.10, anim: 'fast', icon: 'code', color: 'green' },
    { top: '59%', left: '4%', opacity: 0.10, anim: 'medium', text: ';;', color: 'cyan' },
    { top: '65%', left: '7%', opacity: 0.10, anim: 'slow', icon: 'layers', color: 'green' },
    { top: '71%', left: '4%', opacity: 0.10, anim: 'fast', text: '||', color: 'cyan' },
    { top: '77%', left: '10%', opacity: 0.10, anim: 'medium', icon: 'sparkles', color: 'green' },
    { top: '83%', left: '4%', opacity: 0.10, anim: 'slow', text: '=>', color: 'cyan' },
    { top: '89%', left: '7%', opacity: 0.10, anim: 'fast', icon: 'code', color: 'green' },

    // Dense: RIGHT GUTTER row 2
    { top: '11%', left: '93%', opacity: 0.10, anim: 'slow', text: '()', color: 'green' },
    { top: '17%', left: '90%', opacity: 0.10, anim: 'fast', icon: 'code', color: 'cyan' },
    { top: '23%', left: '93%', opacity: 0.10, anim: 'medium', text: '==', color: 'green' },
    { top: '29%', left: '87%', opacity: 0.10, anim: 'slow', icon: 'layers', color: 'cyan' },
    { top: '35%', left: '93%', opacity: 0.10, anim: 'fast', text: '&&', color: 'green' },
    { top: '41%', left: '90%', opacity: 0.10, anim: 'medium', icon: 'sparkles', color: 'cyan' },
    { top: '47%', left: '93%', opacity: 0.10, anim: 'slow', text: '!!', color: 'green' },
    { top: '53%', left: '87%', opacity: 0.10, anim: 'fast', icon: 'code', color: 'cyan' },
    { top: '59%', left: '93%', opacity: 0.10, anim: 'medium', text: ';;', color: 'green' },
    { top: '65%', left: '90%', opacity: 0.10, anim: 'slow', icon: 'layers', color: 'cyan' },
    { top: '71%', left: '93%', opacity: 0.10, anim: 'fast', text: '||', color: 'green' },
    { top: '77%', left: '87%', opacity: 0.10, anim: 'medium', icon: 'sparkles', color: 'cyan' },
    { top: '83%', left: '93%', opacity: 0.10, anim: 'slow', text: '=>', color: 'green' },
    { top: '89%', left: '90%', opacity: 0.10, anim: 'fast', icon: 'code', color: 'cyan' },

    // Top edge extra
    { top: '3%', left: '5%', opacity: 0.10, anim: 'fast', text: 'fn', color: 'cyan' },
    { top: '0%', left: '12%', opacity: 0.10, anim: 'slow', icon: 'layers', color: 'green' },
    { top: '4%', left: '18%', opacity: 0.10, anim: 'medium', text: '&&', color: 'cyan' },
    { top: '1%', left: '25%', opacity: 0.10, anim: 'fast', icon: 'code', color: 'green' },
    { top: '3%', left: '33%', opacity: 0.10, anim: 'slow', text: '||', color: 'cyan' },
    { top: '0%', left: '42%', opacity: 0.10, anim: 'medium', icon: 'sparkles', color: 'green' },
    { top: '4%', left: '48%', opacity: 0.10, anim: 'fast', text: '!!', color: 'cyan' },
    { top: '1%', left: '58%', opacity: 0.10, anim: 'slow', icon: 'layers', color: 'green' },
    { top: '3%', left: '65%', opacity: 0.10, anim: 'medium', text: ';;', color: 'cyan' },
    { top: '0%', left: '72%', opacity: 0.10, anim: 'fast', icon: 'code', color: 'green' },
    { top: '4%', left: '78%', opacity: 0.10, anim: 'slow', text: 'fn', color: 'cyan' },
    { top: '1%', left: '88%', opacity: 0.10, anim: 'medium', icon: 'sparkles', color: 'green' },

    // Bottom edge extra
    { top: '99%', left: '5%', opacity: 0.10, anim: 'fast', text: 'fn', color: 'green' },
    { top: '96%', left: '12%', opacity: 0.10, anim: 'slow', icon: 'layers', color: 'cyan' },
    { top: '99%', left: '18%', opacity: 0.10, anim: 'medium', text: '&&', color: 'green' },
    { top: '97%', left: '25%', opacity: 0.10, anim: 'fast', icon: 'code', color: 'cyan' },
    { top: '99%', left: '33%', opacity: 0.10, anim: 'slow', text: '||', color: 'green' },
    { top: '96%', left: '42%', opacity: 0.10, anim: 'medium', icon: 'sparkles', color: 'cyan' },
    { top: '99%', left: '48%', opacity: 0.10, anim: 'fast', text: '!!', color: 'green' },
    { top: '97%', left: '58%', opacity: 0.10, anim: 'slow', icon: 'layers', color: 'cyan' },
    { top: '99%', left: '65%', opacity: 0.10, anim: 'medium', text: ';;', color: 'green' },
    { top: '96%', left: '72%', opacity: 0.10, anim: 'fast', icon: 'code', color: 'cyan' },
    { top: '99%', left: '78%', opacity: 0.10, anim: 'slow', text: 'fn', color: 'green' },
    { top: '97%', left: '88%', opacity: 0.10, anim: 'medium', icon: 'sparkles', color: 'cyan' },

    // Corner clusters (more prominent now)
    { top: '2%', left: '1%', opacity: 0.20, anim: 'slow', icon: 'code', color: 'cyan' },
    { top: '4%', left: '2%', opacity: 0.18, anim: 'fast', text: '</>', color: 'green' },
    { top: '0%', left: '4%', opacity: 0.16, anim: 'medium', icon: 'layers', color: 'cyan' },
    { top: '98%', left: '1%', opacity: 0.20, anim: 'slow', icon: 'code', color: 'green' },
    { top: '99%', left: '2%', opacity: 0.18, anim: 'fast', text: '</>', color: 'cyan' },
    { top: '96%', left: '4%', opacity: 0.16, anim: 'medium', icon: 'layers', color: 'green' },
    { top: '2%', left: '96%', opacity: 0.20, anim: 'slow', icon: 'code', color: 'cyan' },
    { top: '4%', left: '95%', opacity: 0.18, anim: 'fast', text: '</>', color: 'green' },
    { top: '0%', left: '93%', opacity: 0.16, anim: 'medium', icon: 'layers', color: 'cyan' },
    { top: '98%', left: '96%', opacity: 0.20, anim: 'slow', icon: 'code', color: 'green' },
    { top: '99%', left: '95%', opacity: 0.18, anim: 'fast', text: '</>', color: 'cyan' },
    { top: '96%', left: '93%', opacity: 0.16, anim: 'medium', icon: 'layers', color: 'green' },

    // Extra elements for denser 30% gutters
    { top: '15%', left: '15%', opacity: 0.12, anim: 'slow', icon: 'code', color: 'cyan' },
    { top: '22%', left: '18%', opacity: 0.12, anim: 'fast', icon: 'sparkles', color: 'green' },
    { top: '30%', left: '15%', opacity: 0.12, anim: 'medium', text: '{ }', color: 'cyan' },
    { top: '40%', left: '20%', opacity: 0.12, anim: 'slow', icon: 'layers', color: 'green' },
    { top: '55%', left: '15%', opacity: 0.12, anim: 'fast', text: '[]', color: 'cyan' },
    { top: '70%', left: '18%', opacity: 0.12, anim: 'medium', icon: 'code', color: 'green' },
    { top: '85%', left: '15%', opacity: 0.12, anim: 'slow', text: '=>', color: 'cyan' },

    { top: '15%', left: '82%', opacity: 0.12, anim: 'slow', icon: 'code', color: 'green' },
    { top: '22%', left: '79%', opacity: 0.12, anim: 'fast', icon: 'sparkles', color: 'cyan' },
    { top: '30%', left: '82%', opacity: 0.12, anim: 'medium', text: '{ }', color: 'green' },
    { top: '40%', left: '77%', opacity: 0.12, anim: 'slow', icon: 'layers', color: 'cyan' },
    { top: '55%', left: '82%', opacity: 0.12, anim: 'fast', text: '[]', color: 'green' },
    { top: '70%', left: '79%', opacity: 0.12, anim: 'medium', icon: 'code', color: 'cyan' },
    { top: '85%', left: '82%', opacity: 0.12, anim: 'slow', text: '=>', color: 'green' },
  ];

  const animClass: Record<string, string> = {
    slow: 'animate-float-slow',
    medium: 'animate-float-medium',
    fast: 'animate-float-fast',
  };

  const getIcon = (type: string, color: string) => {
    const c = color === 'cyan' ? 'var(--cyan)' : 'var(--green)';
    switch (type) {
      case 'code': return <Code2 className="w-5 h-5" style={{ color: c }} />;
      case 'layers': return <Layers className="w-5 h-5" style={{ color: c }} />;
      case 'sparkles': return <Sparkles className="w-4 h-4" style={{ color: c }} />;
      default: return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((el, i) => (
        <div
          key={i}
          className={`absolute ${animClass[el.anim] || ''}`}
          style={{
            top: el.top,
            left: el.left,
            opacity: el.opacity,
            zIndex: 0,
          }}
        >
          {el.text ? (
            <span className="text-xs font-mono font-bold" style={{ color: el.color === 'cyan' ? 'var(--cyan)' : 'var(--green)' }}>
              {el.text}
            </span>
          ) : (
            getIcon(el.icon || '', el.color)
          )}
        </div>
      ))}
    </div>
  );
};

export default function HomePage({ onEnterTraining, onEnterArena }: HomePageProps) {
  const [hovered, setHovered] = useState<'training' | 'arena' | null>(null);
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--bg)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-0" style={{
        backgroundImage: `radial-gradient(circle, var(--text) 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }} />

      {/* Floating decorative elements - STRICTLY in gutters only */}
      <FloatingElements />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="pt-20 sm:pt-24 pb-8 sm:pb-10 px-4 sm:px-6 relative z-10">
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
            <StatPill icon={<Zap className="w-4 h-4" />} value="8" label="Sandbox modules" color="var(--green)" />
            <StatPill icon={<Target className="w-4 h-4" />} value="7" label="Arena bounties" color="var(--cyan)" />
            <StatPill icon={<CheckCircle2 className="w-4 h-4" />} value="AI" label="Adjudicated" color="#d97706" />
          </div>
        </div>
      </div>

      {/* ── Two Paths ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0 relative z-10">
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
        className="border-t border-b py-10 px-4 sm:px-6 relative z-10"
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
      <footer className="border-t relative z-10" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/pehchaan_logo.png" alt="Pehchaan" className="h-8 w-8 object-contain" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Pehchaan</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>© 2026 · Pakistan & beyond</span>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/AhmadSaeedZaidi/pehchaan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-colors hover:scale-110"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-colors hover:scale-110"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              title="X (Twitter)"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:hello@pehchaan.dev"
              className="p-2 rounded-lg transition-colors hover:scale-110"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              title="Contact"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>

          {/* Version badge */}
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-3)',
                background: 'var(--bg-secondary)',
                boxShadow: '0 0 10px rgba(0,212,255,0.1)'
              }}
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
      className="relative overflow-hidden sm:flex-1 group text-left transition-all duration-300"
      style={{
        minHeight: '420px',
        opacity: isOtherHovered ? 0.7 : 1,
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: isHovered
          ? `0 0 40px ${accent}40, 0 20px 40px rgba(0,0,0,0.3)`
          : '0 0 0 transparent',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 10,
      }}
    >
      {/* Animated border glow */}
      <div
        className="absolute inset-0 rounded-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${accent}, transparent, ${accent})`,
            backgroundSize: '200% 100%',
            animation: isHovered ? 'borderGlow 2s linear infinite' : 'none',
          }}
        />
      </div>

      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
          style={{
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isHovered
              ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.25) 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0.0) 100%)',
            transition: 'background 0.4s ease',
          }}
        />
      </div>

      <div
        className="relative z-10 h-full flex flex-col justify-between p-7 sm:p-10 lg:p-14"
        style={{ minHeight: '420px' }}
      >
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border backdrop-blur-sm flex-shrink-0 transition-all duration-300"
              style={{
                background: isHovered ? accent : accentBgStrong,
                borderColor: isHovered ? 'transparent' : accentBorder,
                color: isHovered ? 'var(--bg)' : accent,
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isHovered ? `0 0 20px ${accent}` : 'none',
              }}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white">{title}</h3>
              <p className="text-sm sm:text-base font-medium" style={{ color: `color-mix(in srgb, ${accent} 90%, white 10%)` }}>
                {subtitle}
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 transition-all duration-300"
                  style={{
                    background: isHovered ? accent : accentBgFaint,
                    border: `1px solid ${isHovered ? 'transparent' : accentBorder}`,
                    color: isHovered ? 'var(--bg)' : accent,
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-base sm:text-lg font-medium text-white/90">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-base sm:text-lg font-bold tracking-wide" style={{ color: accent }}>
          <span className={isHovered ? 'tracking-wider' : ''} style={{ transition: 'letter-spacing 0.3s ease' }}>
            {ctaLabel}
          </span>
          <div
            className="relative overflow-hidden"
            style={{ width: '24px', height: '24px' }}
          >
            <ChevronRight
              className="absolute w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300"
              style={{
                transform: isHovered ? 'translateX(0) rotate(0deg)' : 'translateX(-24px) rotate(-90deg)',
                opacity: isHovered ? 1 : 0,
              }}
            />
            <ArrowRight
              className="absolute w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300"
              style={{
                transform: isHovered ? 'translateX(0) rotate(0deg)' : 'translateX(24px) rotate(90deg)',
                opacity: isHovered ? 1 : 0,
              }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}