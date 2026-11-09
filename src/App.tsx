/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { ActiveTab, AnalysisResult } from './types/analysis';
import {
  auth,
  logOut,
  testFirestoreConnection,
  saveAnalysisToUserFirestore,
  deleteAnalysisFromUserFirestore,
  subscribeToUserAnalyses,
  AppUser,
} from './services/firebase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { AnalyzeView } from './components/AnalyzeView';
import { ResultsView } from './components/ResultsView';
import { AuthModal } from './components/AuthModal';

const STORAGE_KEY = 'neuroscan_ai_analyses_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  // Auth state (supports both Firebase User and verified Researcher Clinician session)
  const [currentUser, setCurrentUser] = useState<User | AppUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | undefined>(undefined);

  // 1. Initial Firestore connection validation on app boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // 2. Auth State Observer with local researcher fallback
  useEffect(() => {
    const syncUser = () => {
      const fbUser = auth.currentUser;
      if (fbUser) {
        setCurrentUser(fbUser);
        return;
      }
      const savedSession = localStorage.getItem('neuroscan_researcher_session');
      if (savedSession) {
        try {
          setCurrentUser(JSON.parse(savedSession));
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    syncUser();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        syncUser();
      }
    });

    window.addEventListener('neuroscan_auth_change', syncUser);

    return () => {
      unsubscribeAuth();
      window.removeEventListener('neuroscan_auth_change', syncUser);
    };
  }, []);

  // 3. Sync Firestore Data when User is Authenticated
  useEffect(() => {
    if (!currentUser) {
      // When guest, load from session localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setAnalyses(parsed);
            if (parsed.length > 0 && !currentResult) {
              setCurrentResult(parsed[0]);
            }
          }
        } else {
          setAnalyses([]);
        }
      } catch {
        setAnalyses([]);
      }
      return;
    }

    // When authenticated, attach real-time Firestore listener
    const unsubscribeFirestore = subscribeToUserAnalyses(
      currentUser.uid,
      (firestoreItems) => {
        setAnalyses(firestoreItems);
        if (firestoreItems.length > 0 && !currentResult) {
          setCurrentResult(firestoreItems[0]);
        }
      },
      (err) => {
        console.warn('Firestore subscription notice:', err.message);
      }
    );

    return () => unsubscribeFirestore();
  }, [currentUser]);


  const openAuthWithReason = (reason?: string) => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setCurrentResult(null);
      setAnalyses([]);
      localStorage.removeItem(STORAGE_KEY);
      setActiveTab('landing');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleAnalysisSuccess = async (result: AnalysisResult) => {
    // 1. Persist to Firestore if authenticated
    if (currentUser) {
      try {
        await saveAnalysisToUserFirestore(currentUser.uid, result);
      } catch (err) {
        console.error('Failed to persist to Firestore:', err);
      }
    }

    // 2. Local fallback state update
    const updated = [result, ...analyses];
    setAnalyses(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Local quota
    }

    setCurrentResult(result);
    setActiveTab('results');
  };

  const handleDeleteAnalysis = async (id: string) => {
    if (currentUser) {
      try {
        await deleteAnalysisFromUserFirestore(currentUser.uid, id);
      } catch (err) {
        console.error('Failed to delete from Firestore:', err);
      }
    }
    const updated = analyses.filter((a) => a.id !== id);
    setAnalyses(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    if (currentResult?.id === id) {
      setCurrentResult(updated[0] || null);
    }
  };

  const handleClearHistory = () => {
    setAnalyses([]);
    setCurrentResult(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const handleSelectResult = (result: AnalysisResult) => {
    setCurrentResult(result);
    setActiveTab('results');
  };

  const handleNewScan = () => {
    setActiveTab('analyze');
  };

  // Safe navigation gate: protect patient data from unauthenticated access
  const handleTabChange = (tab: ActiveTab) => {
    if ((tab === 'analyze' || tab === 'dashboard') && !currentUser) {
      openAuthWithReason('Authentication required to access protected patient MRI workflows.');
      // Still allow viewing dashboard or analyze landing with protection gates
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1. Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        currentUser={currentUser}
        onOpenAuthModal={openAuthWithReason}
        onSignOut={handleSignOut}
      />

      {/* 2. Main Page View Container */}
      <main className="flex-1">
        {activeTab === 'landing' && <LandingView onTabChange={handleTabChange} />}

        {activeTab === 'dashboard' && (
          <DashboardView
            analyses={analyses}
            onTabChange={handleTabChange}
            onSelectResult={handleSelectResult}
            onClearHistory={handleClearHistory}
            currentUser={currentUser}
            onOpenAuthModal={openAuthWithReason}
            onDeleteAnalysis={handleDeleteAnalysis}
          />
        )}

        {activeTab === 'analyze' && (
          <AnalyzeView
            onAnalysisSuccess={handleAnalysisSuccess}
            onTabChange={handleTabChange}
            currentUser={currentUser}
            onOpenAuthModal={openAuthWithReason}
          />
        )}

        {activeTab === 'results' && (
          <ResultsView
            result={currentResult}
            onTabChange={handleTabChange}
            onNewScan={handleNewScan}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer onTabChange={handleTabChange} />

      {/* 4. User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          setIsAuthModalOpen(false);
        }}
        reason={authModalReason}
      />
    </div>
  );
}
