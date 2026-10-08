import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  WasteReport,
  Hotspot,
  Worker,
  Vehicle,
  OptimizedRoute,
  AIInsight,
  UserRole,
  SeverityLevel,
} from '../types';
import {
  INITIAL_REPORTS,
  INITIAL_HOTSPOTS,
  INITIAL_WORKERS,
  INITIAL_VEHICLES,
  INITIAL_OPTIMIZED_ROUTE,
  INITIAL_AI_INSIGHTS,
  SAMPLE_IMAGES,
} from '../data/mockData';
import { generateOptimizedRoute } from '../services/routeOptimizationService';
import { verifyCleanupProof } from '../services/cleanupVerificationService';

interface AppContextType {
  reports: WasteReport[];
  hotspots: Hotspot[];
  workers: Worker[];
  vehicles: Vehicle[];
  activeRoute: OptimizedRoute;
  insights: AIInsight[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedIncident: WasteReport | null;
  setSelectedIncident: (report: WasteReport | null) => void;
  selectedHotspot: Hotspot | null;
  setSelectedHotspot: (hotspot: Hotspot | null) => void;

  // Actions
  addNewReport: (report: Partial<WasteReport>) => WasteReport;
  assignWorker: (incidentId: string, workerId: string) => void;
  submitWorkerCleanupProof: (
    incidentId: string,
    afterImageUrl: string,
    forceFail?: boolean
  ) => Promise<{ success: boolean; verified: boolean; message: string }>;
  reoptimizeRoute: (vehicleId: string, incidentIds?: string[]) => void;
  updateIncidentStatus: (incidentId: string, status: WasteReport['status']) => void;

  // Guided Judge Tour
  judgeDemoStep: number | null;
  startJudgeDemo: () => void;
  goToJudgeStep: (step: number) => void;
  nextJudgeStep: () => void;
  prevJudgeStep: () => void;
  exitJudgeDemo: () => void;
  resetDemoData: () => void;

  // Computed metrics
  stats: {
    totalReports: number;
    activeIncidents: number;
    criticalHotspots: number;
    pendingCollections: number;
    avgResponseHours: number;
    cleanupVerificationRate: number;
    totalWasteCollectedKg: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<WasteReport[]>(() => {
    const saved = localStorage.getItem('nirmalai_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [hotspots, setHotspots] = useState<Hotspot[]>(() => {
    const saved = localStorage.getItem('nirmalai_hotspots');
    return saved ? JSON.parse(saved) : INITIAL_HOTSPOTS;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('nirmalai_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('nirmalai_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [activeRoute, setActiveRoute] = useState<OptimizedRoute>(() => {
    const saved = localStorage.getItem('nirmalai_route');
    return saved ? JSON.parse(saved) : INITIAL_OPTIMIZED_ROUTE;
  });

  const [insights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [currentRole, setCurrentRole] = useState<UserRole>('OPERATOR');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedIncident, setSelectedIncident] = useState<WasteReport | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [judgeDemoStep, setJudgeDemoStep] = useState<number | null>(null);

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('nirmalai_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('nirmalai_hotspots', JSON.stringify(hotspots));
  }, [hotspots]);

  useEffect(() => {
    localStorage.setItem('nirmalai_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('nirmalai_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('nirmalai_route', JSON.stringify(activeRoute));
  }, [activeRoute]);

  // Compute live dashboard stats
  const activeIncidents = reports.filter(
    (r) => r.status !== 'Resolved' && r.status !== 'Rejected'
  ).length;

  const pendingCollections = reports.filter(
    (r) => r.status === 'AI Verified' || r.status === 'Pending' || r.status === 'Assigned'
  ).length;

  const criticalHotspots = hotspots.filter(
    (h) => h.riskLevel === 'CRITICAL' || h.currentScore >= 85
  ).length;

  const verifiedCleanups = reports.filter(
    (r) => r.status === 'Resolved' || r.status === 'AI Verified Cleanup'
  ).length;

  const totalCompletedEvaluations = reports.filter(
    (r) => r.status === 'Resolved' || r.status === 'Rejected' || r.status === 'AI Verified Cleanup'
  ).length;

  const cleanupVerificationRate =
    totalCompletedEvaluations > 0
      ? Math.round((verifiedCleanups / totalCompletedEvaluations) * 1000) / 10
      : 93.6;

  const stats = {
    totalReports: 1284 + reports.length - INITIAL_REPORTS.length,
    activeIncidents,
    criticalHotspots,
    pendingCollections,
    avgResponseHours: 4.2,
    cleanupVerificationRate,
    totalWasteCollectedKg: reports.reduce(
      (acc, curr) => (curr.status === 'Resolved' ? acc + curr.estimatedVolumeKg : acc),
      12800
    ),
  };

  const addNewReport = (data: Partial<WasteReport>): WasteReport => {
    const newId = `NM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReport: WasteReport = {
      id: newId,
      title: data.title || `Waste Report at ${data.locationName || 'Urban Ward'}`,
      locationName: data.locationName || 'Sector 14 Ward Corridor',
      wardNumber: data.wardNumber || 14,
      zoneName: data.zoneName || 'Zone 1 (Old Gurugram)',
      lat: data.lat || 28.472 + (Math.random() - 0.5) * 0.02,
      lng: data.lng || 77.042 + (Math.random() - 0.5) * 0.02,
      wasteTypes: data.wasteTypes || ['Mixed Municipal', 'Plastic'],
      primaryWasteType: data.primaryWasteType || 'Mixed Municipal',
      severity: data.severity || 'HIGH',
      riskScore: data.riskScore || 82,
      riskBreakdown: data.riskBreakdown || {
        historicalRecurrence: 25,
        recentFrequency: 17,
        severityWeight: 18,
        unresolvedDuration: 12,
        estimatedVolumeWeight: 8,
        locationSensitivity: 5,
      },
      riskReasons: data.riskReasons || [
        'AI detected high density mixed packaging',
        'Citizen report validated with high confidence score',
      ],
      estimatedVolumeKg: data.estimatedVolumeKg || 120,
      confidenceScore: data.confidenceScore || 0.94,
      status: 'AI Verified',
      reportedAt: new Date().toISOString(),
      reportedBy: data.reportedBy || {
        name: 'Citizen Reporter',
        role: 'Citizen',
      },
      description: data.description || 'Public waste report submitted via NirmalAI Mobile.',
      beforeImageUrl: data.beforeImageUrl || SAMPLE_IMAGES.streetPlasticBefore,
      recommendation:
        data.recommendation ||
        'Immediate collection recommended within 6 hours to prevent drain choking.',
      updatedAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const assignWorker = (incidentId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === incidentId
          ? {
              ...r,
              status: 'Assigned',
              assignedWorkerId: worker.id,
              assignedWorkerName: worker.name,
              assignedVehicleId: worker.assignedVehicleId || 'W-07',
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? { ...w, status: 'ON_DUTY', currentTaskId: incidentId }
          : w
      )
    );
  };

  const updateIncidentStatus = (
    incidentId: string,
    status: WasteReport['status']
  ) => {
    setReports((prev) =>
      prev.map((r) => (r.id === incidentId ? { ...r, status, updatedAt: new Date().toISOString() } : r))
    );
  };

  const submitWorkerCleanupProof = async (
    incidentId: string,
    afterImageUrl: string,
    forceFail = false
  ): Promise<{ success: boolean; verified: boolean; message: string }> => {
    const incident = reports.find((r) => r.id === incidentId);
    if (!incident) {
      return { success: false, verified: false, message: 'Incident not found' };
    }

    // Call AI verification service
    const verification = await verifyCleanupProof(
      incident.beforeImageUrl,
      afterImageUrl,
      incidentId,
      forceFail
    );

    if (verification.verified) {
      setReports((prev) =>
        prev.map((r) =>
          r.id === incidentId
            ? {
                ...r,
                status: 'Resolved',
                afterImageUrl,
                cleanupVerification: {
                  ...verification,
                  verifiedAt: new Date().toISOString(),
                },
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#34d399', '#3b82f6'],
        });
      } catch (e) {
        // Safe in non-canvas environments
      }

      return {
        success: true,
        verified: true,
        message: 'AI Verified: Cleanup confirmed. Incident successfully closed.',
      };
    } else {
      setReports((prev) =>
        prev.map((r) =>
          r.id === incidentId
            ? {
                ...r,
                status: 'Rejected',
                afterImageUrl,
                cleanupVerification: {
                  ...verification,
                  verifiedAt: new Date().toISOString(),
                },
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );

      return {
        success: false,
        verified: false,
        message: verification.explanation,
      };
    }
  };

  const reoptimizeRoute = (vehicleId: string, incidentIds?: string[]) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId) || vehicles[0];
    const targetIncidents = incidentIds
      ? reports.filter((r) => incidentIds.includes(r.id))
      : reports.filter((r) => r.status === 'Assigned' || r.status === 'AI Verified').slice(0, 5);

    const newRoute = generateOptimizedRoute(targetIncidents, vehicle);
    setActiveRoute(newRoute);
  };

  // 8-step Judge Tour
  const startJudgeDemo = () => {
    setJudgeDemoStep(1);
    setCurrentRole('OPERATOR');
    setActiveTab('overview');
    setSelectedIncident(null);
    setSelectedHotspot(null);
  };

  const goToJudgeStep = (step: number) => {
    setJudgeDemoStep(step);
    if (step === 1) {
      setCurrentRole('OPERATOR');
      setActiveTab('overview');
    } else if (step === 2) {
      setCurrentRole('OPERATOR');
      setActiveTab('map');
    } else if (step === 3) {
      setCurrentRole('OPERATOR');
      setActiveTab('predictions');
      const targetHotspot = hotspots.find((h) => h.id === 'HS-101') || hotspots[0];
      setSelectedHotspot(targetHotspot);
    } else if (step === 4) {
      setCurrentRole('OPERATOR');
      setActiveTab('incidents');
    } else if (step === 5) {
      setCurrentRole('OPERATOR');
      setActiveTab('routes');
    } else if (step === 6) {
      setCurrentRole('WORKER');
      setActiveTab('tasks');
    } else if (step === 7) {
      setCurrentRole('WORKER');
      setActiveTab('verify');
      const target = reports.find((r) => r.id === 'NM-2026-10482') || reports[0];
      setSelectedIncident(target);
    } else if (step === 8) {
      setCurrentRole('OPERATOR');
      setActiveTab('overview');
    }
  };

  const nextJudgeStep = () => {
    if (judgeDemoStep === null) {
      startJudgeDemo();
    } else if (judgeDemoStep < 8) {
      goToJudgeStep(judgeDemoStep + 1);
    } else {
      exitJudgeDemo();
    }
  };

  const prevJudgeStep = () => {
    if (judgeDemoStep !== null && judgeDemoStep > 1) {
      goToJudgeStep(judgeDemoStep - 1);
    }
  };

  const exitJudgeDemo = () => {
    setJudgeDemoStep(null);
  };

  const resetDemoData = () => {
    localStorage.removeItem('nirmalai_reports');
    localStorage.removeItem('nirmalai_hotspots');
    localStorage.removeItem('nirmalai_workers');
    localStorage.removeItem('nirmalai_vehicles');
    localStorage.removeItem('nirmalai_route');
    setReports(INITIAL_REPORTS);
    setHotspots(INITIAL_HOTSPOTS);
    setWorkers(INITIAL_WORKERS);
    setVehicles(INITIAL_VEHICLES);
    setActiveRoute(INITIAL_OPTIMIZED_ROUTE);
    setSelectedIncident(null);
    setSelectedHotspot(null);
    setJudgeDemoStep(null);
    setCurrentRole('OPERATOR');
    setActiveTab('overview');
  };

  return (
    <AppContext.Provider
      value={{
        reports,
        hotspots,
        workers,
        vehicles,
        activeRoute,
        insights,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        selectedIncident,
        setSelectedIncident,
        selectedHotspot,
        setSelectedHotspot,
        addNewReport,
        assignWorker,
        submitWorkerCleanupProof,
        reoptimizeRoute,
        updateIncidentStatus,
        judgeDemoStep,
        startJudgeDemo,
        goToJudgeStep,
        nextJudgeStep,
        prevJudgeStep,
        exitJudgeDemo,
        resetDemoData,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
