'use client';

import React, { useState } from 'react';
import { User, ChevronDown, Zap, Sun, Moon, Menu, X, LogOut } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';

interface HeaderProps {
  onLoginClick: () => void;
  onProfileClick: () => void;
  onLogoClick?: () => void;
}

function initialsOf(name: string | null | undefined, fallback: string): string {
  const source = (name ?? '').trim() || fallback;
  const parts = source.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || fallback[0]?.toUpperCase() || '?';
}

export default function Header({ onLoginClick, onProfileClick, onLogoClick }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useUser();

  const isLoggedIn = !!user;
  const displayName = user?.displayName ?? user?.githubUsername ?? '';
  const initials = initialsOf(displayName, user?.githubUsername ?? '?');

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur"
      style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 flex-shrink-0 transition-opacity hover:opacity-80"
        >
          <img
            src="/pehchaan_logo.png"
            alt="Pehchaan logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
              Pehchaan <span style={{ fontFamily: '"Noto Nastaliq Urdu", serif', fontWeight: 600, marginLeft: '4px' }}>/ پہچان</span>
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {isLoggedIn ? (
            <>
              <div
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              >
                <Zap className="w-3.5 h-3.5" style={{ color: 'var(--green)' }} />
                <span className="font-bold" style={{ color: 'var(--text)' }}>
                  {user!.ptsScore.toLocaleString()}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>PTS</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 p-1 rounded-lg transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {user!.avatarUrl ? (
                    <img
                      src={user!.avatarUrl}
                      alt={displayName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--cyan)' }}
                    >
                      <span className="text-xs font-bold text-white">{initials}</span>
                    </div>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-3)' }}
                  />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                    <div
                      className="absolute right-0 top-full mt-1.5 w-56 rounded-xl overflow-hidden shadow-xl border z-20"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border-strong)' }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                          {displayName}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                          @{user!.githubUsername}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onProfileClick();
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors"
                        style={{ color: 'var(--text-2)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <User className="w-3.5 h-3.5" />
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors border-t"
                        style={{ color: '#dc2626', borderColor: 'var(--border)' }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')
                        }
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors text-white"
              style={{ background: 'var(--cyan)' }}
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile */}
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

      {mobileMenuOpen && (
        <div
          className="sm:hidden border-t px-4 py-3 space-y-2"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
        >
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 py-2">
                {user!.avatarUrl ? (
                  <img
                    src={user!.avatarUrl}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--cyan)' }}
                  >
                    <span className="text-xs font-bold text-white">{initials}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                    {displayName}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                    {user!.ptsScore.toLocaleString()} PTS · @{user!.githubUsername}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onProfileClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.06)', color: '#dc2626' }}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onLoginClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-sm font-semibold rounded-lg text-white"
              style={{ background: 'var(--cyan)' }}
            >
              Sign in with GitHub
            </button>
          )}
        </div>
      )}
    </header>
  );
}
