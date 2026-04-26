'use client';

import React, { useState } from 'react';
import { Bell, User, ChevronDown, Zap } from 'lucide-react';
import { mockUser } from '@/data/mockData';

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onProfileClick: () => void;
}

export default function Header({ isLoggedIn, onLoginClick, onProfileClick }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Better SVG */}
          <div className="flex items-center gap-3 cursor-pointer">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="28" height="28" rx="4" fill="#00d4ff"/>
              <path d="M8 16L13 21L24 10" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-bold tracking-tight text-white">Pehchaan</span>
          </div>

          {/* Auth / Profile */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Level/Progress */}
                <div className="flex items-center gap-3 mr-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Level 12</div>
                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-[#00d4ff] rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-white">
                    <Zap className="w-4 h-4 text-[#00ff88]" />
                    <span>{mockUser.reputation}</span>
                  </div>
                </div>
                
                <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Bell className="w-5 h-5 text-gray-400" />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 pl-4 border-l border-white/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#00d4ff] flex items-center justify-center">
                      <span className="text-sm font-bold text-[#0a0a0a]">{mockUser.avatar}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 overflow-hidden">
                      <button 
                        onClick={() => { onProfileClick(); setShowDropdown(false); }}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-2 text-white"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <div className="border-t border-white/5 px-4 py-3 text-sm text-gray-400">
                        {mockUser.name}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-6 py-2 bg-[#00d4ff] text-[#0a0a0a] font-medium rounded hover:bg-[#00d4ff]/90 transition-colors"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
