'use client';

import React, { useState } from 'react';
import { GraduationCap, Sword, ChevronRight, ArrowRight, CheckCircle2, Zap, Target, Sparkles, Star, Moon, Circle } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import { useUser } from '@/context/UserContext';

interface HomePageProps {
  onEnterTraining: () => void;
  onEnterArena: () => void;
}

const trainingSteps = ['Pick a skill', 'Find the bug', 'Fix it', 'Level up'];
const arenaSteps = ['Pick a challenge', 'Race the clock', 'Earn your badge'];

// Organic Blob SVG Components with blur filter for ambient feel
const OrganicBlobTopLeft = () => (
  <svg 
    viewBox="0 0 400 400" 
    className="absolute -top-20 -left-20 w-96 h-96 opacity-50 animate-blob blob-blur"
    style={{ fill: '#a5bc94' }}
  >
    <path d="M300,-0.7C350,50,380,120,350,180C320,240,240,280,160,280C80,280,20,220,-20,160C-60,100,-80,20,-40,-40C0,-100,50,-50,100,-60C150,-70,250,-50,300,-0.7Z" />
  </svg>
);

const OrganicBlobBottomRight = () => (
  <svg 
    viewBox="0 0 400 400" 
    className="absolute -bottom-20 -right-20 w-[500px] h-[500px] opacity-45 animate-blob blob-blur"
    style={{ fill: '#d09e9b', animationDelay: '-4s' }}
  >
    <path d="M400,80C440,160,420,260,340,300C260,340,140,340,80,280C20,220,0,120,40,40C80,-40,180,-40,240,-20C300,0,360,0,400,80Z" />
  </svg>
);

const OrganicBlobTopRight = () => (
  <svg 
    viewBox="0 0 300 300" 
    className="absolute -top-10 right-20 w-64 h-64 opacity-35 animate-blob blob-blur"
    style={{ fill: '#d09e9b', animationDelay: '-2s' }}
  >
    <path d="M200,-10C260,60,280,140,220,200C160,260,60,260,20,200C-20,140,-40,60,20,0C80,-60,140,-80,200,-10Z" />
  </svg>
);

const OrganicBlobMidLeft = () => (
  <svg 
    viewBox="0 0 250 250" 
    className="absolute top-1/3 -left-16 w-56 h-56 opacity-40 animate-blob blob-blur"
    style={{ fill: '#a5bc94', animationDelay: '-6s' }}
  >
    <path d="M180,0C220,50,230,120,180,170C130,220,50,220,0,170C-50,120,-60,50,-20,0C20,-50,140,-50,180,0Z" />
  </svg>
);

// Additional blobs for more ambient coverage
const OrganicBlobTopCenter = () => (
  <svg 
    viewBox="0 0 300 300" 
    className="absolute top-10 left-1/3 w-72 h-72 opacity-30 animate-blob blob-blur"
    style={{ fill: '#d09e9b', animationDelay: '-3s' }}
  >
    <path d="M250,50C300,100,280,180,200,220C120,260,40,240,0,180C-40,120,-20,40,40,0C100,-40,200,0,250,50Z" />
  </svg>
);

const OrganicBlobBottomLeft = () => (
  <svg 
    viewBox="0 0 350 350" 
    className="absolute -bottom-10 left-1/4 w-64 h-64 opacity-35 animate-blob blob-blur"
    style={{ fill: '#a5bc94', animationDelay: '-5s' }}
  >
    <path d="M280,20C320,80,340,160,280,220C220,280,120,300,60,240C0,180,-20,80,40,20C100,-40,240,-40,280,20Z" />
  </svg>
);

const OrganicBlobMidRight = () => (
  <svg 
    viewBox="0 0 280 280" 
    className="absolute top-1/2 right-10 w-48 h-48 opacity-25 animate-blob blob-blur"
    style={{ fill: '#a5bc94', animationDelay: '-7s' }}
  >
    <path d="M200,40C240,80,260,140,200,180C140,220,60,220,20,160C-20,100,0,40,60,0C120,-40,160,-20,200,40Z" />
  </svg>
);

const OrganicBlobBottomCenter = () => (
  <svg 
    viewBox="0 0 320 320" 
    className="absolute bottom-1/4 left-1/2 w-56 h-56 opacity-30 animate-blob blob-blur"
    style={{ fill: '#d09e9b', animationDelay: '-8s' }}
  >
    <path d="M240,40C280,100,300,180,240,240C180,300,80,320,20,260C-40,200,-20,100,40,40C100,-20,200,-20,240,40Z" />
  </svg>
);

