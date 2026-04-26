'use client';

import React, { useState } from 'react';
import { GraduationCap, Sword, ChevronRight } from 'lucide-react';

interface HomePageProps {
  isLoggedIn: boolean;
  onEnterTraining: () => void;
  onEnterArena: () => void;
}

export default function HomePage({ isLoggedIn, onEnterTraining, onEnterArena }: HomePageProps) {
  const [hoveredPath, setHoveredPath] = useState<'training' | 'trial' | null>(null);

  const trainingSteps = [
    'Pick a skill',
    'Find the bug',
    'Fix it',
    'Level up',
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="pt-32 pb-12 text-center px-6">
        <h1 className="text-5xl font-bold mb-4 text-white">
          The Unrecognized <span className="text-[#00d4ff]">Get Verified</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Stop watching others get credit for your work. Prove what you can build.
        </p>
      </div>

      {/* Two Paths - Full Width, Edge to Edge */}
      <div className="flex">
        {/* Training Path - Left */}
        <button
          onMouseEnter={() => setHoveredPath('training')}
          onMouseLeave={() => setHoveredPath(null)}
          onClick={onEnterTraining}
          className={`relative flex-1 h-[calc(100vh-220px)] overflow-hidden transition-all duration-500 ${
            hoveredPath === 'training' ? 'scale-[1.02]' : ''
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/left.png" 
              alt="Training" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#00ff88]/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-[#00ff88]" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white">Train</h2>
                  <p className="text-gray-300">Learn by doing</p>
                </div>
              </div>

              <div className="space-y-4 mb-12">
                {trainingSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88] font-bold">
                      {i + 1}
                    </div>
                    <span className="text-xl text-white">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#00ff88] text-xl font-medium">
              Start Training <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="w-1 bg-[#1a1a1a]" />

        {/* Trial Path - Right */}
        <button
          onMouseEnter={() => setHoveredPath('trial')}
          onMouseLeave={() => setHoveredPath(null)}
          onClick={onEnterArena}
          className={`relative flex-1 h-[calc(100vh-220px)] overflow-hidden transition-all duration-500 ${
            hoveredPath === 'trial' ? 'scale-[1.02]' : ''
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/right.png" 
              alt="Arena" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#00d4ff]/20 rounded-lg flex items-center justify-center">
                  <Sword className="w-8 h-8 text-[#00d4ff]" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white">Prove It</h2>
                  <p className="text-gray-300">Under pressure</p>
                </div>
              </div>

              <div className="space-y-4 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] font-bold">1</div>
                  <span className="text-xl text-white">Pick a challenge</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] font-bold">2</div>
                  <span className="text-xl text-white">Race the clock</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] font-bold">3</div>
                  <span className="text-xl text-white">Earn your badge</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#00d4ff] text-xl font-medium">
              Enter Arena <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="py-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <div>Pehchaan</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}
