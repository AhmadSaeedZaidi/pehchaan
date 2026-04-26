'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, AlertCircle, Star } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import { useUser } from '@/context/UserContext';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setUsername('');
      setErrorMsg(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    const value = username.trim();
    if (!value) return;
    setSubmitting(true);
    const result = await login(value);
    setSubmitting(false);
    if (result.ok) {
      onSuccess?.();
      onClose();
    } else {
      setErrorMsg(result.error);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(60, 65, 92, 0.35)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border overflow-hidden"
        style={{ background: 'var(--bg)', borderColor: 'var(--border-strong)' }}
      >
        {/* Decorative organic blob */}
        <div className="absolute -top-20 -right-20 w-48 h-48 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" style={{ fill: '#a5bc94' }}>
            <path d="M150,-10C180,40,190,100,150,150C110,200,50,200,10,150C-30,100,-40,40,-10,-10C20,-60,120,-60,150,-10Z" />
          </svg>
        </div>

        {/* Header */}
        <div
          className="px-7 pt-7 pb-6 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 celestial-icon" style={{ color: 'var(--pink)' }} />
                <span
                  className="text-[10px] uppercase tracking-widest font-medium"
                  style={{ color: 'var(--pink)', letterSpacing: '0.15em' }}
                >
                  Identity Verification
                </span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
                Get your Pehchaan
              </h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-3)', lineHeight: '1.6' }}>
                Enter your GitHub handle. We'll fetch your public profile,
                analyse it with AI, and build you a real Trust Score.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors"
              style={{ color: 'var(--text-3)' }}
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
          {/* Username input */}
          <div>
            <label
              htmlFor="github-username"
              className="block text-xs font-medium mb-2.5 uppercase tracking-wider"
              style={{ color: 'var(--text-2)', letterSpacing: '0.08em' }}
            >
              GitHub Username
            </label>
            <div
              className="flex items-center gap-2.5 rounded-2xl border px-4 py-3 transition-colors"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-strong)',
              }}
            >
              <GithubIcon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-3)' }} />
              <span className="text-sm" style={{ color: 'var(--text-3)' }}>github.com/</span>
              <input
                id="github-username"
                autoFocus
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-handle"
                disabled={submitting}
                className="flex-1 bg-transparent outline-none text-sm font-medium"
                style={{ color: 'var(--text)' }}
                pattern="[a-zA-Z0-9-]{1,39}"
              />
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm"
              style={{
                background: 'rgba(181, 74, 74, 0.08)',
                borderColor: 'rgba(181, 74, 74, 0.25)',
                color: '#b54a4a',
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Steps preview */}
          <div className="rounded-2xl p-4 space-y-2.5" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-3)', letterSpacing: '0.1em' }}>
              What happens next
            </p>
            {[
              'Fetch your GitHub profile + recent repos',
              'Search the web for additional context (Tavily)',
              'AI analyst reviews everything (Gemini)',
              'Save your enriched profile to Neon DB',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-2)' }}>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 mt-0.5"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-2)' }}
                >
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting || !username.trim()}
            className="btn-pill btn-pill-primary w-full py-3"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                Analysing your profile...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                Verify with GitHub
              </>
            )}
          </button>

          <p className="text-[11px] text-center" style={{ color: 'var(--text-3)' }}>
            We only read public data. No GitHub OAuth required.
          </p>
        </form>
      </div>
    </div>
  );
}
