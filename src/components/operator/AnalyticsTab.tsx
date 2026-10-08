import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Clock,
  Layers,
  ArrowUpRight,
  Flame,
} from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const { hotspots, stats } = useApp();
  const [timeRange, setTimeRange] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');

  const topHotspots = [...hotspots]
    .sort((a, b) => b.historicalReportsCount - a.historicalReportsCount)
    .slice(0, 5);

  const wardData = [
    { ward: 'Ward 14 (Old Gurugram)', reports: 42, volumeTonnes: 5.4, pct: 32 },
    { ward: 'Ward 8 (Chandni Chowk)', reports: 31, volumeTonnes: 3.8, pct: 24 },
    { ward: 'Ward 21 (Cybercity)', reports: 24, volumeTonnes: 2.9, pct: 18 },
    { ward: 'Ward 12 (Sadar Bazaar)', reports: 19, volumeTonnes: 2.1, pct: 15 },
    { ward: 'Ward 34 (Hauz Khas)', reports: 14, volumeTonnes: 1.6, pct: 11 },
  ];

  const wasteTypeData = [
    { type: 'Plastic & Polymers', percent: 42, color: 'bg-emerald-500' },
    { type: 'Organic Wet Waste', percent: 31, color: 'bg-amber-500' },
    { type: 'Paper & Cardboard', percent: 14, color: 'bg-blue-500' },
    { type: 'Construction & Debris', percent: 8, color: 'bg-purple-500' },
    { type: 'Hazardous / Clinical', percent: 5, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Civic Waste Analytics &amp; Municipal Trends</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time municipal performance intelligence and machine-learning trend audits
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeRange === r
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Waste Processed</div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
            {(stats.totalWasteCollectedKg / 1000).toFixed(1)} <span className="text-sm font-sans font-normal text-slate-500">tonnes</span>
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs previous period</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Avg Response Time</div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
            {stats.avgResponseHours} <span className="text-sm font-sans font-normal text-slate-500">hours</span>
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Down from 6.8h in 2025</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">AI Verification Rate</div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono mt-1">
            {stats.cleanupVerificationRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Zero tickets closed without image audit
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Route Efficiency</div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
            18.4% <span className="text-sm font-sans font-normal text-slate-500">saved</span>
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            4.2 km fuel reduction per round
          </div>
        </div>
      </div>

      {/* Charts Grid: Ward Breakdown & Waste Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ward Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-1">
            Waste Volume by Municipal Ward ({timeRange.toLowerCase()})
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Total tonnage processed across high-density commercial zones
          </p>

          <div className="space-y-3.5">
            {wardData.map((w, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>{w.ward}</span>
                  <span className="font-mono">{w.volumeTonnes}T &bull; {w.reports} incidents</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${w.pct * 2.8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Categories Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-1">
            Waste Material Classification Breakdown
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Audited via NirmalAI Computer Vision classification models
          </p>

          <div className="space-y-3.5">
            {wasteTypeData.map((item, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>{item.type}</span>
                  <span className="font-mono font-bold">{item.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 Recurring Hotspots Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Top 5 Recurring Municipal Hotspots (30-Day Recurrence)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by frequency of re-accumulation after municipal clearing
            </p>
          </div>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-200 text-[11px] uppercase">
                <th className="py-2.5 px-3">Hotspot Name</th>
                <th className="py-2.5 px-3">Ward / Zone</th>
                <th className="py-2.5 px-3">30-Day Incidents</th>
                <th className="py-2.5 px-3">Current Risk</th>
                <th className="py-2.5 px-3">48h Predicted</th>
                <th className="py-2.5 px-3">Accumulation Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topHotspots.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {h.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    Ward {h.wardNumber} ({h.zoneName})
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {h.historicalReportsCount} reports
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-600">
                    {h.currentScore}/100
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-600">
                    {h.predicted48hRisk}/100
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {h.accumulationTrend.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
