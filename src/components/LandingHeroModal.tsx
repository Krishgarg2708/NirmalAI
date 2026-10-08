import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Play,
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  Brain,
  ShieldCheck,
  Truck,
  Flame,
  ArrowRight,
  X,
} from 'lucide-react';

interface LandingHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LandingHeroModal: React.FC<LandingHeroModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentRole, setActiveTab, startJudgeDemo } = useApp();

  if (!isOpen) return null;

  const handleLaunchOperator = () => {
    setCurrentRole('OPERATOR');
    setActiveTab('overview');
    onClose();
  };

  const handleLaunchCitizen = () => {
    setCurrentRole('CITIZEN');
    onClose();
  };

  const handleLaunchJudgeTour = () => {
    startJudgeDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Header */}
        <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Civic Waste Intelligence Platform for Indian Cities</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Turning Urban Waste Management from{' '}
              <span className="text-emerald-400">Reactive</span> to{' '}
              <span className="text-emerald-400">Predictive</span>.
            </h1>

            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              NirmalAI uses computer vision, geospatial intelligence, and predictive analytics to
              identify waste hotspots, optimize municipal collection routes, and audit cleanups
              before public health hazards emerge.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={handleLaunchJudgeTour}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch 3-Minute Judge Demo Tour</span>
              </button>

              <button
                onClick={handleLaunchOperator}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Explore Municipal Command Center</span>
              </button>

              <button
                onClick={handleLaunchCitizen}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Report Waste as Citizen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Closed-loop Workflow: DETECT → ANALYZE → PREDICT → PRIORITIZE → OPTIMIZE → CLEAN → VERIFY */}
        <div className="p-8 sm:p-10 space-y-8">
          <div>
            <h2 className="text-center text-xs font-bold uppercase tracking-widest text-emerald-700">
              Closed-Loop Operational Architecture
            </h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">1. DETECT</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Citizen / IoT / Drone</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">2. ANALYZE</div>
                <div className="text-[10px] text-slate-500 mt-0.5">CV Multi-Class Model</div>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
                <div className="font-bold">3. PREDICT</div>
                <div className="text-[10px] text-rose-700 mt-0.5">48h Hotspot Forecast</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">4. PRIORITIZE</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Waste Risk 0-100</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">5. OPTIMIZE</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Fleet TSP Routes</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">6. CLEAN</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Worker Field App</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <div className="font-bold">7. VERIFY</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Before vs After AI</div>
              </div>
            </div>
          </div>

          {/* Differentiator Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Predictive Hotspot Intelligence
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates historical recurrence, collection lapse, and commercial footfall to
                pre-position collection vehicles before garbage overflows.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Explainable Waste Risk Score
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent 0-100 score weighted by 30% recurrence, 20% frequency, 20% severity,
                15% unresolved duration, and 10% volume.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                AI Cleanup Proof Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prevents false task completions. Computer vision audits before and after proof
                photos to ensure street surfaces are completely cleared.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            NirmalAI MVP &bull; Municipal Corporation of Delhi &bull; MCG Gurugram
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Enter Platform
          </button>
        </div>
      </div>
    </div>
  );
};
