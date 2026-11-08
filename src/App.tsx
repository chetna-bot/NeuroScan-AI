/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { ActiveTab, AnalysisResult, BackendStatus } from './types/analysis';
import { fetchBackendStatus } from './services/api';
import {
  auth,
  logOut,
  testFirestoreConnection,
  saveAnalysisToUserFirestore,
  deleteAnalysisFromUserFirestore,
  subscribeToUserAnalyses,
} from './services/firebase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { AnalyzeView } from './components/AnalyzeView';
import { ResultsView } from './components/ResultsView';
import { ColabSetupModal } from './components/ColabSetupModal';
import { AuthModal } from './components/AuthModal';

const STORAGE_KEY = 'neuroscan_ai_analyses_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | undefined>(undefined);

  // 1. Initial Firestore connection validation on app boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // 2. Auth State Observer
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
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

  // 4. Fetch initial backend connection status
  useEffect(() => {
    fetchBackendStatus()
      .then((status) => {
        setBackendStatus(status);
      })
      .catch(() => {
        // Handled silently
      });
  }, []);

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
        backendStatus={backendStatus}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
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
            backendStatus={backendStatus}
            onOpenBackendModal={() => setIsBackendModalOpen(true)}
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
            backendStatus={backendStatus}
            onOpenBackendModal={() => setIsBackendModalOpen(true)}
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

      {/* 4. Colab Backend Connection Modal */}
      <ColabSetupModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        status={backendStatus}
        onStatusUpdated={(status) => setBackendStatus(status)}
      />

      {/* 5. User Authentication Modal */}
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