// Code-themed decorative elements - enhanced visibility with darker rose for legibility
const CodeDecorations = () => {
  // Using #c4928f as a darker, more legible rose while maintaining muted aesthetic
  const roseColor = '#c4928f';
  const greenColor = '#8fa87a';
  
  const elements = [
    // Top area
    { top: '4%', left: '6%', opacity: 0.5, anim: 'slow', type: 'angle', color: roseColor, size: 'text-lg' },
    { top: '7%', left: '18%', opacity: 0.45, anim: 'medium', type: 'brace', color: greenColor, size: 'text-base' },
    { top: '3%', left: '35%', opacity: 0.5, anim: 'fast', type: 'bracket', color: roseColor, size: 'text-xl' },
    { top: '8%', left: '52%', opacity: 0.45, anim: 'slow', type: 'comment', color: greenColor, size: 'text-sm' },
    { top: '5%', left: '70%', opacity: 0.5, anim: 'medium', type: 'angle', color: roseColor, size: 'text-base' },
    { top: '2%', left: '85%', opacity: 0.45, anim: 'fast', type: 'brace', color: greenColor, size: 'text-lg' },
    { top: '9%', left: '95%', opacity: 0.4, anim: 'slow', type: 'bracket', color: roseColor, size: 'text-base' },
    
    // Upper-middle area
    { top: '14%', left: '3%', opacity: 0.45, anim: 'fast', type: 'semicolon', color: greenColor, size: 'text-sm' },
    { top: '16%', left: '12%', opacity: 0.5, anim: 'slow', type: 'bracket', color: roseColor, size: 'text-lg' },
    { top: '12%', left: '28%', opacity: 0.4, anim: 'medium', type: 'angle', color: greenColor, size: 'text-base' },
    { top: '18%', left: '42%', opacity: 0.45, anim: 'fast', type: 'brace', color: roseColor, size: 'text-sm' },
    { top: '15%', left: '58%', opacity: 0.5, anim: 'slow', type: 'comment', color: greenColor, size: 'text-base' },
    { top: '13%', left: '75%', opacity: 0.4, anim: 'medium', type: 'semicolon', color: roseColor, size: 'text-sm' },
    { top: '17%', left: '88%', opacity: 0.45, anim: 'fast', type: 'angle', color: greenColor, size: 'text-lg' },
    
    // Middle area
    { top: '28%', left: '5%', opacity: 0.4, anim: 'slow', type: 'brace', color: greenColor, size: 'text-base' },
    { top: '32%', left: '10%', opacity: 0.45, anim: 'medium', type: 'angle', color: roseColor, size: 'text-sm' },
    { top: '26%', left: '22%', opacity: 0.5, anim: 'fast', type: 'bracket', color: greenColor, size: 'text-lg' },
    { top: '30%', left: '38%', opacity: 0.4, anim: 'slow', type: 'semicolon', color: roseColor, size: 'text-sm' },
    { top: '34%', left: '48%', opacity: 0.45, anim: 'medium', type: 'comment', color: greenColor, size: 'text-base' },
    { top: '28%', left: '62%', opacity: 0.5, anim: 'fast', type: 'brace', color: roseColor, size: 'text-sm' },
    { top: '33%', left: '78%', opacity: 0.4, anim: 'slow', type: 'angle', color: greenColor, size: 'text-base' },
    { top: '27%', left: '92%', opacity: 0.45, anim: 'medium', type: 'bracket', color: roseColor, size: 'text-lg' },
    
    // Lower-middle area
    { top: '42%', left: '2%', opacity: 0.45, anim: 'fast', type: 'angle', color: roseColor, size: 'text-sm' },
    { top: '46%', left: '8%', opacity: 0.4, anim: 'slow', type: 'semicolon', color: greenColor, size: 'text-base' },
    { top: '40%', left: '18%', opacity: 0.5, anim: 'medium', type: 'brace', color: roseColor, size: 'text-lg' },
    { top: '44%', left: '32%', opacity: 0.4, anim: 'fast', type: 'bracket', color: greenColor, size: 'text-sm' },
    { top: '48%', left: '45%', opacity: 0.45, anim: 'slow', type: 'comment', color: roseColor, size: 'text-base' },
    { top: '41%', left: '58%', opacity: 0.5, anim: 'medium', type: 'angle', color: greenColor, size: 'text-sm' },
    { top: '47%', left: '72%', opacity: 0.4, anim: 'fast', type: 'semicolon', color: roseColor, size: 'text-lg' },
    { top: '43%', left: '85%', opacity: 0.45, anim: 'slow', type: 'brace', color: greenColor, size: 'text-base' },
    { top: '45%', left: '96%', opacity: 0.4, anim: 'medium', type: 'bracket', color: roseColor, size: 'text-sm' },
    
    // Lower area
    { top: '56%', left: '4%', opacity: 0.45, anim: 'slow', type: 'brace', color: greenColor, size: 'text-base' },
    { top: '60%', left: '15%', opacity: 0.4, anim: 'fast', type: 'angle', color: roseColor, size: 'text-sm' },
    { top: '54%', left: '28%', opacity: 0.5, anim: 'medium', type: 'semicolon', color: greenColor, size: 'text-lg' },
    { top: '58%', left: '42%', opacity: 0.4, anim: 'slow', type: 'bracket', color: roseColor, size: 'text-base' },
    { top: '62%', left: '55%', opacity: 0.45, anim: 'fast', type: 'comment', color: greenColor, size: 'text-sm' },
    { top: '57%', left: '68%', opacity: 0.5, anim: 'medium', type: 'brace', color: roseColor, size: 'text-base' },
    { top: '61%', left: '82%', opacity: 0.4, anim: 'slow', type: 'angle', color: greenColor, size: 'text-lg' },
    { top: '55%', left: '94%', opacity: 0.45, anim: 'fast', type: 'semicolon', color: roseColor, size: 'text-sm' },
    
    // Bottom area
    { top: '72%', left: '3%', opacity: 0.45, anim: 'medium', type: 'bracket', color: greenColor, size: 'text-base' },
    { top: '76%', left: '12%', opacity: 0.4, anim: 'slow', type: 'angle', color: roseColor, size: 'text-sm' },
    { top: '70%', left: '25%', opacity: 0.5, anim: 'fast', type: 'brace', color: greenColor, size: 'text-lg' },
    { top: '74%', left: '38%', opacity: 0.4, anim: 'medium', type: 'comment', color: roseColor, size: 'text-base' },
    { top: '78%', left: '52%', opacity: 0.45, anim: 'slow', type: 'semicolon', color: greenColor, size: 'text-sm' },
    { top: '73%', left: '65%', opacity: 0.5, anim: 'fast', type: 'bracket', color: roseColor, size: 'text-base' },
    { top: '77%', left: '78%', opacity: 0.4, anim: 'medium', type: 'angle', color: greenColor, size: 'text-lg' },
    { top: '71%', left: '90%', opacity: 0.45, anim: 'slow', type: 'brace', color: roseColor, size: 'text-sm' },
    
    // Lower-bottom area
    { top: '84%', left: '6%', opacity: 0.4, anim: 'fast', type: 'semicolon', color: greenColor, size: 'text-base' },
    { top: '86%', left: '18%', opacity: 0.45, anim: 'slow', type: 'angle', color: roseColor, size: 'text-sm' },
    { top: '82%', left: '32%', opacity: 0.5, anim: 'medium', type: 'bracket', color: greenColor, size: 'text-lg' },
    { top: '88%', left: '45%', opacity: 0.4, anim: 'fast', type: 'brace', color: roseColor, size: 'text-base' },
    { top: '85%', left: '58%', opacity: 0.45, anim: 'slow', type: 'comment', color: greenColor, size: 'text-sm' },
    { top: '87%', left: '72%', opacity: 0.5, anim: 'medium', type: 'semicolon', color: roseColor, size: 'text-base' },
    { top: '83%', left: '85%', opacity: 0.4, anim: 'fast', type: 'angle', color: greenColor, size: 'text-lg' },
    
    // Bottom area
    { top: '92%', left: '10%', opacity: 0.45, anim: 'slow', type: 'bracket', color: roseColor, size: 'text-sm' },
    { top: '95%', left: '25%', opacity: 0.4, anim: 'medium', type: 'brace', color: greenColor, size: 'text-base' },
    { top: '91%', left: '40%', opacity: 0.5, anim: 'fast', type: 'angle', color: roseColor, size: 'text-lg' },
    { top: '96%', left: '55%', opacity: 0.4, anim: 'slow', type: 'comment', color: greenColor, size: 'text-sm' },
    { top: '93%', left: '68%', opacity: 0.45, anim: 'medium', type: 'semicolon', color: roseColor, size: 'text-base' },
    { top: '97%', left: '82%', opacity: 0.5, anim: 'fast', type: 'bracket', color: greenColor, size: 'text-sm' },
    { top: '94%', left: '92%', opacity: 0.4, anim: 'slow', type: 'brace', color: roseColor, size: 'text-lg' },
  ];

  const animClass: Record<string, string> = {
    slow: 'animate-float-slow',
    medium: 'animate-float-medium',
    fast: 'animate-float-fast',
  };

  const getSymbol = (type: string, color: string, size: string) => {
    const baseStyle = { color, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };
    switch (type) {
      case 'angle': return <span className={size} style={baseStyle}>{'<' + '/' + '>'}</span>;
      case 'brace': return <span className={size} style={baseStyle}>{'{' + '}'}</span>;
      case 'bracket': return <span className={size} style={baseStyle}>{'[' + ']'}</span>;
      case 'comment': return <span className={size} style={baseStyle}>{'/*' + ' */'}</span>;
      case 'semicolon': return <span className={size} style={baseStyle}>{';'}</span>;
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
          {getSymbol(el.type, el.color, el.size)}
        </div>
      ))}
    </div>
  );
};

