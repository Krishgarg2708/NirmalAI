import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Sliders,
  Truck,
  HardHat,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';

export const JudgeTourBanner: React.FC = () => {
  const {
    judgeDemoStep,
    goToJudgeStep,
    nextJudgeStep,
    prevJudgeStep,
    exitJudgeDemo,
  } = useApp();

  if (judgeDemoStep === null) return null;

  const STEPS = [
    {
      step: 1,
      title: 'Step 1: Municipal Command Center',
      desc: 'Demonstrates real-time civic intelligence: 1,284 reports, 23 critical hotspots, and 93.6% cleanup verification rate.',
      icon: LayoutDashboard,
      badge: 'Command Center',
    },
    {
      step: 2,
      title: 'Step 2: Live City Geospatial Map',
      desc: 'Interactive map displaying multi-class garbage incidents, pulsating recurring hotspots, and live tracked collection vehicles.',
      icon: MapPin,
      badge: 'Geospatial AI',
    },
    {
      step: 3,
      title: 'Step 3: Predictive Hotspot Intelligence',
      desc: 'Sector 14 Market: Explainable Waste Risk Score of 94/100 with 48h risk projection and root-cause diagnostics.',
      icon: TrendingUp,
      badge: 'Predictive ML',
    },
    {
      step: 4,
      title: 'Step 4: AI Prioritization Engine',
      desc: 'Autonomous multi-factor ranking sorts urgent incidents ahead of standard complaints based on public health and drain choking risk.',
      icon: Sliders,
      badge: 'Dynamic Priority',
    },
    {
      step: 5,
      title: 'Step 5: AI Collection Route Optimizer',
      desc: 'Solves multi-stop TSP for Compactor W-07: 18.4 km, 6 stops, 52 min, 1.4 tonnes waste with map polyline rendering.',
      icon: Truck,
      badge: 'Route Planner',
    },
    {
      step: 6,
      title: 'Step 6: Sanitation Worker Mobile Flow',
      desc: 'Field worker app interface for Task NM-2026-10482 showing waste volume, GPS navigation, and proof-of-work camera.',
      icon: HardHat,
      badge: 'Field Ops',
    },
    {
      step: 7,
      title: 'Step 7: Before vs After AI Cleanup Verification',
      desc: 'Computer Vision compares before and after photographs, confirming 94% cleanup confidence and preventing false tickets.',
      icon: ShieldCheck,
      badge: 'CV Verification',
    },
    {
      step: 8,
      title: 'Step 8: Closed-Loop Civic Resolution',
      desc: 'Closed-loop verified completion: Dashboard metrics update, worker rating increments, and waste tonnage accumulates.',
      icon: CheckCircle2,
      badge: 'Closed-Loop Success',
    },
  ];

  const current = STEPS[judgeDemoStep - 1] || STEPS[0];
  const Icon = current.icon;

  return (
    <div className="bg-slate-950 text-white border-b border-emerald-500/40 shadow-xl sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Step description */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {current.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {current.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({judgeDemoStep} of 8)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
                {current.desc}
              </p>
            </div>
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            {/* Step circles */}
            <div className="hidden lg:flex items-center gap-1 mr-2">
              {STEPS.map((s) => (
                <button
                  key={s.step}
                  onClick={() => goToJudgeStep(s.step)}
                  className={`w-6 h-6 rounded-full text-[10px] font-bold font-mono transition-all ${
                    s.step === judgeDemoStep
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 scale-110'
                      : s.step < judgeDemoStep
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                  title={s.title}
                >
                  {s.step}
                </button>
              ))}
            </div>

            <button
              onClick={prevJudgeStep}
              disabled={judgeDemoStep === 1}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={nextJudgeStep}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-500/20"
            >
              <span>{judgeDemoStep === 8 ? 'Finish Tour' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={exitJudgeDemo}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 ml-1"
              title="Close Judge Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
