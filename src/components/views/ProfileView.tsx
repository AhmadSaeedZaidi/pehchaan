'use client';

import React, { useState } from 'react';
import { MessageCircle, Calendar, Clock, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { mockUser } from '@/data/mockData';
import { Badge } from '@/types';

export default function ProfileView() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  const radarData = [
    { subject: 'Backend', value: mockUser.skills.backend, fullMark: 100 },
    { subject: 'Frontend', value: mockUser.skills.frontend, fullMark: 100 },
    { subject: 'Database', value: mockUser.skills.database, fullMark: 100 },
    { subject: 'DevOps', value: mockUser.skills.devops, fullMark: 100 },
    { subject: 'Security', value: mockUser.skills.security, fullMark: 100 },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTechBadgeColor = (tech: string) => {
    const colors: Record<string, string> = {
      React: 'from-cyan-400 to-blue-500',
      'Node.js': 'from-green-400 to-emerald-500',
      TypeScript: 'from-blue-400 to-indigo-500',
      Backend: 'from-orange-400 to-red-500',
      Python: 'from-yellow-400 to-orange-500',
      Express: 'from-green-400 to-teal-500',
    };
    return colors[tech] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Profile Header */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                  <span className="text-3xl font-bold text-black">{mockUser.avatar}</span>
                </div>
                {mockUser.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-[#1a1a1a]">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                  {mockUser.isVerified && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <a 
                    href={mockUser.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                  <a 
                    href={`https://wa.me/${mockUser.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {mockUser.reputation.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Reputation Score</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Radar Chart */}
          <div className="col-span-1 bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="text-cyan-400">⚡</span>
              Verified Skills
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} className="radar-glow">
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#a0a0a0', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#666', fontSize: 10 }}
                  />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#00d4ff"
                    fill="#00d4ff"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Skill Breakdown */}
            <div className="mt-6 space-y-3">
              {radarData.map((skill) => (
                <div key={skill.subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{skill.subject}</span>
                    <span className="font-medium">{skill.value}%</span>
                  </div>
                  <div className="h-2 bg-[#121212] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trophy Case */}
          <div className="col-span-2">
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="text-amber-400">🏆</span>
                Trophy Case
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {mockUser.badges.map((badge) => (
                  <button
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className="p-4 bg-[#121212] rounded-xl border border-white/5 hover:border-amber-500/30 transition-all group text-left"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getTechBadgeColor(badge.techStack)} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <span className="text-2xl">🏅</span>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{badge.description}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(badge.earnedAt)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-bold mb-4">Combat Statistics</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-[#121212] rounded-xl">
                  <div className="text-2xl font-bold text-cyan-400">{mockUser.badges.length}</div>
                  <div className="text-xs text-gray-500">Badges Earned</div>
                </div>
                <div className="text-center p-4 bg-[#121212] rounded-xl">
                  <div className="text-2xl font-bold text-emerald-400">12</div>
                  <div className="text-xs text-gray-500">Challenges Beaten</div>
                </div>
                <div className="text-center p-4 bg-[#121212] rounded-xl">
                  <div className="text-2xl font-bold text-amber-400">156</div>
                  <div className="text-xs text-gray-500">Total Hours</div>
                </div>
                <div className="text-center p-4 bg-[#121212] rounded-xl">
                  <div className="text-2xl font-bold text-orange-400">23%</div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getTechBadgeColor(selectedBadge.techStack)} flex items-center justify-center`}>
                <span className="text-3xl">🏅</span>
              </div>
              <button 
                onClick={() => setSelectedBadge(null)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold mb-2">{selectedBadge.name}</h2>
            <p className="text-gray-400 mb-6">{selectedBadge.description}</p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Challenge</span>
                <span className="font-medium">{selectedBadge.challenge}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Tech Stack</span>
                <span className="font-medium">{selectedBadge.techStack}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Completion Time</span>
                <span className="font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedBadge.completionTime}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500">Earned</span>
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedBadge.earnedAt)}
                </span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-[#121212] rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Verification Hash</p>
              <p className="font-mono text-xs text-cyan-400 break-all">
                0x{Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
