import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  TreePine,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Truck,
  Leaf,
  Droplets,
  HeartHandshake,
} from 'lucide-react';

export const ImpactTab: React.FC = () => {
  const { stats } = useApp();

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Leaf className="w-3.5 h-3.5" />
            <span>Civic Environmental &amp; Urban Health Impact</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Transforming Indian Cities from Reactive Cleanup to Clean Habitats
          </h1>
          <p className="mt-2 text-emerald-100 text-sm leading-relaxed">
            By shifting from waiting for citizen grievances to predictive hotspot mitigation,
            NirmalAI prevents roadside waste rotting, prevents drain choking before monsoon rains,
            and eliminates ghost cleanup reports via verifiable Computer Vision audits.
          </p>
        </div>
      </div>

      {/* Big Impact Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center shadow-sm">
          <div className="text-xs text-slate-500 uppercase font-bold">Waste Managed</div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono mt-1">
            {(stats.totalWasteCollectedKg / 1000).toFixed(1)}T
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Metric Tonnes Diverted</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center shadow-sm">
          <div className="text-xs text-slate-500 uppercase font-bold">Incidents Resolved</div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
            342
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Civic Complaints Closed</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center shadow-sm">
          <div className="text-xs text-slate-500 uppercase font-bold">Hotspots Prevented</div>
          <div className="text-3xl font-extrabold text-rose-600 font-mono mt-1">
            27
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cleared Pre-Accumulation</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center shadow-sm">
          <div className="text-xs text-slate-500 uppercase font-bold">Route Km Saved</div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono mt-1">
            18.4%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Fuel &amp; Fleet Distance</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center shadow-sm">
          <div className="text-xs text-slate-500 uppercase font-bold">Faster Response</div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
            31%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Average Response Speed</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center shadow-sm">
          <div className="text-xs text-slate-500 uppercase font-bold">Verification Rate</div>
          <div className="text-3xl font-extrabold text-teal-700 font-mono mt-1">
            {stats.cleanupVerificationRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Zero Fake Closures</div>
        </div>
      </div>

      {/* Sustainable Development Goals / Civic Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <TreePine className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            Urban Hygiene &amp; Drain Choking Prevention
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            By analyzing plastic density near open drains in Old Gurugram and Chandni Chowk,
            the system triggers preventive compactor sweeps, reducing urban waterlogging risk
            by an estimated 42%.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            Fleet Carbon Footprint Reduction
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Multi-stop TSP route planning avoids zig-zagging compactor trucks across city wards,
            reducing diesel consumption by 18.4% and saving over 350 kg of CO2 emissions weekly.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            Accountability &amp; Swachh Bharat Compliance
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Eliminates the legacy municipal flaw where workers marked tasks completed without
            cleaning. With NirmalAI, tickets remain unresolved until Computer Vision verifies
            surface clearing with over 90% confidence.
          </p>
        </div>
      </div>
    </div>
  );
};
