'use client';

import React, { useState } from 'react';
import { User, ChevronDown, Zap, Sun, Moon, Menu, X } from 'lucide-react';
import { mockUser } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onProfileClick: () => void;
}

export default function Header({ isLoggedIn, onLoginClick, onProfileClick }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/pehchaan_logo.png"
            alt="Pehchaan logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text)' }}>Pehchaan</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-3)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}>
                <Zap className="w-3.5 h-3.5" style={{ color: 'var(--green)' }} />
                <span className="font-semibold text-base">{mockUser.reputation.toLocaleString()}</span>
                <span style={{ color: 'var(--text-3)' }} className="text-xs">pts</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 p-1.5 rounded-lg transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--cyan)' }}>
                    <span className="text-xs font-bold text-white">{mockUser.avatar}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} style={{ color: 'var(--text-3)' }} />
                </button>

                {showDropdown && (
                  <div
                    className="absolute right-0 top-full mt-1.5 w-44 rounded-xl overflow-hidden shadow-lg border"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border-strong)' }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-xs font-semibold text-base">{mockUser.name}</p>
                      <p className="text-xs text-faint mt-0.5">{mockUser.github.replace('https://github.com/', '@')}</p>
                    </div>
                    <button
                      onClick={() => { onProfileClick(); setShowDropdown(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-muted hover:bg-surface flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-2)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <User className="w-3.5 h-3.5" />
                      Profile
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors text-white"
              style={{ background: 'var(--cyan)' }}
            >
              Sign Up
            </button>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="sm:hidden flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg"
            style={{ color: 'var(--text-3)' }}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg"
            style={{ color: 'var(--text-2)' }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t px-4 py-3 space-y-2" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 py-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--cyan)' }}>
                  <span className="text-xs font-bold text-white">{mockUser.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-base">{mockUser.name}</p>
                  <p className="text-xs text-faint">{mockUser.reputation.toLocaleString()} pts</p>
                </div>
              </div>
              <button
                onClick={() => { onProfileClick(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              >
                View Profile
              </button>
            </>
          ) : (
            <button
              onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-sm font-semibold rounded-lg text-white"
              style={{ background: 'var(--cyan)' }}
            >
              Sign Up
            </button>
          )}
        </div>
      )}
    </header>
  );
}
