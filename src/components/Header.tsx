import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldAlert,
  Sparkles,
  RotateCcw,
  Building2,
  Users,
  HardHat,
  Play,
  Bell,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

export const Header: React.FC<{ onOpenLanding?: () => void }> = ({ onOpenLanding }) => {
  const {
    currentRole,
    setCurrentRole,
    judgeDemoStep,
    startJudgeDemo,
    resetDemoData,
    stats,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' IST'
      );
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenLanding}
              className="flex items-center gap-2.5 text-left group"
              title="Click to view NirmalAI Mission & Architecture"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight font-sans">
                    NIRMAL<span className="text-emerald-600">AI</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800">
                    MUNICIPAL
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block tracking-tight -mt-0.5">
                  Predict &bull; Prioritize &bull; Clean &bull; Verify
                </div>
              </div>
            </button>

            {/* Municipal Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs text-slate-600">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Municipal Corp &bull; Delhi NCR &amp; Gurugram</span>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/90">
            <button
              onClick={() => setCurrentRole('OPERATOR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'OPERATOR'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Municipal</span> Operator
            </button>

            <button
              onClick={() => setCurrentRole('CITIZEN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'CITIZEN'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Citizen</span>
            </button>

            <button
              onClick={() => setCurrentRole('WORKER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'WORKER'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardHat className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Field</span> Worker
            </button>
          </div>

          {/* Right Action Suite: Judge Tour, Reset, Time */}
          <div className="flex items-center gap-2">
            {/* 3-Min Judge Demo Button */}
            <button
              onClick={startJudgeDemo}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                judgeDemoStep !== null
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
              }`}
              title="Launch the 3-minute hackathon judge walkthrough"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden md:inline">3-Min</span> Judge Tour
            </button>

            {/* Reset Data Button */}
            <button
              onClick={resetDemoData}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-800">
                    <span>Municipal Intelligence Alerts</span>
                    <span className="text-[10px] text-emerald-600 font-mono">LIVE</span>
                  </div>
                  <div className="divide-y divide-slate-100 mt-2 space-y-2">
                    <div className="pt-2 text-slate-700">
                      <div className="font-semibold text-rose-600">Critical Hotspot Escalation</div>
                      <div>Sector 14 Market risk score reached 94/100. Vehicle W-07 recommended.</div>
                    </div>
                    <div className="pt-2 text-slate-700">
                      <div className="font-semibold text-emerald-600">AI Cleanup Verified</div>
                      <div>Hauz Khas Village clearance approved (94% confidence). Ticket closed.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time Stamp */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 font-mono pl-2 border-l border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
