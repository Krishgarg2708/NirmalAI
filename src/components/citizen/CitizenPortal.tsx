import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_IMAGES, FALLBACK_BEFORE_IMAGE } from '../../data/mockData';
import { analyzeWasteImage } from '../../services/wasteDetectionService';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import {
  Camera,
  Upload,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const CitizenPortal: React.FC = () => {
  const { addNewReport, reports } = useApp();

  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_IMAGES.marketDumpBefore);
  const [locationName, setLocationName] = useState<string>('Sector 14 Market, Gate 2 (Old Gurugram)');
  const [description, setDescription] = useState<string>(
    'Large garbage overflow near fruit market stalls. Stray animals gathering.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'report' | 'my-reports'>('report');

  // Trigger analysis when sample is selected or photo is uploaded
  const handleAnalyzePhoto = async (imgUrl: string) => {
    setImagePreview(imgUrl);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSubmittedReportId(null);

    const result = await analyzeWasteImage(imgUrl, locationName);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleAnalyzePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisResult) return;

    const newRep = addNewReport({
      title: `Waste Report: ${locationName}`,
      locationName,
      wardNumber: 14,
      zoneName: 'Zone 1 (Old Gurugram)',
      beforeImageUrl: imagePreview,
      description,
      wasteTypes: analysisResult.detectedCategories.map((c: any) => c.category),
      primaryWasteType: analysisResult.primaryType,
      severity: analysisResult.severity,
      riskScore: analysisResult.wasteRiskScore,
      riskBreakdown: analysisResult.riskBreakdown,
      riskReasons: analysisResult.riskReasons,
      estimatedVolumeKg: analysisResult.estimatedVolumeKg,
      confidenceScore: analysisResult.confidenceScore,
      recommendation: analysisResult.recommendation,
      reportedBy: {
        name: 'Citizen Reporter (Mobile)',
        role: 'Citizen',
      },
    });

    setSubmittedReportId(newRep.id);
  };

  const myReports = reports.filter((r) => r.reportedBy.role === 'Citizen');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sub navigation */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('report')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'report'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Report Urban Waste
          </button>
          <button
            onClick={() => setActiveSubTab('my-reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'my-reports'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            My Reports ({myReports.length})
          </button>
        </div>

        <span className="text-xs text-slate-500 font-mono hidden sm:inline px-3">
          Citizen Swachhata Grievance Portal
        </span>
      </div>

      {activeSubTab === 'report' ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {submittedReportId ? (
            /* Success confirmation card */
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Report Submitted &amp; AI Verified!
              </h2>

              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you for contributing to a cleaner city. Your report has been analyzed by
                NirmalAI's computer vision and dispatched to the Municipal Command Center.
              </p>

              <div className="bg-slate-50 rounded-2xl p-5 max-w-md mx-auto border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Report ID:</span>
                  <span className="font-mono font-bold text-slate-900">{submittedReportId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-semibold text-emerald-700">AI Verified &rarr; Pending Collection</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AI Confidence:</span>
                  <span className="font-mono font-bold text-slate-900">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated SLA:</span>
                  <span className="font-semibold text-rose-600">Within 4-6 hours</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmittedReportId(null);
                    setAnalysisResult(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  File Another Report
                </button>
                <button
                  onClick={() => setActiveSubTab('my-reports')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  Track My Reports
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Report Waste Incident
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Upload an image of garbage accumulation. NirmalAI will automatically categorize the waste, estimate volume, and calculate priority.
                </p>
              </div>

              {/* Photo Upload & Sample Picker */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>1. Photo of Garbage Accumulation</span>
                </label>

                {/* Quick preset demo samples */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Quick Demo Samples:</span>
                  <button
                    type="button"
                    onClick={() => handleAnalyzePhoto(SAMPLE_IMAGES.marketDumpBefore)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Market Garbage Dump
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnalyzePhoto(SAMPLE_IMAGES.streetPlasticBefore)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Street Plastic Dump
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnalyzePhoto(SAMPLE_IMAGES.drainChokedBefore)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Choked Open Drain
                  </button>
                </div>

                {/* Image Drop & Preview */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 aspect-16/9 max-h-72 flex items-center justify-center group">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Garbage preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-500">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <div className="text-xs font-medium">Upload or drag a photo here</div>
                      <div className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG up to 10MB</div>
                    </div>
                  )}

                  <label className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/75 hover:bg-black text-white text-xs font-semibold rounded-xl cursor-pointer backdrop-blur-xs flex items-center gap-1.5 shadow-md transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Automatic AI Waste Analysis Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                      NirmalAI Automated Waste Analysis
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAnalyzePhoto(imagePreview)}
                    disabled={isAnalyzing}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>Re-Run AI</span>
                  </button>
                </div>

                {isAnalyzing ? (
                  <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                    <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <div>Analyzing image pixels &amp; segmenting waste classes...</div>
                  </div>
                ) : analysisResult ? (
                  <div className="mt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Detected Severity</div>
                        <div className="font-bold text-rose-400 font-mono text-base mt-0.5">
                          {analysisResult.severity}
                        </div>
                      </div>
                      <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">AI Confidence</div>
                        <div className="font-bold text-emerald-400 font-mono text-base mt-0.5">
                          {Math.round(analysisResult.confidenceScore * 100)}%
                        </div>
                      </div>
                      <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Est. Volume</div>
                        <div className="font-bold text-white font-mono text-base mt-0.5">
                          ~{analysisResult.estimatedVolumeKg} kg
                        </div>
                      </div>
                      <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Risk Score</div>
                        <div className="font-bold text-amber-300 font-mono text-base mt-0.5">
                          {analysisResult.wasteRiskScore} / 100
                        </div>
                      </div>
                    </div>

                    {/* Detected categories */}
                    <div>
                      <div className="text-slate-400 text-[11px] mb-1.5 font-semibold">
                        Detected Waste Categories:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.detectedCategories.map((cat: any, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5"
                          >
                            <span>{cat.category || cat.name}</span>
                            <span className="font-mono text-emerald-400 text-[10px]">
                              {Math.round((cat.confidence || 0.9) * 100)}%
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 text-slate-300">
                      <span className="font-semibold text-emerald-400">AI Recommendation: </span>
                      {analysisResult.recommendation}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleAnalyzePhoto(imagePreview)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                    >
                      Click to Analyze Uploaded Image
                    </button>
                  </div>
                )}
              </div>

              {/* Location & Details Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Location / Landmark</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Sector 14 Market Gate 2, Gurugram"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Additional Observations (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Foul smell, blocking pedestrian pathway"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!analysisResult || isAnalyzing}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Verified Complaint to Municipal Corporation</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* My Reports Sub tab */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            My Submitted Civic Reports
          </h2>
          <div className="divide-y divide-slate-100">
            {myReports.map((r) => (
              <div key={r.id} className="py-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-800">
                      {r.id}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">
                    {r.locationName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {r.primaryWasteType} &bull; ~{r.estimatedVolumeKg} kg &bull; Reported {new Date(r.reportedAt).toLocaleDateString()}
                  </div>
                  {r.cleanupVerification?.verified && (
                    <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>AI Verified Cleanup Completed &bull; Pavement Swept Clean</span>
                    </div>
                  )}
                </div>

                <img
                  src={r.beforeImageUrl}
                  alt={r.title}
                  className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
