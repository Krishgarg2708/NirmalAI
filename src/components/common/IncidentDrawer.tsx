import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteReport, Worker } from '../../types';
import { RiskBadge } from './RiskBadge';
import { StatusBadge } from './StatusBadge';
import { BeforeAfterViewer } from './BeforeAfterViewer';
import { SAMPLE_IMAGES } from '../../data/mockData';
import {
  X,
  MapPin,
  Calendar,
  User,
  Scale,
  Brain,
  Sparkles,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface IncidentDrawerProps {
  report: WasteReport | null;
  onClose: () => void;
}

export const IncidentDrawer: React.FC<IncidentDrawerProps> = ({ report, onClose }) => {
  const {
    workers,
    assignWorker,
    submitWorkerCleanupProof,
    updateIncidentStatus,
    reoptimizeRoute,
  } = useApp();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!report) return null;

  const handleAssign = () => {
    if (!selectedWorkerId) return;
    assignWorker(report.id, selectedWorkerId);
    setToastMessage('Worker assigned successfully and task dispatched to mobile app!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateCleanupProof = async (forceFail = false) => {
    setIsVerifying(true);
    const afterImg = forceFail
      ? SAMPLE_IMAGES.partiallyCleanedFail
      : SAMPLE_IMAGES.cleanStreetAfter;

    const res = await submitWorkerCleanupProof(report.id, afterImg, forceFail);
    setIsVerifying(false);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddToRoute = () => {
    reoptimizeRoute('W-07', [report.id]);
    setToastMessage('Incident prioritized and included in Vehicle W-07 collection route!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const b = report.riskBreakdown;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl border-l border-slate-200 flex flex-col">
        {/* Drawer Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
              {report.id}
            </span>
            <RiskBadge score={report.riskScore} level={report.severity} size="md" />
            <StatusBadge status={report.status} />
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 shadow-xs animate-slideDown">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        <div className="p-6 space-y-6 flex-1">
          {/* Title & Location */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {report.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {report.locationName} (Ward {report.wardNumber})
              </span>
              <span className="flex items-center gap-1.5 font-mono text-slate-500">
                {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(report.reportedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                IST
              </span>
            </div>
          </div>

          {/* Waste Risk Score Explainability Card (Core Feature!) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <Brain className="w-4 h-4" />
                  <span>NirmalAI Explainable Risk Score</span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
                    {report.riskScore}
                  </span>
                  <span className="text-sm font-medium text-slate-400">/ 100</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      report.riskScore >= 85
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {report.severity} RISK
                  </span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400">
                <div>AI Model Confidence</div>
                <div className="text-emerald-400 font-mono font-bold text-sm">
                  {Math.round(report.confidenceScore * 100)}%
                </div>
              </div>
            </div>

            {/* Score Factor Weight Breakdown */}
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">Historical Recurrence</div>
                <div className="text-white font-mono font-bold mt-0.5">
                  {b.historicalRecurrence} / 30 pts
                </div>
                <div className="w-full bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full"
                    style={{ width: `${(b.historicalRecurrence / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">Report Frequency</div>
                <div className="text-white font-mono font-bold mt-0.5">
                  {b.recentFrequency} / 20 pts
                </div>
                <div className="w-full bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full"
                    style={{ width: `${(b.recentFrequency / 20) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">Severity Multiplier</div>
                <div className="text-white font-mono font-bold mt-0.5">
                  {b.severityWeight} / 20 pts
                </div>
                <div className="w-full bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-rose-400 h-full"
                    style={{ width: `${(b.severityWeight / 20) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">Unresolved Duration</div>
                <div className="text-white font-mono font-bold mt-0.5">
                  {b.unresolvedDuration} / 15 pts
                </div>
                <div className="w-full bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-purple-400 h-full"
                    style={{ width: `${(b.unresolvedDuration / 15) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">Estimated Volume</div>
                <div className="text-white font-mono font-bold mt-0.5">
                  {b.estimatedVolumeWeight} / 10 pts
                </div>
                <div className="w-full bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-blue-400 h-full"
                    style={{ width: `${(b.estimatedVolumeWeight / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">Location Sensitivity</div>
                <div className="text-white font-mono font-bold mt-0.5">
                  {b.locationSensitivity} / 5 pts
                </div>
                <div className="w-full bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-teal-400 h-full"
                    style={{ width: `${(b.locationSensitivity / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Explanation Reasons */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                Why is this score elevated?
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {report.riskReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Waste Analysis details */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Computer Vision Classification
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Volume: ~{report.estimatedVolumeKg} kg
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {report.wasteTypes.map((wt) => (
                <span
                  key={wt}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-2xs"
                >
                  {wt}
                </span>
              ))}
            </div>

            <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-800">AI Recommendation: </span>
              {report.recommendation}
            </div>
          </div>

          {/* Incident Images / Before vs After */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Visual Evidence &amp; AI Verification
            </h3>
            {report.afterImageUrl ? (
              <BeforeAfterViewer
                beforeImage={report.beforeImageUrl}
                afterImage={report.afterImageUrl}
                verification={report.cleanupVerification}
              />
            ) : (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-16/9 relative">
                <img
                  src={report.beforeImageUrl}
                  alt="Incident site"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-semibold shadow-xs">
                  ORIGINAL REPORT PHOTO
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/75 backdrop-blur-xs rounded-xl text-white text-xs flex items-center justify-between">
                  <span>Reported by: {report.reportedBy.name} ({report.reportedBy.role})</span>
                  <span className="font-mono text-emerald-400 font-bold">~{report.estimatedVolumeKg} kg</span>
                </div>
              </div>
            )}
          </div>

          {/* Operator Action Panel */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              Municipal Dispatch &amp; Operations
            </h3>

            {/* Worker assignment */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Assign Sanitation Worker / Crew:
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedWorkerId || report.assignedWorkerId || ''}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select available field worker...</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} &bull; {w.zone} ({w.status}) &bull; Rating: {w.rating}★
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors shrink-0"
                >
                  Assign
                </button>
              </div>
              {report.assignedWorkerName && (
                <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Currently assigned to: <strong>{report.assignedWorkerName}</strong> (Vehicle {report.assignedVehicleId || 'W-07'})
                </div>
              )}
            </div>

            {/* Quick route inclusion */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
              <button
                onClick={handleAddToRoute}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inject into Route W-07 Plan</span>
              </button>

              {/* Cleanup Simulation Buttons (for instant Judge Demo) */}
              {report.status !== 'Resolved' && (
                <button
                  disabled={isVerifying}
                  onClick={() => handleSimulateCleanupProof(false)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    {isVerifying ? 'AI Verifying...' : 'Test AI Cleanup Verification (Pass)'}
                  </span>
                </button>
              )}

              {report.status !== 'Resolved' && (
                <button
                  disabled={isVerifying}
                  onClick={() => handleSimulateCleanupProof(true)}
                  className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors disabled:opacity-50"
                  title="Demonstrate how NirmalAI rejects cleanup if trash remains"
                >
                  Test Incomplete Cleanup (Reject)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
