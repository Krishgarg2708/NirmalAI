import React from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  AlertTriangle,
  Flame,
  Clock,
  ShieldCheck,
  TrendingUp,
  Truck,
  ArrowRight,
  Brain,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    reports,
    hotspots,
    activeRoute,
    insights,
    stats,
    setActiveTab,
    setSelectedIncident,
    setSelectedHotspot,
  } = useApp();

  // Top AI Priorities
  const priorityRanked = [...reports]
    .filter((r) => r.status !== 'Resolved' && r.status !== 'Rejected')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  const criticalHotspot = hotspots.find((h) => h.id === 'HS-101') || hotspots[0];

  return (
    <div className="space-y-6">
      {/* Top Municipal Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reports</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">
            {stats.totalReports.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18 today</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">
            {stats.activeIncidents}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Across 14 Municipal Wards
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-200 bg-rose-50/30 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Hotspots</span>
            <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-700 font-mono">
            {stats.criticalHotspots}
          </div>
          <div className="mt-1 text-[11px] text-rose-700 font-medium">
            Requires preventive action
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Pickup</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">
            {stats.pendingCollections}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            In dispatch queue
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Response</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">
            {stats.avgResponseHours} hrs
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            31% faster than 2025 SLA
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/30 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Verification</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-800 font-mono">
            {stats.cleanupVerificationRate}%
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Computer Vision audited</span>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Priorities + Critical Hotspot Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Recommended Prioritization Engine (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xs">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  AI Recommended Priority Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Autonomous ranking weighted by public health risk, volume &amp; drain choking danger
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('incidents')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All ({reports.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {priorityRanked.map((inc, idx) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {inc.locationName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({inc.id})
                      </span>
                      <RiskBadge score={inc.riskScore} level={inc.severity} size="sm" />
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>Type: <strong className="text-slate-700">{inc.primaryWasteType}</strong></span>
                      <span>&bull;</span>
                      <span>Est. Volume: <strong className="font-mono text-slate-700">~{inc.estimatedVolumeKg} kg</strong></span>
                      <span>&bull;</span>
                      <span className="text-rose-600 font-medium">
                        {inc.riskBreakdown.historicalRecurrence >= 25 ? 'Recurring Hotspot' : 'Recent Surge'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={inc.status} />
                  <span className="text-xs text-slate-400 group-hover:text-emerald-600 font-semibold hidden sm:inline">
                    Inspect &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action footer */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
            <span className="text-xs text-slate-600">
              Need to dispatch the morning collection fleet?
            </span>
            <button
              onClick={() => setActiveTab('routes')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Route Optimization Planner</span>
            </button>
          </div>
        </div>

        {/* Right Column: Predictive Hotspot Spotlight + AI Civic Insights */}
        <div className="space-y-6">
          {/* Spotlight Card */}
          <div className="bg-gradient-to-br from-rose-900 to-slate-950 text-white rounded-2xl p-5 shadow-sm border border-rose-800/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-rose-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                Highest Risk Predictive Hotspot
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] font-bold">
                CRITICAL
              </span>
            </div>

            <h4 className="text-lg font-bold text-white mt-2">
              {criticalHotspot.name}
            </h4>
            <div className="text-xs text-rose-200 mt-0.5">
              Ward {criticalHotspot.wardNumber} &bull; {criticalHotspot.zoneName}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-rose-800/60">
              <div>
                <div className="text-[10px] text-rose-300 uppercase">Current Score</div>
                <div className="text-2xl font-bold font-mono text-white mt-0.5">
                  {criticalHotspot.currentScore}/100
                </div>
              </div>
              <div>
                <div className="text-[10px] text-rose-300 uppercase">Predicted 48h Risk</div>
                <div className="text-2xl font-bold font-mono text-amber-300 mt-0.5">
                  {criticalHotspot.predicted48hRisk}/100
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-rose-100 bg-rose-950/60 p-3 rounded-xl border border-rose-800/40">
              <span className="font-semibold text-rose-300">Prediction: </span>
              High probability of recurring waste overflow within 48h. 16 previous reports.
            </div>

            <button
              onClick={() => setSelectedHotspot(criticalHotspot)}
              className="mt-4 w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-rose-900/40"
            >
              <span>Examine Hotspot Diagnostics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Insights Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>NirmalAI Municipal Insights</span>
            </div>

            <div className="divide-y divide-slate-100 mt-2 space-y-3">
              {insights.slice(0, 3).map((ins) => (
                <div key={ins.id} className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{ins.title}</span>
                    <span className="text-[10px] text-slate-400">{ins.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {ins.description}
                  </p>
                  <div className="mt-2 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    &bull; {ins.impactMetric}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
