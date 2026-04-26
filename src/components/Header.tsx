'use client';

import React, { useState } from 'react';
import { User, ChevronDown, Zap, Sun, Moon, Menu, X, LogOut, Star } from 'lucide-react';
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
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur"
      style={{ background: 'color-mix(in srgb, var(--bg) 95%, transparent)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-[1800px] mx-auto px-5 sm:px-8 h-[64px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 flex-shrink-0 transition-opacity hover:opacity-75"
        >
          <img
            src="/pehchaan_logo.png"
            alt="Pehchaan logo"
            className="h-9 w-9 object-contain"
          />
          <span 
            className="text-sm font-medium tracking-tight"
            style={{ color: 'var(--text)', fontFamily: 'Jost, sans-serif', letterSpacing: '0.02em' }}
          >
            Pehchaan
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full transition-colors"
            style={{ color: 'var(--text-3)', background: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" strokeWidth={1.5} /> : <Sun className="w-4 h-4" strokeWidth={1.5} />}
          </button>

          {isLoggedIn ? (
            <>
              <div
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-full"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              >
                <Zap className="w-3.5 h-3.5" style={{ color: 'var(--green-accent)' }} strokeWidth={1.5} />
                <span className="font-semibold" style={{ color: 'var(--text)' }}>
                  {user!.ptsScore.toLocaleString()}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>PTS</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-full transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {user!.avatarUrl ? (
                    <img
                      src={user!.avatarUrl}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover border-2"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--pink)' }}
                    >
                      <span className="text-xs font-semibold" style={{ color: 'var(--beige)' }}>{initials}</span>
                    </div>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-3)' }}
                    strokeWidth={1.5}
                  />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                    <div
                      className="absolute right-0 top-full mt-2 w-60 rounded-2xl overflow-hidden border z-20"
                      style={{ background: 'var(--bg)', borderColor: 'var(--border-strong)' }}
                    >
                      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
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
                        className="w-full px-5 py-3 text-left text-sm flex items-center gap-2.5 transition-colors"
                        style={{ color: 'var(--text-2)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <User className="w-4 h-4" strokeWidth={1.5} />
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="w-full px-5 py-3 text-left text-sm flex items-center gap-2.5 transition-colors border-t"
                        style={{ color: '#b54a4a', borderColor: 'var(--border)' }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = 'rgba(181, 74, 74, 0.06)')
                        }
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogOut className="w-4 h-4" strokeWidth={1.5} />
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
              className="btn-pill btn-pill-primary"
            >
              <Star className="w-3.5 h-3.5" strokeWidth={1.5} />
              Sign in
            </button>
          )}
        </div>

        {/* Mobile */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full"
            style={{ color: 'var(--text-3)' }}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" strokeWidth={1.5} /> : <Sun className="w-4 h-4" strokeWidth={1.5} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full"
            style={{ color: 'var(--text-2)' }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="sm:hidden border-t px-5 py-4 space-y-3"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
        >
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 py-3">
                {user!.avatarUrl ? (
                  <img
                    src={user!.avatarUrl}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover border-2"
                    style={{ borderColor: 'var(--border)' }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--pink)' }}
                  >
                    <span className="text-sm font-semibold" style={{ color: 'var(--beige)' }}>{initials}</span>
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
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-2)' }}
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                style={{ background: 'rgba(181, 74, 74, 0.06)', color: '#b54a4a' }}
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onLoginClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-sm font-medium rounded-full text-center"
              style={{ background: 'var(--slate)', color: 'var(--beige)' }}
            >
              Sign in with GitHub
            </button>
          )}
        </div>
      )}
    </header>
  );
}
