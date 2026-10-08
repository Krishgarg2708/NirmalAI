import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_IMAGES } from '../../data/mockData';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { BeforeAfterViewer } from '../common/BeforeAfterViewer';
import {
  HardHat,
  Truck,
  MapPin,
  Camera,
  Upload,
  Navigation,
  Play,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Star,
} from 'lucide-react';

export const WorkerPortal: React.FC = () => {
  const {
    reports,
    workers,
    submitWorkerCleanupProof,
    updateIncidentStatus,
  } = useApp();

  // Field worker Ramesh Kumar
  const currentWorker = workers[0]; // Ramesh Kumar
  const assignedTasks = reports.filter(
    (r) =>
      r.assignedWorkerId === currentWorker.id ||
      r.id === 'NM-2026-10482' ||
      r.id === 'NM-2026-10483'
  );

  const [activeTaskId, setActiveTaskId] = useState<string>(
    assignedTasks[0]?.id || 'NM-2026-10482'
  );
  const [navigatingTaskId, setNavigatingTaskId] = useState<string | null>(null);
  const [uploadingForTaskId, setUploadingForTaskId] = useState<string | null>(null);
  const [afterImagePreview, setAfterImagePreview] = useState<string>(SAMPLE_IMAGES.cleanStreetAfter);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  const activeTask = reports.find((r) => r.id === activeTaskId) || assignedTasks[0];

  const handleStartTask = (taskId: string) => {
    updateIncidentStatus(taskId, 'In Progress');
  };

  const handleTriggerUpload = (taskId: string) => {
    setUploadingForTaskId(taskId);
    setVerificationFeedback(null);
  };

  const handleRunAiVerification = async (forceFail = false) => {
    if (!uploadingForTaskId) return;
    setIsVerifying(true);
    setVerificationFeedback(null);

    const afterImg = forceFail
      ? SAMPLE_IMAGES.partiallyCleanedFail
      : afterImagePreview;

    const result = await submitWorkerCleanupProof(
      uploadingForTaskId,
      afterImg,
      forceFail
    );

    setIsVerifying(false);
    setVerificationFeedback(result.message);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Worker Mobile Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentWorker.avatar}
            alt={currentWorker.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {currentWorker.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                ON DUTY
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Swachhata Field Force &bull; {currentWorker.zone} &bull; Compactor Truck {currentWorker.assignedVehicleId}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold mt-1 font-mono">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{currentWorker.rating} Worker Rating</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-emerald-400">{currentWorker.completedTasksCount} Cleanups Verified</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-slate-400">Assigned Tasks Queue</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {assignedTasks.filter((t) => t.status !== 'Resolved').length} Pending
          </div>
        </div>
      </div>

      {/* Main Task Card */}
      {activeTask && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-800">
                  Task #{activeTask.id}
                </span>
                <RiskBadge score={activeTask.riskScore} level={activeTask.severity} size="sm" />
                <StatusBadge status={activeTask.status} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                {activeTask.locationName}
              </h3>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ward {activeTask.wardNumber} &bull; {activeTask.zoneName}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Estimated Volume</div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                ~{activeTask.estimatedVolumeKg} kg
              </div>
              <div className="text-xs text-slate-500">{activeTask.primaryWasteType}</div>
            </div>
          </div>

          {/* Site photo before cleanup */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-rose-500" />
              <span>Original Citizen Report Photo</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-16/9 max-h-72 relative">
              <img
                src={activeTask.beforeImageUrl}
                alt="Before cleanup"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/75 backdrop-blur-xs rounded-xl text-white text-xs flex justify-between">
                <span>{activeTask.title}</span>
                <span className="font-mono text-rose-400 font-bold">Severity: {activeTask.severity}</span>
              </div>
            </div>
          </div>

          {/* Navigation drawer preview if active */}
          {navigatingTaskId === activeTask.id && (
            <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 animate-pulse" />
                  Turn-by-Turn GPS Navigation Active
                </span>
                <button
                  onClick={() => setNavigatingTaskId(null)}
                  className="text-slate-400 hover:text-white"
                >
                  Close GPS
                </button>
              </div>
              <div className="bg-slate-800 p-3 rounded-xl text-xs space-y-1">
                <div className="font-semibold text-white">Next Maneuver: In 400m turn left on Sector 14 Main Road</div>
                <div className="text-slate-400 font-mono">Distance to Target: 1.2 km &bull; ETA: 4 minutes</div>
              </div>
            </div>
          )}

          {/* Action buttons (Navigate, Start Task, Upload Cleanup Proof) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setNavigatingTaskId(activeTask.id)}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Navigate GPS</span>
            </button>

            {activeTask.status !== 'In Progress' && activeTask.status !== 'Resolved' ? (
              <button
                onClick={() => handleStartTask(activeTask.id)}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Start Clearing Task</span>
              </button>
            ) : (
              <div className="py-3 px-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Task In Progress</span>
              </div>
            )}

            <button
              onClick={() => handleTriggerUpload(activeTask.id)}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Cleanup Proof</span>
            </button>
          </div>

          {/* Cleanup Proof & AI Verification section */}
          {uploadingForTaskId === activeTask.id && (
            <div className="pt-6 border-t border-slate-200 space-y-5 animate-fadeIn">
              <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Upload Post-Cleanup Proof for Computer Vision Audit</span>
                  </h4>
                  <span className="text-xs font-mono text-emerald-700 font-semibold">
                    Anti-Fraud Closed-Loop
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Notice: NirmalAI prevents tickets from being resolved merely by clicking
                  &quot;Complete&quot;. The uploaded photograph must be verified by computer vision
                  to ensure waste has been cleared and pavement swept.
                </p>

                {/* Proof samples picker */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Select Proof Sample:</span>
                  <button
                    type="button"
                    onClick={() => setAfterImagePreview(SAMPLE_IMAGES.cleanStreetAfter)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      afterImagePreview === SAMPLE_IMAGES.cleanStreetAfter
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    ✓ Cleaned Pavement (Pass Case)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAfterImagePreview(SAMPLE_IMAGES.partiallyCleanedFail)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      afterImagePreview === SAMPLE_IMAGES.partiallyCleanedFail
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    ✗ Remaining Waste (Reject Case)
                  </button>
                </div>

                {/* Preview of after image */}
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-16/9 max-h-64 bg-slate-900">
                  <img
                    src={afterImagePreview}
                    alt="After cleanup proof"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Trigger AI Verification buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleRunAiVerification(false)}
                    disabled={isVerifying}
                    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isVerifying ? 'Running AI Vision Comparison...' : 'Submit & Run AI Verification (Pass)'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleRunAiVerification(true)}
                    disabled={isVerifying}
                    className="py-3 px-4 bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-50"
                  >
                    Simulate Failed Verification (Trash Remaining)
                  </button>
                </div>

                {verificationFeedback && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-medium">
                    {verificationFeedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* If already resolved or verified, show full Before vs After comparison */}
          {activeTask.afterImageUrl && (
            <div className="pt-4 border-t border-slate-200">
              <BeforeAfterViewer
                beforeImage={activeTask.beforeImageUrl}
                afterImage={activeTask.afterImageUrl}
                verification={activeTask.cleanupVerification}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
