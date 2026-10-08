/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { JudgeTourBanner } from './components/JudgeTourBanner';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { WorkerPortal } from './components/worker/WorkerPortal';
import { LandingHeroModal } from './components/LandingHeroModal';
import { Sparkles, Building2, ShieldCheck, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentRole } = useApp();
  const [showLandingModal, setShowLandingModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header onOpenLanding={() => setShowLandingModal(true)} />

      {/* Guided Judge Walkthrough Floating Stepper Banner */}
      <JudgeTourBanner />

      {/* Role-Based App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === 'OPERATOR' && <OperatorDashboard />}
        {currentRole === 'CITIZEN' && <CitizenPortal />}
        {currentRole === 'WORKER' && <WorkerPortal />}
      </main>

      {/* Landing Pitch Modal */}
      <LandingHeroModal
        isOpen={showLandingModal}
        onClose={() => setShowLandingModal(false)}
      />

      {/* Municipal Civic Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
              N
            </div>
            <span className="font-semibold text-slate-700">
              NIRMALAI &bull; Urban Waste Intelligence &amp; Response Platform
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-[11px] text-slate-400">
              Predict. Prioritize. Clean. Verify.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono">
              Simulated Municipal Data (Delhi NCR / Gurugram)
            </span>
            <span>&bull;</span>
            <button
              onClick={() => setShowLandingModal(true)}
              className="hover:text-emerald-700 font-medium transition-colors"
            >
              System Architecture &amp; Mission
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
