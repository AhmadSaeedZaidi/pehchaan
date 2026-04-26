'use client';

import React, { useState } from 'react';
import { Play, Lightbulb, Trophy, ChevronRight, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import { trainingModules, brokenCodeSamples, hints } from '@/data/mockData';
import { TrainingModule } from '@/types';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function SandboxView() {
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleSelectModule = (module: TrainingModule) => {
    setSelectedModule(module);
    setCode(brokenCodeSamples[module.id] || '// Select a challenge');
    setShowHint(false);
    setHint('');
    setDiagnosticResult(null);
  };

  const handleRunDiagnostics = () => {
    setIsRunning(true);
    setDiagnosticResult(null);
    
    setTimeout(() => {
      const hasFixed = code.includes('return () =>') || code.includes('cleanup') || code.includes('abort');
      setDiagnosticResult(hasFixed ? 'FIXED' : 'ERROR');
      setIsRunning(false);
    }, 1500);
  };

  const handleRequestHint = () => {
    if (selectedModule) {
      setHint(hints[selectedModule.id] || 'Look harder...');
      setShowHint(true);
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-[1800px] mx-auto px-6">
        <h1 className="text-2xl font-bold mb-2">Training</h1>
        <p className="text-gray-500 mb-8">Zero pressure. Learn by doing.</p>

        <div className="flex gap-6">
          {/* Module List */}
          <div className="w-[400px] flex-shrink-0">
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4">
              <div className="space-y-3">
                {trainingModules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => handleSelectModule(module)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedModule?.id === module.id 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-[#121212] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{module.title}</h3>
                      <ChevronRight className={`w-4 h-4 ${selectedModule?.id === module.id ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{module.description}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        module.difficulty === 'beginner' 
                          ? 'bg-green-500/20 text-green-400' 
                          : module.difficulty === 'intermediate' 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {module.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{module.techStack}</span>
                      <span className="ml-auto text-xs text-white">{module.points} pts</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Workspace */}
          <div className="flex-1">
            {selectedModule ? (
              <div className="h-[calc(100vh-200px)] flex flex-col bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-xs text-gray-500 uppercase">Challenge</span>
                  </div>
                  <h2 className="text-lg font-bold mb-1">{selectedModule.title}</h2>
                  <p className="text-sm text-gray-500">{selectedModule.description}</p>
                  
                  {showHint && (
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-400">Hint</span>
                      </div>
                      <p className="text-sm text-gray-400">{hint}</p>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-h-0">
                  <MonacoEditor
                    height="100%"
                    language="typescript"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>

                <div className="p-4 border-t border-white/5 bg-[#121212] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleRunDiagnostics}
                      disabled={isRunning}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
                        isRunning 
                          ? 'bg-gray-700 text-gray-400' 
                          : 'bg-white text-black hover:bg-gray-200'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run
                        </>
                      )}
                    </button>
                    
                    {diagnosticResult && (
                      <div className={`px-4 py-2 rounded-lg ${
                        diagnosticResult === 'FIXED' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {diagnosticResult === 'FIXED' ? <Trophy className="w-4 h-4" /> : null}
                        {diagnosticResult === 'FIXED' ? `+${selectedModule.points} pts` : 'Not fixed'}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleRequestHint}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Hint (-{selectedModule.hintCost} pts)
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-[#1a1a1a] rounded-xl border border-white/5">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select Challenge</h3>
                  <p className="text-gray-500">Pick a module from the left</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
