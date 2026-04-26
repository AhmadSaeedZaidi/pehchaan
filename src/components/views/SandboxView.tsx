'use client';

import React, { useState } from 'react';
import { Play, Lightbulb, Trophy, Zap, ChevronDown, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { trainingModules, brokenCodeSamples, hints } from '@/data/mockData';
import { TrainingModule } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface DifficultyConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
}

const difficultyConfig: Record<TrainingModule['difficulty'], DifficultyConfig> = {
  beginner:     { label: 'Easy',   color: '#16a34a', bg: 'rgba(22,163,74,0.1)', border: 'rgba(22,163,74,0.25)' },
  intermediate: { label: 'Medium', color: '#d97706', bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.25)' },
  advanced:     { label: 'Hard',   color: '#dc2626', bg: 'rgba(220,38,38,0.1)', border: 'rgba(220,38,38,0.25)' },
};

interface GradingResult {
  success: boolean;
  score: number;
  feedback: string;
  bugIdentified?: string;
  improvements?: string[];
}

export default function SandboxView() {
  const { theme } = useTheme();
  const { user, updateUser } = useUser();
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [grading, setGrading] = useState<GradingResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);

  const handleSelectModule = (module: TrainingModule) => {
    setSelectedModule(module);
    setCode(brokenCodeSamples[module.id] ?? '// Select a challenge to begin');
    setShowHint(false);
    setGrading(null);
    setSubmitError(null);
    setMobileListOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedModule) return;
    if (!user) {
      setSubmitError('Sign in with GitHub to submit solutions for grading.');
      return;
    }
    setIsRunning(true);
    setGrading(null);
    setSubmitError(null);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          challengeId: selectedModule.id,
          submittedCode: code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data?.error ?? `Submission failed (HTTP ${res.status})`);
        return;
      }
      setGrading(data.grading as GradingResult);
      if (data.updatedUser) updateUser(data.updatedUser);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsRunning(false);
    }
  };

  const editorTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  const ModuleList = () => (
    <div className="space-y-1.5">
      {trainingModules.map((module) => {
        const isSelected = selectedModule?.id === module.id;
        const isSolved = user?.badges?.includes(module.id);
        const diff = difficultyConfig[module.difficulty];
        return (
          <button
            key={module.id}
            onClick={() => handleSelectModule(module)}
            className="w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-150"
            style={{
              background: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
              borderColor: isSelected ? 'var(--border-strong)' : 'var(--border)',
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--text)' }}>
                {module.title}
              </h3>
              {isSolved && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--green)' }} />}
            </div>
            <p className="text-xs mb-2.5 leading-relaxed line-clamp-2" style={{ color: 'var(--text-3)' }}>{module.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[11px] px-2 py-0.5 rounded-md font-semibold border"
                style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
              >
                {diff.label}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{module.techStack}</span>
              <span className="ml-auto text-[11px] font-bold tabular-nums" style={{ color: 'var(--text)' }}>+{module.points}</span>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="pt-14 sm:pt-16 min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1800px] mx-auto px-3 sm:px-6 py-5 sm:py-8">
        {/* Page header */}
        <div className="mb-4 sm:mb-6 pl-12 sm:pl-16">
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>The Sandbox</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>
            Zero pressure. Learn by doing. Sign in to track progress.
          </p>
        </div>

        {/* Mobile selector */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setMobileListOpen(!mobileListOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <span>{selectedModule ? selectedModule.title : 'Select a challenge'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileListOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-3)' }} />
          </button>
          {mobileListOpen && (
            <div className="mt-1 rounded-xl border p-2" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              <ModuleList />
            </div>
          )}
        </div>

        <div className="flex gap-4 sm:gap-5" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
          {/* Module list — desktop */}
          <div className="hidden sm:block w-[300px] lg:w-[340px] flex-shrink-0 overflow-y-auto pr-1">
            <ModuleList />
          </div>

          {/* Workspace */}
          <div
            className="flex-1 min-w-0 flex flex-col rounded-xl border overflow-hidden"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            {selectedModule ? (
              <>
                {/* Challenge header */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-md font-semibold border"
                          style={{
                            color: difficultyConfig[selectedModule.difficulty].color,
                            background: difficultyConfig[selectedModule.difficulty].bg,
                            borderColor: difficultyConfig[selectedModule.difficulty].border,
                          }}
                        >
                          {difficultyConfig[selectedModule.difficulty].label}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-mono" style={{ color: 'var(--text-3)' }}>
                          {selectedModule.techStack}
                        </span>
                      </div>
                      <h2 className="text-sm sm:text-base font-bold truncate" style={{ color: 'var(--text)' }}>{selectedModule.title}</h2>
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-3)' }}>{selectedModule.description}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Zap className="w-3.5 h-3.5" style={{ color: 'var(--green)' }} />
                      <span className="font-bold text-sm tabular-nums" style={{ color: 'var(--text)' }}>+{selectedModule.points}</span>
                    </div>
                  </div>

                  {showHint && (
                    <div
                      className="mt-3 p-3 rounded-lg border flex items-start gap-2"
                      style={{ background: 'rgba(217,119,6,0.08)', borderColor: 'rgba(217,119,6,0.25)' }}
                    >
                      <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
                      <p className="text-xs" style={{ color: '#b45309' }}>{hints[selectedModule.id] ?? 'Look harder...'}</p>
                    </div>
                  )}
                </div>

                {/* Editor */}
                <div className="flex-1 min-h-0">
                  <MonacoEditor
                    height="100%"
                    language={
                      selectedModule.techStack === 'Python' ? 'python'
                      : selectedModule.techStack === 'SQL' ? 'sql'
                      : 'typescript'
                    }
                    theme={editorTheme}
                    value={code}
                    onChange={(v: string | undefined) => setCode(v ?? '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 12, bottom: 12 },
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  />
                </div>

                {/* Result */}
                {(grading || submitError) && (
                  <div className="px-3 sm:px-5 py-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                    {submitError && (
                      <div className="flex items-start gap-2 text-sm" style={{ color: '#dc2626' }}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}
                    {grading && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          {grading.success ? (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--green)' }} />
                          ) : (
                            <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#dc2626' }} />
                          )}
                          <span
                            className="text-sm font-semibold"
                            style={{ color: grading.success ? 'var(--green)' : '#dc2626' }}
                          >
                            {grading.success ? 'Accepted' : 'Not yet'}
                          </span>
                          <span
                            className="ml-auto text-xs px-2 py-0.5 rounded-md font-mono font-bold"
                            style={{
                              background: 'var(--bg-secondary)',
                              color: 'var(--text)',
                            }}
                          >
                            Score: {grading.score}/100
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                          {grading.feedback}
                        </p>
                        {grading.bugIdentified && (
                          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
                            <span className="font-semibold uppercase tracking-wider mr-1">Bug:</span>
                            {grading.bugIdentified}
                          </p>
                        )}
                        {grading.improvements && grading.improvements.length > 0 && (
                          <ul className="text-[11px] space-y-0.5 pl-4" style={{ color: 'var(--text-3)' }}>
                            {grading.improvements.map((imp, i) => (
                              <li key={i} className="list-disc">{imp}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer bar */}
                <div
                  className="px-3 sm:px-5 py-2.5 sm:py-3 border-t flex items-center justify-between gap-3 flex-shrink-0 flex-wrap"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={handleSubmit}
                      disabled={isRunning}
                      className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                      style={
                        isRunning
                          ? { background: 'var(--bg-tertiary)', color: 'var(--text-3)' }
                          : { background: 'var(--text)', color: 'var(--bg)' }
                      }
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="hidden sm:inline">Adjudicating...</span>
                          <span className="sm:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          Submit
                        </>
                      )}
                    </button>

                    {grading?.success && (
                      <div
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm"
                        style={{ background: 'rgba(22,163,74,0.12)', color: '#16a34a' }}
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="font-semibold">Solved!</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowHint(true)}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm border transition-colors"
                    style={{
                      background: 'rgba(217,119,6,0.08)',
                      borderColor: 'rgba(217,119,6,0.25)',
                      color: '#d97706',
                    }}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hint </span>
                    <span style={{ color: '#b45309' }}>(-{selectedModule.hintCost})</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-full flex items-center justify-center border"
                    style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}
                  >
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--text-3)' }} />
                  </div>
                  <h3 className="text-sm sm:text-base font-medium mb-1" style={{ color: 'var(--text)' }}>
                    Select a challenge
                  </h3>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--text-3)' }}>
                    <span className="hidden sm:inline">Pick one from the list on the left</span>
                    <span className="sm:hidden">Tap the selector above to begin</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
