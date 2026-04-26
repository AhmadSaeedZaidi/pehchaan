'use client';

import React from 'react';
import { Calendar, ExternalLink, RefreshCw, Sparkles, Trophy, Award, AlertCircle, Star, Circle } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';

const langBadgeStyles: Record<string, { bg: string; color: string }> = {
  TypeScript: { bg: 'rgba(208,158,155,0.15)', color: '#d09e9b' },
  JavaScript: { bg: 'rgba(165,188,148,0.15)', color: '#a5bc94' },
  Python:     { bg: 'rgba(165,188,148,0.15)', color: '#a5bc94' },
  Go:         { bg: 'rgba(208,158,155,0.15)', color: '#d09e9b' },
  Rust:       { bg: 'rgba(208,158,155,0.15)', color: '#d09e9b' },
  Java:       { bg: 'rgba(60,65,92,0.12)', color: '#3C415C' },
  Ruby:       { bg: 'rgba(60,65,92,0.12)', color: '#3C415C' },
  Swift:      { bg: 'rgba(208,158,155,0.15)', color: '#d09e9b' },
  Kotlin:     { bg: 'rgba(165,188,148,0.15)', color: '#a5bc94' },
  C:          { bg: 'rgba(60,65,92,0.12)',   color: '#3C415C' },
  'C++':      { bg: 'rgba(208,158,155,0.15)', color: '#d09e9b' },
  HTML:       { bg: 'rgba(208,158,155,0.15)', color: '#d09e9b' },
  CSS:        { bg: 'rgba(165,188,148,0.15)', color: '#a5bc94' },
  Shell:      { bg: 'rgba(165,188,148,0.15)', color: '#a5bc94' },
  Dockerfile: { bg: 'rgba(165,188,148,0.15)', color: '#a5bc94' },
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
          <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-3)' }} strokeWidth={1.5} />
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

  const gridColor = theme === 'dark' ? 'rgba(226,213,211,0.1)' : 'rgba(60,65,92,0.1)';
  const tickColor = theme === 'dark' ? '#8A8377' : '#6B7280';
  const initials = initialsOf(user.displayName, user.githubUsername);
  const accountAge = user.badges.length > 0 ? `${user.badges.length} verified ${user.badges.length === 1 ? 'badge' : 'badges'}` : 'No badges yet';

  return (
    <div className="pt-16 sm:pt-20 pb-12 min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        {/* Organic blob decoration */}
        <div className="absolute top-40 right-0 w-64 h-64 opacity-5 pointer-events-none">
          <svg viewBox="0 0 200 200" style={{ fill: '#d09e9b' }}>
            <path d="M150,-10C180,40,190,100,150,150C110,200,50,200,10,150C-30,100,-40,40,-10,-10C20,-60,120,-60,150,-10Z" />
          </svg>
        </div>

        {/* Profile header */}
        <div
          className="rounded-3xl border overflow-hidden mb-6"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          {/* Subtle gradient strip with organic feel */}
          <div className="h-1.5" style={{ background: 'linear-gradient(90deg, var(--pink), var(--green-accent))' }} />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName ?? user.githubUsername}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0 border-2"
                  style={{ borderColor: 'var(--border)' }}
                />
              ) : (
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--pink)' }}
                >
                  <span className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--beige)' }}>{initials}</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
                    {user.displayName ?? user.githubUsername}
                  </h1>
                  {user.status === 'Verified Dev' && (
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full font-medium border"
                      style={{
                        color: 'var(--pink)',
                        background: 'rgba(219,163,158,0.1)',
                        borderColor: 'rgba(219,163,158,0.25)',
                      }}
                    >
                      <Star className="w-3 h-3 celestial-icon" />
                      Verified
                    </span>
                  )}
                </div>

                <a
                  href={user.githubUrl ?? `https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm hover:underline mb-3"
                  style={{ color: 'var(--text-3)' }}
                >
                  <GithubIcon className="w-4 h-4" />
                  @{user.githubUsername}
                  <ExternalLink className="w-3 h-3 opacity-60" strokeWidth={1.5} />
                </a>

                {user.bio && (
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-2)', lineHeight: '1.6' }}>
                    {user.bio}
                  </p>
                )}

                {user.profileSummary && (
                  <div
                    className="text-sm leading-relaxed p-4 rounded-xl border-l-2"
                    style={{
                      background: 'var(--bg)',
                      borderColor: 'var(--pink)',
                      color: 'var(--text-2)',
                    }}
                  >
                    <span className="not-italic text-[10px] uppercase tracking-widest font-medium mr-2" style={{ color: 'var(--pink)', letterSpacing: '0.15em' }}>
                      AI Analysis
                    </span>
                    {user.profileSummary}
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-end gap-4 flex-shrink-0">
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
                    {user.ptsScore.toLocaleString()}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-medium mt-1" style={{ color: 'var(--text-3)', letterSpacing: '0.1em' }}>
                    Trust Score
                  </div>
                </div>
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="btn-pill btn-pill-outline text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Languages strip */}
            {user.primaryLanguages.length > 0 && (
              <div className="mt-6 pt-5 border-t flex items-center gap-2 flex-wrap" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--text-3)', letterSpacing: '0.1em' }}>
                  Top languages
                </span>
                {user.primaryLanguages.map((lang) => {
                  const s = langStyle(lang);
                  return (
                    <span
                      key={lang}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
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

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard label="Trust Score" value={user.ptsScore.toLocaleString()} accent="var(--pink)" />
          <StatCard label="Badges" value={user.badges.length.toString()} accent="var(--green-accent)" />
          <StatCard label="Status" value={user.status} accent="#8B7355" small />
          <StatCard label="Achievements" value={accountAge} accent="#7c6f64" small />
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Skills radar */}
          <div className="lg:col-span-1 rounded-2xl border p-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Skill Estimates</h2>
              <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--pink)', letterSpacing: '0.1em' }}>AI</span>
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
                    stroke="var(--pink)"
                    fill="var(--pink)"
                    fillOpacity={0.18}
                    strokeWidth={1.8}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {radarData.map((s) => (
                <div key={s.subject}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-3)' }}>{s.subject}</span>
                    <span className="font-medium tabular-nums" style={{ color: 'var(--text)' }}>{s.value}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: 'var(--pink)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trophy case */}
          <div className="lg:col-span-2 rounded-2xl border p-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Trophy Case</h2>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>{user.badges.length} earned</span>
            </div>

            {user.badges.length === 0 ? (
              <div
                className="rounded-xl border-2 border-dashed p-8 text-center"
                style={{ borderColor: 'var(--border)' }}
              >
                <Trophy className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-3)' }} strokeWidth={1.5} />
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>No badges yet</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>
                  Solve a challenge in <span style={{ color: 'var(--pink)' }}>The Arena</span> to earn your first badge.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {user.badges.map((badgeId) => (
                  <div
                    key={badgeId}
                    className="p-4 rounded-xl border"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: 'rgba(219,163,158,0.15)' }}
                    >
                      <Award className="w-5 h-5" style={{ color: 'var(--pink)' }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-medium text-sm mb-1 capitalize leading-snug" style={{ color: 'var(--text)' }}>
                      {badgeId.replace(/-/g, ' ')}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: 'var(--text-3)' }}>
                      <Calendar className="w-3 h-3" strokeWidth={1.5} />
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
      className="rounded-2xl border p-4"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      <div
        className={`${small ? 'text-base' : 'text-2xl sm:text-3xl'} font-semibold tabular-nums leading-tight`}
        style={{ color: accent }}
      >
        {value}
      </div>
      <div
        className="text-[10px] uppercase tracking-widest font-medium mt-1"
        style={{ color: 'var(--text-3)', letterSpacing: '0.1em' }}
      >
        {label}
      </div>
    </div>
  );
}
