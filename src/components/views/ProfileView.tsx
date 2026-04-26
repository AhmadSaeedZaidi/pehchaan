'use client';

import React from 'react';
import { Calendar, ExternalLink, RefreshCw, Sparkles, Trophy, Award, AlertCircle } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';

const langBadgeStyles: Record<string, { bg: string; color: string }> = {
  TypeScript: { bg: 'rgba(79,70,229,0.12)', color: '#4f46e5' },
  JavaScript: { bg: 'rgba(217,119,6,0.12)', color: '#d97706' },
  Python:     { bg: 'rgba(217,119,6,0.12)', color: '#d97706' },
  Go:         { bg: 'rgba(13,148,136,0.12)', color: '#0d9488' },
  Rust:       { bg: 'rgba(234,88,12,0.12)', color: '#ea580c' },
  Java:       { bg: 'rgba(220,38,38,0.12)', color: '#dc2626' },
  Ruby:       { bg: 'rgba(220,38,38,0.12)', color: '#dc2626' },
  Swift:      { bg: 'rgba(234,88,12,0.12)', color: '#ea580c' },
  Kotlin:     { bg: 'rgba(124,58,237,0.12)', color: '#7c3aed' },
  C:          { bg: 'rgba(75,85,99,0.12)',   color: '#4b5563' },
  'C++':      { bg: 'rgba(37,99,235,0.12)',  color: '#2563eb' },
  HTML:       { bg: 'rgba(234,88,12,0.12)',  color: '#ea580c' },
  CSS:        { bg: 'rgba(37,99,235,0.12)',  color: '#2563eb' },
  Shell:      { bg: 'rgba(22,163,74,0.12)',  color: '#16a34a' },
  Dockerfile: { bg: 'rgba(37,99,235,0.12)',  color: '#2563eb' },
};

function langStyle(lang: string) {
  return langBadgeStyles[lang] ?? { bg: 'var(--bg-tertiary)', color: 'var(--text-2)' };
}

