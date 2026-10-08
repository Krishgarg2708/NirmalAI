import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hotspot } from '../../types';
import { RiskBadge } from './RiskBadge';
import {
  X,
  Flame,
  TrendingUp,
  AlertOctagon,
  Clock,
  Truck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface HotspotModalProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({ hotspot, onClose }) => {
  const { reoptimizeRoute } = useApp();
  const [dispatched, setDispatched] = useState(false);

  if (!hotspot) return null;

  const handleDispatch = () => {
    reoptimizeRoute('W-07');
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-200 text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-300" />
            <span>AI Predictive Hotspot Intelligence</span>
          </div>

          <h2 className="text-xl font-bold mt-1 text-white">{hotspot.name}</h2>
          <div className="text-xs text-rose-100 mt-0.5">
            Ward {hotspot.wardNumber} &bull; {hotspot.zoneName}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20">
            <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl">
              <div className="text-[11px] text-rose-200 uppercase font-semibold">
                Current Risk Score
              </div>
              <div className="text-3xl font-extrabold font-mono text-white mt-0.5">
                {hotspot.currentScore}
                <span className="text-xs font-normal text-rose-200">/100</span>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl">
              <div className="text-[11px] text-rose-200 uppercase font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                <span>Predicted 48h Risk</span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-amber-300 mt-0.5">
                {hotspot.predicted48hRisk}
                <span className="text-xs font-normal text-rose-200">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Predictive Banner */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-900">
                Critical Hotspot Accumulation Forecast:
              </div>
              <div className="mt-0.5 leading-relaxed text-amber-900/90">
                High probability of recurring municipal waste overflow within the next{' '}
                <strong>{hotspot.predictionWindowHours} hours</strong>. Trend:{' '}
                <span className="font-bold text-rose-700">
                  {hotspot.accumulationTrend.replace('_', ' ')}
                </span>
                .
              </div>
            </div>
          </div>

          {/* Contributing Risk Factors */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Hotspot Recurrence Drivers &amp; Diagnostics:
            </h4>
            <div className="space-y-2">
              {hotspot.reasons.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical stats pills */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-100 p-2.5 rounded-xl">
              <div className="text-slate-500 text-[10px]">30-Day Reports</div>
              <div className="font-bold font-mono text-slate-800 mt-0.5">
                {hotspot.historicalReportsCount}
              </div>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-xl">
              <div className="text-slate-500 text-[10px]">Unresolved Now</div>
              <div className="font-bold font-mono text-rose-600 mt-0.5">
                {hotspot.unresolvedIncidentsCount}
              </div>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-xl">
              <div className="text-slate-500 text-[10px]">Last Cleared</div>
              <div className="font-bold font-mono text-slate-800 mt-0.5">
                {hotspot.lastCollectionHoursAgo}h ago
              </div>
            </div>
          </div>

          {/* AI Recommended Action */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Recommended Municipal Intervention:</span>
            </div>
            <div className="text-xs text-emerald-950 font-medium leading-relaxed">
              {hotspot.recommendedAction}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            >
              Close
            </button>
            <button
              onClick={handleDispatch}
              disabled={dispatched}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {dispatched ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Crew Dispatched &bull; Route Updated</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Dispatch Preventive Vehicle W-07</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
