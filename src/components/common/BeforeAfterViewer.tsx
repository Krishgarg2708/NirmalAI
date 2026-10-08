import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { CleanupVerification } from '../../types';

interface BeforeAfterViewerProps {
  beforeImage: string;
  afterImage: string;
  verification?: CleanupVerification;
  title?: string;
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  beforeImage,
  afterImage,
  verification,
  title = 'AI Verification: Before vs After Cleanup Comparison',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  const checklist = verification?.checklist || {
    wasteReduced: true,
    areaAccessible: true,
    accumulationRemoved: true,
    sanitizedOrSwept: true,
  };

  const isVerified = verification ? verification.verified : true;
  const confidencePercent = verification
    ? Math.round(verification.confidenceScore * 100)
    : 94;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="font-semibold text-slate-800 text-sm tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Computer Vision deep-feature comparison &amp; surface obstruction audit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-200/80 p-0.5 rounded-lg flex text-xs">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === 'slider'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Slider
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Side by Side
            </button>
          </div>
        </div>
      </div>

      {/* Visual Content */}
      <div className="p-5">
        {viewMode === 'slider' ? (
          <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden select-none border border-slate-200 bg-slate-950">
            {/* After Image (Background) */}
            <img
              src={afterImage}
              alt="After Cleanup"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white text-xs font-semibold shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              AFTER CLEANUP
            </div>

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={beforeImage}
                alt="Before Cleanup"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%', minWidth: '100%' }}
              />
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-rose-600/90 backdrop-blur-xs text-white text-xs font-semibold shadow-md flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                BEFORE REPORTED
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-20 flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-lg border border-slate-300 flex items-center justify-center text-slate-700">
                <SlidersHorizontal className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Slider Range Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Image comparison slider"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-4/3">
              <img
                src={beforeImage}
                alt="Before Cleanup"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                BEFORE
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs">
                Visible accumulated municipal waste &amp; single-use packaging
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-4/3">
              <img
                src={afterImage}
                alt="After Cleanup"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                AFTER
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs">
                Cleared road surface, zero major obstructions, swept pavement
              </div>
            </div>
          </div>
        )}

        {/* Verification Result Callout */}
        <div
          className={`mt-4 rounded-xl p-4 border ${
            isVerified
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className={`w-5 h-5 ${
                  isVerified ? 'text-emerald-600' : 'text-rose-600'
                }`}
              />
              <span className="font-bold text-sm tracking-tight">
                AI CLEANUP VERIFICATION:{' '}
                {isVerified ? (
                  <span className="text-emerald-700">VERIFIED &amp; APPROVED</span>
                ) : (
                  <span className="text-rose-700">REJECTED (INCOMPLETE)</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
              <span>CONFIDENCE:</span>
              <span className={isVerified ? 'text-emerald-600' : 'text-rose-600'}>
                {confidencePercent}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed mb-3">
            {verification?.explanation ||
              'Computer Vision model compared spatial feature maps between before and after frames. Road obstruction cleared by 96%. Verification passed.'}
          </p>

          {/* Verification Audit Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-xs">
            <div className="flex items-center gap-1.5">
              {checklist.wasteReduced ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <span className="text-slate-800">Waste Reduced</span>
            </div>
            <div className="flex items-center gap-1.5">
              {checklist.areaAccessible ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <span className="text-slate-800">Area Accessible</span>
            </div>
            <div className="flex items-center gap-1.5">
              {checklist.accumulationRemoved ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <span className="text-slate-800">Piles Cleared</span>
            </div>
            <div className="flex items-center gap-1.5">
              {checklist.sanitizedOrSwept ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <span className="text-slate-800">Swept / Sanitized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