function initialsOf(name: string | null, fallback: string): string {
  const source = (name ?? '').trim() || fallback;
  return source.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

export default function ProfileView() {
  const { user, refresh, loading } = useUser();
  const { theme } = useTheme();

  if (!user) {
    return (
      <div className="pt-20 sm:pt-24 px-6 min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="max-w-md mx-auto rounded-2xl border p-8 text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
          <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>Sign in required</h2>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>Sign in with GitHub from the header to view your profile.</p>
        </div>
      </div>
    );
  }

  const skill = user.skillEstimates ?? {};
  const radarData = [
    { subject: 'Backend',  value: skill.backend  ?? 50 },
    { subject: 'Frontend', value: skill.frontend ?? 50 },
    { subject: 'Database', value: skill.database ?? 50 },
    { subject: 'DevOps',   value: skill.devops   ?? 50 },
    { subject: 'Security', value: skill.security ?? 50 },
  ];

  const gridColor = theme === 'dark' ? '#2a2a2a' : '#e5e5e5';
  const tickColor = theme === 'dark' ? '#888' : '#777';
  const initials = initialsOf(user.displayName, user.githubUsername);
  const accountAge = user.badges.length > 0 ? `${user.badges.length} verified ${user.badges.length === 1 ? 'badge' : 'badges'}` : 'No badges yet';

  return (
    <div className="pt-16 sm:pt-20 pb-12 min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1300px] mx-auto px-3 sm:px-6">

        {/* Profile header — NeetCode-style banner */}
        <div
          className="rounded-2xl border overflow-hidden mb-5 sm:mb-6"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          {/* Subtle gradient strip */}
          <div className="h-2" style={{ background: 'linear-gradient(90deg, var(--cyan), var(--green))' }} />

          <div className="p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName ?? user.githubUsername}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0 border-2"
                  style={{ borderColor: 'var(--border-strong)' }}
                />
              ) : (
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--cyan)' }}
                >
                  <span className="text-2xl sm:text-3xl font-bold text-white">{initials}</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
                    {user.displayName ?? user.githubUsername}
                  </h1>
                  {user.status === 'Verified Dev' && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full font-semibold border"
                      style={{
                        color: 'var(--cyan)',
                        background: 'rgba(0,180,216,0.1)',
                        borderColor: 'rgba(0,180,216,0.25)',
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <a
                  href={user.githubUrl ?? `https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm hover:underline mb-2"
                  style={{ color: 'var(--text-3)' }}
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  @{user.githubUsername}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                {user.bio && (
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}>
                    {user.bio}
                  </p>
                )}

                {user.profileSummary && (
                  <div
                    className="text-sm leading-relaxed p-3 rounded-lg border-l-2 italic"
                    style={{
                      background: 'var(--bg)',
                      borderColor: 'var(--cyan)',
                      color: 'var(--text-2)',
                    }}
                  >
                    <span className="not-italic font-mono text-[10px] uppercase tracking-widest mr-2" style={{ color: 'var(--cyan)' }}>
                      AI Analysis
                    </span>
                    {user.profileSummary}
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-end gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold tabular-nums" style={{ color: 'var(--text)' }}>
                    {user.ptsScore.toLocaleString()}
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest font-mono mt-0.5" style={{ color: 'var(--text-3)' }}>
                    Trust Score
                  </div>
                </div>
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors"
                  style={{
                    color: 'var(--text-3)',
                    borderColor: 'var(--border)',
                    background: 'var(--bg)',
                  }}
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Languages strip */}
            {user.primaryLanguages.length > 0 && (
              <div className="mt-5 pt-4 border-t flex items-center gap-2 flex-wrap" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-3)' }}>
                  Top languages
                </span>
                {user.primaryLanguages.map((lang) => {
                  const s = langStyle(lang);
                  return (
                    <span
                      key={lang}
                      className="text-xs px-2 py-0.5 rounded-md font-medium"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {lang}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Stats grid — NeetCode style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <StatCard label="Trust Score" value={user.ptsScore.toLocaleString()} accent="var(--cyan)" />
          <StatCard label="Badges" value={user.badges.length.toString()} accent="var(--green)" />
          <StatCard label="Status" value={user.status} accent="#d97706" small />
          <StatCard label="Achievements" value={accountAge} accent="#a855f7" small />
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

          {/* Skills radar */}
          <div className="lg:col-span-1 rounded-2xl border p-5 sm:p-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Skill Estimates</h2>
              <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--cyan)' }}>AI</span>
            </div>
            <div className="h-[220px] sm:h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: tickColor, fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: tickColor, fontSize: 9 }} />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="var(--cyan)"
                    fill="var(--cyan)"
                    fillOpacity={0.18}
                    strokeWidth={1.8}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {radarData.map((s) => (
                <div key={s.subject}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-3)' }}>{s.subject}</span>
                    <span className="font-medium tabular-nums" style={{ color: 'var(--text)' }}>{s.value}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: 'var(--cyan)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trophy case */}
          <div className="lg:col-span-2 rounded-2xl border p-5 sm:p-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Trophy Case</h2>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>{user.badges.length} earned</span>
            </div>

            {user.badges.length === 0 ? (
              <div
                className="rounded-xl border-2 border-dashed p-8 text-center"
                style={{ borderColor: 'var(--border)' }}
              >
                <Trophy className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>No badges yet</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>
                  Solve a challenge in <span style={{ color: 'var(--cyan)' }}>The Arena</span> to earn your first badge.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {user.badges.map((badgeId) => (
                  <div
                    key={badgeId}
                    className="p-3 sm:p-4 rounded-xl border"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5"
                      style={{ background: 'rgba(0,180,216,0.1)' }}
                    >
                      <Award className="w-4 h-4" style={{ color: 'var(--cyan)' }} />
                    </div>
                    <h3 className="font-semibold text-sm mb-0.5 capitalize leading-snug" style={{ color: 'var(--text)' }}>
                      {badgeId.replace(/-/g, ' ')}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-[11px]" style={{ color: 'var(--text-3)' }}>
                      <Calendar className="w-3 h-3" />
                      Recently earned
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: string;
  accent: string;
  small?: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-3 sm:p-4"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      <div
        className={`${small ? 'text-base' : 'text-2xl sm:text-3xl'} font-bold tabular-nums leading-tight`}
        style={{ color: accent }}
      >
        {value}
      </div>
      <div
        className="text-[10px] sm:text-xs uppercase tracking-widest font-mono mt-1"
        style={{ color: 'var(--text-3)' }}
      >
        {label}
      </div>
    </div>
  );
}
