'use client';

import React, { useState } from 'react';
import { Play, Lightbulb, Trophy, ChevronRight, Zap, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import { trainingModules, brokenCodeSamples, hints } from '@/data/mockData';
import { TrainingModule } from '@/types';
import { useTheme } from '@/context/ThemeContext';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const difficultyConfig = {
  beginner:     { label: 'Beginner',     color: '#16a34a', bg: 'rgba(22,163,74,0.1)',     border: 'rgba(22,163,74,0.2)' },
  intermediate: { label: 'Intermediate', color: '#d97706', bg: 'rgba(217,119,6,0.1)',     border: 'rgba(217,119,6,0.2)' },
  advanced:     { label: 'Advanced',     color: '#dc2626', bg: 'rgba(220,38,38,0.1)',      border: 'rgba(220,38,38,0.2)' },
};

export default function SandboxView() {
  const { theme } = useTheme();
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<'FIXED' | 'ERROR' | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);

  const handleSelectModule = (module: TrainingModule) => {
    setSelectedModule(module);
    setCode(brokenCodeSamples[module.id] || '// Select a challenge to begin');
    setShowHint(false);
    setDiagnosticResult(null);
    setMobileListOpen(false);
  };

  const handleRunDiagnostics = () => {
    if (!selectedModule) return;
    setIsRunning(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      const fixed =
        code.includes('return () =>') || code.includes('cleanup') || code.includes('abort') ||
        code.includes('asyncio.Lock') || code.includes('Promise.all') ||
        code.includes('?') || code.includes('parameterized') || code.includes('removeListener');
      setDiagnosticResult(fixed ? 'FIXED' : 'ERROR');
      setIsRunning(false);
    }, 1200);
  };

  const editorTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  const ModuleList = () => (
    <div className="space-y-1.5">
      {trainingModules.map((module) => {
        const isSelected = selectedModule?.id === module.id;
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
              <h3 className="font-medium text-sm leading-snug" style={{ color: 'var(--text)' }}>{module.title}</h3>
              <ChevronRight
                className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                style={{ color: isSelected ? 'var(--text-2)' : 'var(--text-3)' }}
              />
            </div>
            <p className="text-xs mb-2.5 leading-relaxed" style={{ color: 'var(--text-3)' }}>{module.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[11px] px-2 py-0.5 rounded-md font-medium border"
                style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
              >
                {diff.label}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{module.techStack}</span>
              <span className="ml-auto text-[11px] font-semibold" style={{ color: 'var(--text)' }}>{module.points} pts</span>
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
          <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text)' }}>The Sandbox</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>Zero pressure. Learn by doing.</p>
        </div>

        {/* Mobile: challenge selector dropdown */}
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

        {/* Desktop layout */}
        <div className="flex gap-4 sm:gap-5" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
          {/* Module list — desktop only */}
          <div className="hidden sm:block w-[300px] lg:w-[320px] flex-shrink-0 overflow-y-auto pr-1">
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
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
                        <span className="text-[10px] uppercase tracking-wider font-mono" style={{ color: 'var(--text-3)' }}>Live Challenge</span>
                      </div>
                      <h2 className="text-sm sm:text-base font-bold truncate" style={{ color: 'var(--text)' }}>{selectedModule.title}</h2>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-3)' }}>{selectedModule.description}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Zap className="w-3.5 h-3.5" style={{ color: 'var(--green)' }} />
                      <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{selectedModule.points}</span>
                      <span className="text-xs" style={{ color: 'var(--text-3)' }}>pts</span>
                    </div>
                  </div>

                  {showHint && (
                    <div className="mt-3 p-3 rounded-lg border flex items-start gap-2" style={{ background: 'rgba(217,119,6,0.08)', borderColor: 'rgba(217,119,6,0.2)' }}>
                      <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
                      <p className="text-xs" style={{ color: '#b45309' }}>{hints[selectedModule.id] ?? 'Look harder...'}</p>
                    </div>
                  )}
                </div>

                {/* Editor */}
                <div className="flex-1 min-h-0">
                  <MonacoEditor
                    height="100%"
                    language={selectedModule.techStack === 'Python' ? 'python' : 'typescript'}
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

                {/* Footer bar */}
                <div
                  className="px-3 sm:px-5 py-2.5 sm:py-3 border-t flex items-center justify-between gap-3 flex-shrink-0 flex-wrap"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={handleRunDiagnostics}
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
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span className="hidden sm:inline">Checking...</span>
                          <span className="sm:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          Run
                        </>
                      )}
                    </button>

                    {diagnosticResult && (
                      <div
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm"
                        style={
                          diagnosticResult === 'FIXED'
                            ? { background: 'rgba(22,163,74,0.12)', color: '#16a34a' }
                            : { background: 'rgba(220,38,38,0.1)', color: '#dc2626' }
                        }
                      >
                        {diagnosticResult === 'FIXED' ? (
                          <><Trophy className="w-3.5 h-3.5" /><span className="font-semibold">+{selectedModule.points} pts</span></>
                        ) : (
                          <span>Not fixed yet</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowHint(true)}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm border transition-colors"
                    style={{ background: 'rgba(217,119,6,0.08)', borderColor: 'rgba(217,119,6,0.2)', color: '#d97706' }}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hint </span>
                    <span className="text-amber-600/60">(-{selectedModule.hintCost})</span>
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
                  <h3 className="text-sm sm:text-base font-medium mb-1" style={{ color: 'var(--text)' }}>Select a Challenge</h3>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--text-3)' }}>
                    <span className="hidden sm:inline">Pick a module from the left</span>
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