export default function HomePage({ onEnterTraining, onEnterArena }: HomePageProps) {
  const [hovered, setHovered] = useState<'training' | 'arena' | null>(null);
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Organic Blob Backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <OrganicBlobTopLeft />
        <OrganicBlobTopRight />
        <OrganicBlobBottomRight />
        <OrganicBlobMidLeft />
        <OrganicBlobTopCenter />
        <OrganicBlobBottomLeft />
        <OrganicBlobMidRight />
        <OrganicBlobBottomCenter />
      </div>
      
      {/* Code decorations */}
      <CodeDecorations />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 px-6 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Bilingual title SVG */}
          <div className="mb-10 sm:mb-14">
            <img 
              src="/pehchaan_text.svg" 
              alt="Pehchaan" 
              className="mx-auto w-[300px] sm:w-[400px] lg:w-[500px] h-auto"
            />
          </div>

          <h2
            className="text-xl sm:text-2xl lg:text-3xl mb-6 sm:mb-8 leading-snug"
            style={{ 
              letterSpacing: '0.01em',
              fontFamily: "'Bricolage Grotesque', sans-serif"
            }}
          >
            <span style={{ color: 'var(--text)', fontWeight: 500 }}>The Unrecognised</span>{' '}
            <span style={{ color: 'var(--pink)', fontWeight: 400, fontStyle: 'italic' }}>Get Verified</span>
          </h2>

          <p
            className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-8 mb-12 sm:mb-16"
            style={{ 
              color: 'var(--text-3)',
            }}
          >
            An open infrastructure layer that maps informal tech talent to real opportunities.
            Stop watching others get credit for your work — prove what you can build.
          </p>

          {/* Welcome banner — only when logged in */}
          {user && (
            <div
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border mb-10 sm:mb-14"
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
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(161, 176, 130, 0.2)', color: 'var(--green-accent)' }}
              >
                {user.ptsScore} PTS
              </span>
            </div>
          )}

          {/* Stats row - Clean Modern Dashboard */}
          <div 
            className="grid grid-cols-3 gap-5 sm:gap-6 max-w-2xl mx-auto py-8 sm:py-10"
          >
            <div 
              className="flex flex-col items-center justify-center gap-3 px-6 py-7 rounded-xl"
              style={{ 
                background: 'var(--bg-secondary)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}
            >
              <Zap 
                className="w-6 h-6" 
                style={{ color: '#8fa87a', strokeWidth: 2 }} 
              />
              <span 
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: 'var(--text)', fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                8
              </span>
              <span 
                className="text-[10px] font-medium uppercase tracking-widest"
                style={{ color: 'var(--text-3)', fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '0.12em' }}
              >
                Sandbox Modules
              </span>
            </div>
            
            <div 
              className="flex flex-col items-center justify-center gap-3 px-6 py-7 rounded-xl"
              style={{ 
                background: 'var(--bg-secondary)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}
            >
              <Target 
                className="w-6 h-6" 
                style={{ color: '#c4928f', strokeWidth: 2 }} 
              />
              <span 
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: 'var(--text)', fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                7
              </span>
              <span 
                className="text-[10px] font-medium uppercase tracking-widest"
                style={{ color: 'var(--text-3)', fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '0.12em' }}
              >
                Arena Bounties
              </span>
            </div>
            
            <div 
              className="flex flex-col items-center justify-center gap-3 px-6 py-7 rounded-xl"
              style={{ 
                background: 'var(--bg-secondary)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}
            >
              <CheckCircle2 
                className="w-6 h-6" 
                style={{ color: '#8B7355', strokeWidth: 2 }} 
              />
              <span 
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: 'var(--text)', fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                AI
              </span>
              <span 
                className="text-[10px] font-medium uppercase tracking-widest"
                style={{ color: 'var(--text-3)', fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '0.12em' }}
              >
                Adjudicated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Organic Divider ────────────────────────────────── */}
      <div className="relative h-20 overflow-hidden z-10">
        <svg viewBox="0 0 1440 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path 
            d="M0,40 Q360,0 720,40 Q1080,80 1440,40 L1440,80 L0,80 Z" 
            fill="var(--bg-secondary)" 
          />
        </svg>
      </div>

      {/* ── Two Paths ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0 relative z-10" style={{ background: '#1E2028' }}>
        <PathCard
          variant="training"
          imageSrc="/left.png"
          title="The Sandbox"
          subtitle="Zero pressure training"
          icon={<GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />}
          steps={trainingSteps}
          ctaLabel="Start Training"
          accent="var(--green-accent)"
          accentBgFaint="rgba(161,176,130,0.15)"
          accentBgStrong="rgba(161,176,130,0.2)"
          accentBorder="rgba(161,176,130,0.35)"
          isHovered={hovered === 'training'}
          isOtherHovered={hovered === 'arena'}
          onMouseEnter={() => setHovered('training')}
          onMouseLeave={() => setHovered(null)}
          onClick={onEnterTraining}
        />

        {/* Organic Divider */}
        <div className="relative hidden sm:block" style={{ width: '3px' }}>
          <svg viewBox="0 0 3 600" className="absolute inset-0 h-full w-full">
            <path d="M1.5,0 Q0,150 1.5,300 Q3,450 1.5,600" stroke="rgba(60,65,92,0.1)" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="h-1 sm:h-auto sm:w-px" style={{ background: 'rgba(60,65,92,0.08)' }} />

        <PathCard
          variant="arena"
          imageSrc="/right.png"
          title="The Arena"
          subtitle="High-stakes verification"
          icon={<Sword className="w-6 h-6 sm:w-7 sm:h-7" />}
          steps={arenaSteps}
          ctaLabel="Enter Arena"
          accent="var(--pink)"
          accentBgFaint="rgba(219,163,158,0.15)"
          accentBgStrong="rgba(219,163,158,0.2)"
          accentBorder="rgba(219,163,158,0.35)"
          isHovered={hovered === 'arena'}
          isOtherHovered={hovered === 'training'}
          onMouseEnter={() => setHovered('arena')}
          onMouseLeave={() => setHovered(null)}
          onClick={onEnterArena}
        />
      </div>

      {/* ── Organic Divider ────────────────────────────────── */}
      <div className="relative h-16 overflow-hidden z-10" style={{ background: '#1E2028' }}>
        <svg viewBox="0 0 1440 64" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path 
            d="M0,32 Q240,64 480,32 Q720,0 960,32 Q1200,64 1440,32 L1440,0 L0,0 Z" 
            fill="var(--bg)" 
          />
        </svg>
      </div>

      {/* ── How it works strip ───────────────────────────────── */}
      <div className="py-14 sm:py-20 px-6 sm:px-8 relative z-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-4 h-4 celestial-icon" style={{ color: 'var(--pink)' }} />
              <p
                className="text-[11px] uppercase tracking-widest font-medium"
                style={{ color: 'var(--pink)', letterSpacing: '0.15em' }}
              >
                How verification works
              </p>
              <Star className="w-4 h-4 celestial-icon" style={{ color: 'var(--pink)' }} />
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center" style={{ 
              color: 'var(--text)',
              letterSpacing: '-0.01em'
            }}>
              Skill, not credentials.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
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
                className="flex flex-col items-center justify-center gap-3 px-6 py-7 rounded-xl text-center"
                style={{ 
                  background: 'var(--bg-secondary)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                }}
              >
                <div
                  className="text-xs font-medium uppercase"
                  style={{ color: 'var(--pink)', letterSpacing: '0.12em', fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  STEP {item.num}
                </div>
                <h4 
                  className="text-lg font-bold" 
                  style={{ color: 'var(--text)', fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {item.title}
                </h4>
                <p 
                  className="text-sm leading-relaxed" 
                  style={{ color: 'var(--text-3)', lineHeight: '1.6' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {!user && (
            <div className="text-center mt-10 sm:mt-14">
              <p className="text-sm mb-4" style={{ color: 'var(--text-3)' }}>
                Ready to be seen for what you actually do?
              </p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onEnterArena();
                }}
                className="btn-pill btn-pill-primary inline-flex items-center gap-2"
              >
                Get verified <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="relative z-10" style={{ background: 'var(--bg)' }}>
        {/* Organic top border */}
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path 
              d="M0,16 Q360,32 720,16 Q1080,0 1440,16 L1440,32 L0,32 Z" 
              fill="var(--bg-secondary)" 
            />
          </svg>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/pehchaan_logo.png" alt="Pehchaan" className="h-8 w-8 object-contain" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Pehchaan</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>© 2026 · Pakistan & beyond</span>
            </div>
          </div>
          
          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/AhmadSaeedZaidi/pehchaan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full transition-colors hover:scale-110"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com/pehchaan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full transition-colors hover:scale-110"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              title="X (Twitter)"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:hello@pehchaan.dev"
              className="p-2.5 rounded-full transition-colors hover:scale-110"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              title="Contact"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
          </div>

          {/* Version badge */}
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1.5 rounded-full text-[10px] font-medium border"
              style={{ 
                borderColor: 'var(--border)', 
                color: 'var(--text-3)',
                background: 'var(--bg-secondary)',
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
      className="stat-card flex flex-col items-center gap-3 px-5 py-6 sm:py-7 rounded-2xl border border-white/[0.30] dark:border-white/[0.08]"
      style={{ 
        background: 'var(--bg-secondary)', 
        boxShadow: '0 10px 40px -10px rgba(0,0,50,0.05)',
      }}
    >
      <div className="flex items-center gap-2.5" style={{ color }}>
        {icon}
        <span className="text-3xl sm:text-4xl font-bold tabular-nums" style={{ color: 'var(--text)', lineHeight: 1 }}>{value}</span>
      </div>
      <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
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
  variant,
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
  const isRight = variant === 'arena';
  
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`relative sm:flex-1 group ${isRight ? 'text-right' : 'text-left'}`}
      style={{
        minHeight: '480px',
        opacity: isOtherHovered ? 0.75 : 1,
        zIndex: 10,
      }}
    >
      <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            transformOrigin: 'center center',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>

      <div
        className={`relative z-10 h-full flex flex-col justify-between p-8 sm:p-10 lg:p-14 ${isRight ? 'items-end' : ''}`}
        style={{ minHeight: '480px' }}
      >
        <div className={isRight ? 'w-full' : ''}>
          <div className={`mb-6 sm:mb-10 ${isRight ? 'text-right' : ''}`}>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold" style={{ color: 'var(--slate)', fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.01em' }}>{title}</h3>
            <p className="text-lg sm:text-xl font-semibold mt-2" style={{ color: 'var(--slate)', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {subtitle}
            </p>
          </div>

          <div className={`space-y-4 sm:space-y-5 mb-10 sm:mb-14 ${isRight ? 'flex flex-col items-end' : ''}`}>
            {steps.map((step, i) => (
              <div key={i} className={`flex items-center gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
                <span
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                  style={{ 
                    background: accent, 
                    color: 'var(--beige)',
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-base sm:text-lg font-medium" style={{ color: 'var(--slate)', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div 
          className={`flex items-center gap-3 ${isRight ? 'flex-row-reverse' : ''} transition-all duration-300`}
          style={{ 
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <span 
            className="text-2xl sm:text-3xl font-bold tracking-wide" 
            style={{ 
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: '#fbf1e0',
            }}
          >
            {ctaLabel}
          </span>
          <ArrowRight className={`w-7 h-7 sm:w-8 sm:h-8 ${isRight ? 'rotate-180' : ''}`} style={{ color: '#fbf1e0' }} />
        </div>
      </div>
    </button>
  );
}
