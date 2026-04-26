'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Clock, Zap, AlertTriangle, ChevronRight, Terminal, X, Shield, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { bounties, generateTerminalLines } from '@/data/mockData';
import { Bounty, TerminalLine } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < level ? '#ef4444' : 'var(--border-strong)' }} />
      ))}
    </div>
  );
}

const lineColors: Record<TerminalLine['type'], string> = {
  error: '#f87171', warning: '#fbbf24', info: 'var(--text-3)', success: '#4ade80',
};

export default function ArenaView() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [code, setCode] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [viewMode, setViewMode] = useState<'solution' | 'original'>('solution');

  const startChallenge = useCallback((bounty: Bounty) => {
    setSelectedBounty(bounty);
    setTimeRemaining(bounty.timeLimit);
    setShowFailure(false);
    setShowSuccess(false);

    const savedSolution = user?.solutions?.[bounty.id];
    if (savedSolution) {
      setCode(savedSolution);
      setViewMode('solution');
      setTerminalLines([{ id: '1', type: 'info', message: 'Loaded previously successful fix.', timestamp: new Date().toISOString() }]);
    } else {
      setCode(`// ${bounty.title} — Find and fix the bugs!\n\nexport function processUserData(user: any) {\n  return user.name.toUpperCase();\n}\n\nexport async function fetchData(url: string) {\n  const response = await fetch(url);\n  return response.json();\n}\n\nexport class EventEmitter {\n  private events: Map<string, Function[]>;\n  \n  constructor() {\n    this.events = new Map();\n  }\n  \n  on(event: string, handler: Function) {\n    if (!this.events.has(event)) {\n      this.events.set(event, []);\n    }\n    this.events.get(event)!.push(handler);\n  }\n}`);
      setViewMode('original');
      setTerminalLines(generateTerminalLines(bounty.techStack));
    }
  }, [user]);

  useEffect(() => {
    if (!selectedBounty || timeRemaining <= 0) return;
    const id = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) { setShowFailure(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [selectedBounty, timeRemaining]);

  const handleDeployFix = async () => {
    if (!selectedBounty) return;
    if (!user) {
      setTerminalLines(prev => [...prev, { id: Date.now().toString(), type: 'error', message: 'You must be signed in to deploy fixes.', timestamp: new Date().toISOString() }]);
      return;
    }

    setIsRunning(true);
    setTerminalLines(prev => [...prev, { id: Date.now().toString(), type: 'info', message: 'Deploying fix to production...', timestamp: new Date().toISOString() }]);

    try {
      const res = await fetch('/api/arena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          bountyId: selectedBounty.id,
          submittedCode: code,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setTerminalLines(prev => [...prev, { id: Date.now().toString(), type: 'error', message: data?.error ?? `Deployment failed (${res.status})`, timestamp: new Date().toISOString() }]);
        setIsRunning(false);
        return;
      }

      const grading = data.grading;
      setTerminalLines(prev => [
        ...prev,
        { id: Date.now().toString(), type: grading.success ? 'success' : 'error', message: grading.feedback, timestamp: new Date().toISOString() },
        ...(grading.bugIdentified ? [{ id: (Date.now()+1).toString(), type: 'info' as const, message: `Bug identified: ${grading.bugIdentified}`, timestamp: new Date().toISOString() }] : []),
      ]);

      if (grading.success) {
        setPointsEarned(data.pointsAwarded || 0);
        setShowSuccess(true);
      } else {
        setShowFailure(true);
      }
    } catch (err) {
      setTerminalLines(prev => [...prev, { id: Date.now().toString(), type: 'error', message: err instanceof Error ? err.message : 'Network error', timestamp: new Date().toISOString() }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClose = () => { setSelectedBounty(null); setShowFailure(false); setShowSuccess(false); };
  const isUrgent = timeRemaining > 0 && timeRemaining < 60;

  return (
    <div className="pt-14 sm:pt-16 min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1800px] mx-auto px-3 sm:px-6 py-5 sm:py-8">
        <div className="mb-4 sm:mb-6 pl-12 sm:pl-16">
          <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text)' }}>The Arena</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>Prove what you know. Earn your badges.</p>
        </div>

        {selectedBounty ? (
          <div
            className="flex flex-col rounded-xl border overflow-hidden"
            style={{ height: 'calc(100vh - 170px)', minHeight: '500px', background: 'var(--bg-secondary)', borderColor: 'rgba(239,68,68,0.2)' }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button onClick={handleClose} className="p-1.5 rounded-lg transition-colors flex-shrink-0" style={{ color: 'var(--text-3)' }}>
                  <X className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>{selectedBounty.title}</h2>
                  <p className="text-xs font-mono truncate" style={{ color: 'var(--text-3)' }}>{selectedBounty.repo}</p>
                </div>
              </div>

              {user?.solutions?.[selectedBounty.id] && (
                <div className="hidden sm:flex bg-black/20 p-0.5 rounded-md border mx-auto" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => { setViewMode('solution'); setCode(user.solutions![selectedBounty.id]) }}
                    className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded transition-colors ${viewMode === 'solution' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                  >
                    Your Solution
                  </button>
                  <button
                    onClick={() => { 
                      setViewMode('original'); 
                      setCode(`// ${selectedBounty.title} — Find and fix the bugs!\n\nexport function processUserData(user: any) {\n  return user.name.toUpperCase();\n}\n\nexport async function fetchData(url: string) {\n  const response = await fetch(url);\n  return response.json();\n}\n\nexport class EventEmitter {\n  private events: Map<string, Function[]>;\n  \n  constructor() {\n    this.events = new Map();\n  }\n  \n  on(event: string, handler: Function) {\n    if (!this.events.has(event)) {\n      this.events.set(event, []);\n    }\n    this.events.get(event)!.push(handler);\n  }\n}`);
                    }}
                    className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded transition-colors ${viewMode === 'original' ? 'bg-red-500/20 text-red-400 shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                  >
                    Original Buggy Code
                  </button>
                </div>
              )}

              <div
                className="flex items-center gap-2 px-3 sm:px-5 py-2 rounded-lg border flex-shrink-0 ml-auto"
                style={
                  isUrgent
                    ? { background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.3)' }
                    : { background: 'var(--bg)', borderColor: 'var(--border)' }
                }
              >
                <Clock className="w-3.5 h-3.5" style={{ color: isUrgent ? '#ef4444' : 'var(--text-3)' }} />
                <span
                  className="font-mono text-lg sm:text-xl font-bold tabular-nums"
                  style={{ color: isUrgent ? '#ef4444' : 'var(--text)' }}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Main workspace */}
            <div className="flex-1 flex flex-col sm:flex-row min-h-0">
              {/* File tree — hidden on small mobile */}
              <div className="hidden sm:block w-48 lg:w-56 border-r flex-shrink-0 overflow-y-auto p-3" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                <p className="text-[10px] uppercase tracking-widest mb-3 font-mono" style={{ color: 'var(--text-3)' }}>Files</p>
                <div className="space-y-0.5 font-mono text-xs">
                  <div className="px-2 py-1" style={{ color: '#d97706' }}>src/</div>
                  <div className="px-2 py-1 pl-6" style={{ color: 'var(--text-3)' }}>components/</div>
                  <div className="px-2 py-1 pl-8 flex items-center gap-1.5" style={{ color: '#ef4444' }}>
                    <AlertTriangle className="w-3 h-3" /> App.tsx
                  </div>
                  <div className="px-2 py-1 pl-8" style={{ color: 'var(--text-3)' }}>index.ts</div>
                  <div className="px-2 py-1" style={{ color: 'var(--text-3)' }}>package.json</div>
                </div>
              </div>

                {/* Editor */}
                <div className="flex-1 min-w-0 min-h-0" style={{ minHeight: '200px' }}>
                  <MonacoEditor
                    height="100%"
                    language="typescript"
                    theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                    value={code}
                    onChange={(v) => setCode(v ?? '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 12 },
                      fontFamily: "'JetBrains Mono', monospace",
                      renderLineHighlight: 'none',
                      occurrencesHighlight: 'off',
                      selectionHighlight: false,
                    }}
                  />
                </div>
            </div>

            {/* Terminal */}
            <div className="h-32 sm:h-40 border-t flex flex-col flex-shrink-0" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 px-4 py-1.5 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                <Terminal className="w-3.5 h-3.5" style={{ color: 'var(--text-3)' }} />
                <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-3)' }}>Errors</span>
              </div>
              <div className="flex-1 p-3 sm:p-4 font-mono text-xs space-y-1 overflow-y-auto">
                {terminalLines.map((line) => (
                  <div key={line.id} style={{ color: lineColors[line.type] }}>
                    <span className="mr-2" style={{ color: 'var(--text-3)' }}>[{line.timestamp.split('T')[1].split('.')[0]}]</span>
                    {line.message}
                  </div>
                ))}
              </div>
            </div>

            {/* Deploy */}
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t flex-shrink-0" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              <button
                onClick={handleDeployFix}
                disabled={isRunning}
                className="w-full py-2.5 sm:py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                style={
                  isRunning
                    ? { background: 'var(--bg-tertiary)', color: 'var(--text-3)' }
                    : { background: '#ef4444', color: '#ffffff' }
                }
              >
                {isRunning ? (
                  <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Deploying...</>
                ) : (
                  <><Shield className="w-4 h-4" />DEPLOY FIX</>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Bounty list */
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
              <h2 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text)' }}>Active Challenges</h2>
              <span className="ml-auto text-xs font-mono" style={{ color: 'var(--text-3)' }}>{bounties.length} open</span>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {bounties.map((bounty) => (
                <button
                  key={bounty.id}
                  onClick={() => startChallenge(bounty)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left transition-colors group"
                  style={{ borderColor: 'var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1.5">
                        <h3 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text)' }}>{bounty.title}</h3>
                        {user?.badges?.includes(bounty.id) && (
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--green)' }} />
                        )}
                        <span className="text-xs font-mono hidden sm:block" style={{ color: 'var(--text-3)' }}>{bounty.techStack}</span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
                        <DifficultyDots level={bounty.difficulty} />
                        <span className="text-xs" style={{ color: 'var(--text-3)' }}>{bounty.passRate}% pass</span>
                        <span className="text-xs hidden sm:block" style={{ color: 'var(--text-3)' }}>{bounty.totalAttempts.toLocaleString()} attempts</span>
                        <span className="text-xs font-mono" style={{ color: 'var(--text-3)' }}>{formatTime(bounty.timeLimit)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1 font-bold text-sm" style={{ color: 'var(--cyan)' }}>
                          <Zap className="w-3.5 h-3.5" />{bounty.reward}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>reward</div>
                      </div>
                      <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-3)' }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Overlays */}
        {showFailure && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="rounded-2xl border p-8 sm:p-10 text-center max-w-sm w-full shadow-2xl" style={{ background: 'var(--bg)', borderColor: 'rgba(239,68,68,0.3)' }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full border flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
                <X className="w-7 h-7" style={{ color: '#ef4444' }} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Not this time</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-3)' }}>The fix didn&apos;t pass. Review the errors and try again.</p>
              <button onClick={() => setShowFailure(false)} className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors" style={{ background: 'var(--bg-secondary)', color: 'var(--text)' }}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="rounded-2xl border p-8 sm:p-10 text-center max-w-sm w-full shadow-2xl" style={{ background: 'var(--bg)', borderColor: 'rgba(22,163,74,0.3)' }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full border flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.08)', borderColor: 'rgba(22,163,74,0.2)' }}>
                <Trophy className="w-7 h-7" style={{ color: '#16a34a' }} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Badge Earned</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-3)' }}>{selectedBounty?.title}</p>
              <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>+{pointsEarned}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>Pehchaan Trust Score</p>
              </div>
              <button onClick={handleClose} className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: '#16a34a' }}>
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
