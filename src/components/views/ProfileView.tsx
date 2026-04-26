'use client';

import React, { useState } from 'react';
import { MessageCircle, Calendar, Clock, X, ExternalLink } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { mockUser } from '@/data/mockData';
import { Badge } from '@/types';
import { useTheme } from '@/context/ThemeContext';

const techStyles: Record<string, { color: string; bg: string }> = {
  React:      { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
  'Node.js':  { color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  TypeScript: { color: '#4f46e5', bg: 'rgba(79,70,229,0.1)' },
  Backend:    { color: '#ea580c', bg: 'rgba(234,88,12,0.1)' },
  Python:     { color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  Express:    { color: '#0d9488', bg: 'rgba(13,148,136,0.1)' },
};

function getTechStyle(tech: string) {
  return techStyles[tech] ?? { color: 'var(--text-3)', bg: 'var(--bg-tertiary)' };
}

function fmtDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

function badgeHash(id: string): string {
  return id.split('').map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('').repeat(4).slice(0, 64);
}

const techIcon: Record<string, string> = { React: '⚛', 'Node.js': '⬡', TypeScript: 'TS', Backend: '⚙', Python: '🐍', Express: '⚡' };

export default function ProfileView() {
  const { theme } = useTheme();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const radarData = [
    { subject: 'Backend',  value: mockUser.skills.backend },
    { subject: 'Frontend', value: mockUser.skills.frontend },
    { subject: 'Database', value: mockUser.skills.database },
    { subject: 'DevOps',   value: mockUser.skills.devops },
    { subject: 'Security', value: mockUser.skills.security },
  ];

  const gridColor = theme === 'dark' ? '#2a2a2a' : '#e5e5e5';
  const tickColor = theme === 'dark' ? '#666' : '#999';

  return (
    <div className="pt-16 sm:pt-20 pb-10 sm:pb-12 min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1300px] mx-auto px-3 sm:px-6">

        {/* Profile header */}
        <div className="rounded-2xl border p-5 sm:p-7 mb-5 sm:mb-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center" style={{ background: 'var(--cyan)' }}>
                  <span className="text-lg sm:text-2xl font-bold text-white">{mockUser.avatar}</span>
                </div>
                {mockUser.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2"
                    style={{ background: 'var(--cyan)', borderColor: 'var(--bg-secondary)' }}
                  >
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-base sm:text-xl font-bold" style={{ color: 'var(--text)' }}>{mockUser.name}</h1>
                  {mockUser.isVerified && (
                    <span
                      className="px-2 py-0.5 text-xs rounded-full font-medium border"
                      style={{ color: 'var(--cyan)', background: 'rgba(0,180,216,0.1)', borderColor: 'rgba(0,180,216,0.2)' }}
                    >
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <a
                    href={mockUser.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs sm:text-sm hover:underline"
                    style={{ color: 'var(--text-3)' }}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    {mockUser.github.replace('https://github.com/', '@')}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                  <a
                    href={`https://wa.me/${mockUser.whatsapp.replace(/\D/g,'')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs sm:text-sm hover:underline"
                    style={{ color: 'var(--text-3)' }}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-2xl sm:text-4xl font-bold tabular-nums" style={{ color: 'var(--text)' }}>
                {mockUser.reputation.toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>Pehchaan Trust Score</div>
            </div>
          </div>
        </div>

        {/* Grid — stack on mobile */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Skills radar */}
          <div className="lg:col-span-1 rounded-2xl border p-5 sm:p-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-semibold mb-4 sm:mb-5" style={{ color: 'var(--text)' }}>Verified Skills</h2>
            <div className="h-[220px] sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: tickColor, fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: tickColor, fontSize: 9 }} />
                  <Radar name="Skills" dataKey="value" stroke="var(--cyan)" fill="var(--cyan)" fillOpacity={0.12} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-2.5">
              {radarData.map((s) => (
                <div key={s.subject}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-3)' }}>{s.subject}</span>
                    <span className="font-medium" style={{ color: 'var(--text)' }}>{s.value}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: 'var(--cyan)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
            {/* Trophy case */}
            <div className="rounded-2xl border p-5 sm:p-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-semibold mb-4 sm:mb-5" style={{ color: 'var(--text)' }}>Trophy Case</h2>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {mockUser.badges.map((badge) => {
                  const s = getTechStyle(badge.techStack);
                  return (
                    <button
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      className="p-3 sm:p-4 rounded-xl border text-left transition-all group"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                    >
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition-transform"
                        style={{ background: s.bg }}
                      >
                        <span className="text-base sm:text-lg" style={{ color: s.color }}>{techIcon[badge.techStack] ?? '★'}</span>
                      </div>
                      <h3 className="font-semibold text-xs sm:text-sm mb-0.5 leading-snug" style={{ color: 'var(--text)' }}>{badge.name}</h3>
                      <p className="text-[11px] sm:text-xs line-clamp-1 sm:line-clamp-2" style={{ color: 'var(--text-3)' }}>{badge.description}</p>
                      <div className="flex items-center gap-1 mt-2 sm:mt-3 text-[10px] sm:text-[11px]" style={{ color: 'var(--text-3)' }}>
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {fmtDate(badge.earnedAt)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border p-5 sm:p-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-semibold mb-3 sm:mb-4" style={{ color: 'var(--text)' }}>Statistics</h2>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: 'Badges',     value: mockUser.badges.length, color: 'var(--cyan)' },
                  { label: 'Challenges', value: 12,    color: 'var(--green)' },
                  { label: 'Hours',      value: 156,   color: '#d97706' },
                  { label: 'Pass Rate',  value: '23%', color: '#f97316' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-3 sm:p-4 rounded-xl"
                    style={{ background: 'var(--bg)' }}
                  >
                    <div className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-[10px] sm:text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="rounded-2xl border p-6 sm:p-8 max-w-sm w-full shadow-2xl" style={{ background: 'var(--bg)', borderColor: 'var(--border-strong)' }}>
            <div className="flex justify-between items-start mb-5">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
                style={{ background: getTechStyle(selectedBadge.techStack).bg }}
              >
                <span className="text-xl sm:text-2xl" style={{ color: getTechStyle(selectedBadge.techStack).color }}>
                  {techIcon[selectedBadge.techStack] ?? '★'}
                </span>
              </div>
              <button onClick={() => setSelectedBadge(null)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-3)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-base sm:text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>{selectedBadge.name}</h2>
            <p className="text-sm mb-5" style={{ color: 'var(--text-3)' }}>{selectedBadge.description}</p>

            <div className="divide-y mb-5" style={{ borderColor: 'var(--border)' }}>
              {[
                { label: 'Challenge',  value: selectedBadge.challenge },
                { label: 'Tech Stack', value: selectedBadge.techStack },
                { label: 'Time',       value: selectedBadge.completionTime, icon: <Clock className="w-3.5 h-3.5 mr-1 opacity-50" /> },
                { label: 'Earned',     value: fmtDate(selectedBadge.earnedAt), icon: <Calendar className="w-3.5 h-3.5 mr-1 opacity-50" /> },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 text-sm">
                  <span style={{ color: 'var(--text-3)' }}>{row.label}</span>
                  <span className="font-medium flex items-center" style={{ color: 'var(--text)' }}>{row.icon}{row.value}</span>
                </div>
              ))}
            </div>

            <div className="p-3 sm:p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-[10px] uppercase tracking-widest mb-1.5 font-mono" style={{ color: 'var(--text-3)' }}>Verification Hash</p>
              <p className="font-mono text-[10px] sm:text-[11px] break-all leading-relaxed" style={{ color: 'var(--cyan)' }}>
                0x{badgeHash(selectedBadge.id)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
