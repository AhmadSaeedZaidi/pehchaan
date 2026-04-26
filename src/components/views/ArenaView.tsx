'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Clock, Zap, AlertTriangle, ChevronRight, Terminal, X, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';
import { bounties, generateTerminalLines } from '@/data/mockData';
import { Bounty, TerminalLine } from '@/types';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function ArenaView() {
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startChallenge = useCallback((bounty: Bounty) => {
    setSelectedBounty(bounty);
    setTimeRemaining(bounty.timeLimit);
    setTerminalLines(generateTerminalLines(bounty.techStack));
    setShowFailure(false);
    setShowSuccess(false);
  }, []);

  useEffect(() => {
    if (!selectedBounty || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowFailure(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedBounty, timeRemaining]);

  const handleDeployFix = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      if (Math.random() > 0.3) {
        setShowSuccess(true);
      } else {
        setShowFailure(true);
      }
    }, 2000);
  };

  const handleClose = () => {
    setSelectedBounty(null);
    setShowFailure(false);
    setShowSuccess(false);
  };

  const getDifficultyStars = (level: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < level ? 'text-red-400' : 'text-gray-600'}>★</span>
    ));
  };

  const getLineTypeColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-gray-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-[1800px] mx-auto px-6">
        <h1 className="text-2xl font-bold mb-2">Arena</h1>
        <p className="text-gray-500 mb-8">Prove what you know. Earn your badges.</p>

        {selectedBounty ? (
          /* Challenge Workspace */
          <div className="h-[calc(100vh-200px)] flex flex-col bg-[#1a1a1a] rounded-xl border border-red-500/20 overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-4">
                <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
                <div>
                  <h2 className="font-bold text-lg">{selectedBounty.title}</h2>
                  <p className="text-xs text-gray-500">{selectedBounty.repo}</p>
                </div>
              </div>
              
              {/* Timer */}
              <div className={`flex items-center gap-3 px-6 py-3 rounded-lg ${
                timeRemaining < 60 ? 'bg-red-500/20 border border-red-500/50 animate-pulse' : 'bg-[#121212]'
              }`}>
                <Clock className={`w-5 h-5 ${timeRemaining < 60 ? 'text-red-400' : 'text-gray-400'}`} />
                <span className={`font-mono text-2xl font-bold ${timeRemaining < 60 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex min-h-0">
              {/* File Tree - Left */}
              <div className="w-64 border-r border-white/5 bg-[#121212] p-4 overflow-y-auto">
                <h3 className="text-xs text-gray-500 uppercase mb-4">Files</h3>
                <div className="space-y-1 font-mono text-sm">
                  <div className="px-2 py-1 text-yellow-400">src/</div>
                  <div className="px-2 py-1 pl-6 text-gray-500">components/</div>
                  <div className="px-2 py-1 pl-8 text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> App.tsx
                  </div>
                  <div className="px-2 py-1 pl-8 text-gray-500">index.ts</div>
                  <div className="px-2 py-1 text-gray-500">package.json</div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 min-w-0">
                <MonacoEditor
                  height="100%"
                  language="typescript"
                  theme="vs-dark"
                  value={`// ${selectedBounty.title}\n// Fix the bugs!\n\nexport function processUserData(user: any) {\n  return user.name.toUpperCase();\n}\n\nexport async function fetchData(url: string) {\n  const response = await fetch(url);\n  return response.json();\n}\n\nexport class EventEmitter {\n  private events: Map<string, Function[]>;\n  \n  constructor() {\n    this.events = new Map();\n  }\n  \n  on(event: string, handler: Function) {\n    if (!this.events.has(event)) {\n      this.events.set(event, []);\n    }\n    this.events.get(event)!.push(handler);\n  }\n}`}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>

            {/* Terminal */}
            <div className="h-48 border-t border-white/5 bg-[#0d0d0d]">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
                <Terminal className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500 uppercase">Errors</span>
              </div>
              <div className="p-4 font-mono text-sm space-y-1 h-32 overflow-y-auto">
                {terminalLines.map((line) => (
                  <div key={line.id} className={getLineTypeColor(line.type)}>
                    <span className="text-gray-600 mr-2">[{line.timestamp.split('T')[1].split('.')[0]}]</span>
                    {line.message}
                  </div>
                ))}
              </div>
            </div>

            {/* Deploy Button */}
            <div className="p-4 border-t border-white/5 bg-[#121212]">
              <button
                onClick={handleDeployFix}
                disabled={isRunning}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 ${
                  isRunning 
                    ? 'bg-gray-700 text-gray-400' 
                    : 'bg-red-500 hover:bg-red-400 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    DEPLOY FIX
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Bounty List */
          <div className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Active Challenges
              </h2>
            </div>
            
            <div className="divide-y divide-white/5">
              {bounties.map((bounty) => (
                <button
                  key={bounty.id}
                  onClick={() => startChallenge(bounty)}
                  className="w-full p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{bounty.title}</h3>
                        <span className="text-sm text-gray-500">{bounty.techStack}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-400">{getDifficultyStars(bounty.difficulty)}</span>
                        <span className="text-gray-500">{bounty.passRate}% pass</span>
                        <span className="text-gray-500">{bounty.totalAttempts} attempts</span>
                        <span className="text-gray-500">{formatTime(bounty.timeLimit)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-red-400 font-bold">
                          <Zap className="w-4 h-4" />
                          {bounty.reward}
                        </div>
                        <div className="text-xs text-gray-500">Reward</div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Failure Overlay */}
        {showFailure && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-[#1a1a1a] rounded-2xl border border-red-500/50 p-12 text-center max-w-md mx-4">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <X className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-4">Failed</h2>
              <p className="text-gray-400 mb-8">
                Not quite. Try again when ready.
              </p>
              <button
                onClick={() => setShowFailure(false)}
                className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Success Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-[#1a1a1a] rounded-2xl border border-green-500/50 p-12 text-center max-w-md mx-4">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">Badge Earned</h2>
              <p className="text-gray-300 mb-2">{selectedBounty?.title}</p>
              <div className="bg-red-500 rounded-lg p-4 mb-8">
                <p className="text-white font-bold">+{selectedBounty?.reward} pts</p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-lg bg-green-500 text-black font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
