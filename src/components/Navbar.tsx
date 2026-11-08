/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveTab, BackendStatus } from '../types/analysis';
import { Activity, Radio } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  backendStatus: BackendStatus | null;
  onOpenBackendModal: () => void;
  currentUser: import('firebase/auth').User | null;
  onOpenAuthModal: (reason?: string) => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  backendStatus,
  onOpenBackendModal,
  currentUser,
  onOpenAuthModal,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onTabChange('landing')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-sm whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-teal-400 group-hover:bg-slate-800 transition-colors">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900">
            NeuroScan AI
          </span>
        </button>

        {/* Zone 2: Concise Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onTabChange('landing')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'landing'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'dashboard'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('analyze')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'analyze'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            MRI Analysis
          </button>
        </nav>

        {/* Zone 3: Primary Action & Connection Status & Auth */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenBackendModal}
            title={
              backendStatus?.isReachable
                ? 'Colab Backend Connected'
                : backendStatus?.configured
                ? 'Backend Configured (Connecting...)'
                : 'Configure Colab Backend'
            }
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            <Radio
              className={`w-3.5 h-3.5 ${
                backendStatus?.isReachable
                  ? 'text-teal-600'
                  : backendStatus?.configured
                  ? 'text-amber-500'
                  : 'text-slate-400'
              }`}
            />
            <span className="hidden sm:inline font-mono">
              {backendStatus?.isReachable
                ? 'Colab Online'
                : backendStatus?.configured
                ? 'Colab Pending'
                : 'Connect Colab'}
            </span>
          </button>

          {/* User Authentication Status */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-xs text-slate-700 max-w-[150px] sm:max-w-[200px]">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User avatar"
                    className="w-4 h-4 rounded-full"
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="truncate text-[11px] font-medium">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal('Please sign in to access protected MRI analysis and data.')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => onTabChange('analyze')}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 active:bg-slate-950 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    </header>
  );
};
