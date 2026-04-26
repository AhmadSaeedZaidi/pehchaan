'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
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
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg)', borderColor: 'var(--border-strong)' }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-5 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" style={{ color: 'var(--cyan)' }} />
                <span
                  className="text-[10px] uppercase tracking-widest font-mono font-semibold"
                  style={{ color: 'var(--cyan)' }}
                >
                  Identity Verification
                </span>
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                Get your Pehchaan
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
                Enter your GitHub handle. We&apos;ll fetch your public profile,
                analyse it with AI, and build you a real Trust Score.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors -mt-1 -mr-1"
              style={{ color: 'var(--text-3)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Username input */}
          <div>
            <label
              htmlFor="github-username"
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: 'var(--text-2)' }}
            >
              GitHub Username
            </label>
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-strong)',
              }}
            >
              <GithubIcon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-3)' }} />
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
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg border text-sm"
              style={{
                background: 'rgba(239,68,68,0.08)',
                borderColor: 'rgba(239,68,68,0.25)',
                color: '#dc2626',
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Steps preview */}
          <div className="rounded-lg p-3 space-y-1.5" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
              What happens next
            </p>
            {[
              'Fetch your GitHub profile + recent repos',
              'Search the web for additional context (Tavily)',
              'AI analyst reviews everything (Gemini)',
              'Save your enriched profile to Neon DB',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-2)' }}>
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
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
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 text-white"
            style={{
              background:
                submitting || !username.trim()
                  ? 'var(--bg-tertiary)'
                  : 'var(--cyan)',
              color: submitting || !username.trim() ? 'var(--text-3)' : '#fff',
            }}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analysing your profile...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
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
