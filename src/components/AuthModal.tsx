/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  signInWithGoogle,
  registerWithEmail,
  loginWithEmail,
} from '../services/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Globe,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
  reason?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  reason,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseSettingsUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`;

  const copyDomainToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentHost);
        setCopied(true);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentHost;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
      }
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    setIsUnauthorizedDomain(false);

    try {
      await signInWithGoogle();
      onAuthSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in was interrupted';
      if (msg.includes('auth/unauthorized-domain')) {
        setIsUnauthorizedDomain(true);
        setErrorMessage(
          `Domain authorization required: "${currentHost}" must be added to your Firebase project's Authorized Domains list.`
        );
      } else if (msg.includes('auth/popup-closed-by-user') || msg.includes('auth/cancelled-popup-request')) {
        setErrorMessage('Sign-in popup was closed before completing.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setIsUnauthorizedDomain(false);

    if (!email || !password) {
      setErrorMessage('Please provide both email address and password.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        await registerWithEmail(email.trim(), password, displayName.trim());
      } else {
        await loginWithEmail(email.trim(), password);
      }
      onAuthSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      if (msg.includes('auth/operation-not-allowed')) {
        setErrorMessage(
          'Email/Password sign-in is not yet enabled in your Firebase Console. Please enable Email/Password under Firebase Console > Authentication > Sign-in method, or sign in with Google.'
        );
      } else if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        setErrorMessage('Invalid email or password credentials. Please verify and retry.');
      } else if (msg.includes('auth/email-already-in-use')) {
        setErrorMessage('This email is already registered. Please switch to Sign In.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-teal-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {mode === 'signin' ? 'Sign In to NeuroScan AI' : 'Create Researcher Account'}
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                Patient Data Protection Gate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason banner if triggered by accessing protected feature */}
        {reason && (
          <div className="px-6 py-2.5 bg-teal-50 border-b border-teal-100 flex items-center gap-2 text-xs text-teal-900">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>{reason}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-600">
          {/* Google Sign-In Button */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-slate-800 font-medium text-xs rounded transition-colors flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Dedicated Authorized Domain Guidance Card */}
          {isUnauthorizedDomain && (
            <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-lg text-amber-950 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-xs text-amber-950">
                    Domain Authorization Required in Firebase
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Firebase OAuth security blocks Google sign-in until your hosting domain is added to Authorized Domains.
                  </p>
                </div>
              </div>

              {/* Domain Copy Box */}
              <div className="bg-white p-2.5 rounded border border-amber-200 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Copy this domain to add in Firebase:
                </span>
                <div className="flex items-center justify-between gap-2 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200">
                  <code className="text-xs font-mono text-slate-900 truncate select-all font-semibold">
                    {currentHost}
                  </code>
                  <button
                    type="button"
                    onClick={copyDomainToClipboard}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-900 rounded transition-colors shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-700" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-[11px] text-slate-700 space-y-1 bg-amber-100/50 p-2.5 rounded border border-amber-200/60">
                <span className="font-semibold text-slate-900 block">Quick 3-step authorization:</span>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700">
                  <li>Click below to open Firebase Console Settings.</li>
                  <li>Scroll to <strong className="text-slate-900">Authorized domains</strong> and click <strong className="text-slate-900">Add domain</strong>.</li>
                  <li>Paste <code className="bg-white px-1 py-0.5 rounded text-slate-900 font-mono text-[10px] font-semibold">{currentHost}</code> and click <strong className="text-slate-900">Done</strong>.</li>
                </ol>
              </div>

              <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={firebaseSettingsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium rounded transition-colors shadow-xs"
                >
                  <span>Open Firebase Settings</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-[11px] text-slate-600">
                  Or register with Email below immediately ↓
                </span>
              </div>
            </div>
          )}

          {/* Generic Error message if not unauthorized domain */}
          {errorMessage && !isUnauthorizedDomain && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-mono uppercase text-slate-400">
              or use email & password
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1 text-[11px]">
                  Researcher / Clinician Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Dr. Jane Smith"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-medium mb-1 text-[11px]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@hospital.org"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1 text-[11px]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Minimum 6 characters.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium rounded transition-colors text-xs flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                  <span>Processing...</span>
                </>
              ) : mode === 'signin' ? (
                'Sign In with Email'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center pt-2 border-t border-slate-100">
            {mode === 'signin' ? (
              <p className="text-[11px] text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                    setIsUnauthorizedDomain(false);
                  }}
                  className="text-teal-700 hover:text-teal-800 font-medium"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setIsUnauthorizedDomain(false);
                  }}
                  className="text-teal-700 hover:text-teal-800 font-medium"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
          <span>Encrypted Session Management</span>
          <span>Firestore Access Rules Enforced</span>
        </div>
      </div>
    </div>
  );
};
