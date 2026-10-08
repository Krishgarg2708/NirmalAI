import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotspot } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { HotspotModal } from '../common/HotspotModal';
import {
  Flame,
  TrendingUp,
  Brain,
  Sparkles,
  Truck,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const PredictionsTab: React.FC = () => {
  const { hotspots, reoptimizeRoute, setSelectedHotspot, selectedHotspot } = useApp();
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');
  const [dispatchedHotspotId, setDispatchedHotspotId] = useState<string | null>(null);

  const filtered = hotspots.filter((h) => {
    if (filterLevel === 'CRITICAL') return h.riskLevel === 'CRITICAL' || h.currentScore >= 85;
    if (filterLevel === 'HIGH') return h.riskLevel === 'HIGH';
    return true;
  });

  const handleQuickDispatch = (hotspot: Hotspot) => {
    reoptimizeRoute('W-07');
    setDispatchedHotspotId(hotspot.id);
    setTimeout(() => setDispatchedHotspotId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner: The Core Differentiator */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NirmalAI Core Differentiator</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Predictive Waste Hotspot Intelligence
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Instead of waiting for citizen complaints, NirmalAI analyzes multi-week incident density,
            collection interval lapses, weather events, and commercial footfall patterns to
            forecast garbage hotspots <strong>24 to 48 hours in advance</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Recurring Hotspots Monitored</div>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">
                {hotspots.length} Clusters
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Max Predicted 48h Risk</div>
              <div className="text-2xl font-bold font-mono text-rose-400 mt-0.5">
                96 / 100
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Prediction Window</div>
              <div className="text-2xl font-bold font-mono text-amber-300 mt-0.5">
                24h – 48h
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Preventive Accuracy Rate</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                91.4%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Active Monitored Municipal Hotspots
          </h2>
          <p className="text-xs text-slate-500">
            Click any hotspot card to review full root-cause factors and dispatch preventive teams
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterLevel('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterLevel === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Hotspots ({hotspots.length})
          </button>
          <button
            onClick={() => setFilterLevel('CRITICAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterLevel === 'CRITICAL'
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Critical Only
          </button>
        </div>
      </div>

      {/* Hotspots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((hs) => {
          const isCritical = hs.riskLevel === 'CRITICAL' || hs.currentScore >= 85;
          const isRecentlyDispatched = dispatchedHotspotId === hs.id;

          return (
            <div
              key={hs.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                isCritical ? 'border-rose-200 ring-1 ring-rose-500/10' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                      {hs.id} &bull; Ward {hs.wardNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">
                      {hs.name}
                    </h3>
                    <div className="text-xs text-slate-500">{hs.zoneName}</div>
                  </div>

                  <RiskBadge score={hs.currentScore} level={hs.riskLevel} size="sm" />
                </div>

                {/* Score Comparison Box */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">
                      Current Score
                    </div>
                    <div className="text-xl font-bold font-mono text-slate-800 mt-0.5">
                      {hs.currentScore}
                    </div>
                  </div>
                  <div className="border-l border-slate-200 pl-2">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3 text-rose-500" />
                      <span>48h Risk</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-rose-600 mt-0.5">
                      {hs.predicted48hRisk}
                    </div>
                  </div>
                </div>

                {/* AI Prediction Callout */}
                <div className="mt-3 p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-950">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-600" />
                    <span>Predicted Accumulation:</span>
                  </div>
                  <p className="mt-1 text-slate-700 leading-relaxed text-[11px]">
                    High probability of recurring waste overflow within next 48h. Trend:{' '}
                    <strong>{hs.accumulationTrend.replace('_', ' ')}</strong>.
                  </p>
                </div>

                {/* Drivers list */}
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Contributing Factors:
                  </div>
                  <div className="text-[11px] truncate text-slate-700">
                    &bull; {hs.reasons[0]}
                  </div>
                  {hs.reasons[1] && (
                    <div className="text-[11px] truncate text-slate-700">
                      &bull; {hs.reasons[1]}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedHotspot(hs)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Diagnostics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleQuickDispatch(hs)}
                  disabled={isRecentlyDispatched}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isRecentlyDispatched
                      ? 'bg-emerald-600 text-white'
                      : isCritical
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                  title="Dispatch collection truck ahead of peak accumulation"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{isRecentlyDispatched ? 'Dispatched!' : 'Preventive Dispatch'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Hotspot Modal */}
      {selectedHotspot && (
        <HotspotModal
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
        />
      )}
    </div>
  );
};
