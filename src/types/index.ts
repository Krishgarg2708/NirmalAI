export type WasteCategory =
  | 'Plastic'
  | 'Organic'
  | 'Paper & Cardboard'
  | 'Glass'
  | 'Metal'
  | 'E-waste'
  | 'Construction Debris'
  | 'Mixed Municipal'
  | 'Hazardous & Medical';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus =
  | 'AI Verified'
  | 'Pending'
  | 'Assigned'
  | 'In Progress'
  | 'Cleanup Submitted'
  | 'AI Verified Cleanup'
  | 'Resolved'
  | 'Rejected';

export interface RiskFactorBreakdown {
  historicalRecurrence: number; // 0-30
  recentFrequency: number; // 0-20
  severityWeight: number; // 0-20
  unresolvedDuration: number; // 0-15
  estimatedVolumeWeight: number; // 0-10
  locationSensitivity: number; // 0-5
}

export interface CleanupVerification {
  verified: boolean;
  confidenceScore: number;
  cleanupPercentage: number;
  checklist: {
    wasteReduced: boolean;
    areaAccessible: boolean;
    accumulationRemoved: boolean;
    sanitizedOrSwept: boolean;
  };
  explanation: string;
  verifiedAt: string;
}

export interface WasteReport {
  id: string; // e.g., 'NM-2026-10482'
  title: string;
  locationName: string;
  wardNumber: number;
  zoneName: string;
  lat: number;
  lng: number;
  wasteTypes: WasteCategory[];
  primaryWasteType: WasteCategory;
  severity: SeverityLevel;
  riskScore: number; // 0 - 100
  riskBreakdown: RiskFactorBreakdown;
  riskReasons: string[];
  estimatedVolumeKg: number;
  confidenceScore: number;
  status: IncidentStatus;
  reportedAt: string;
  reportedBy: {
    name: string;
    role: 'Citizen' | 'Sanitation Inspector' | 'IoT Bin Sensor' | 'Municipal Drone';
    phone?: string;
  };
  description?: string;
  beforeImageUrl: string;
  afterImageUrl?: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  assignedVehicleId?: string;
  assignedRouteId?: string;
  recommendation: string;
  cleanupVerification?: CleanupVerification;
  updatedAt: string;
}

export interface Hotspot {
  id: string;
  name: string;
  wardNumber: number;
  zoneName: string;
  lat: number;
  lng: number;
  currentScore: number;
  predicted48hRisk: number;
  historicalReportsCount: number;
  unresolvedIncidentsCount: number;
  accumulationTrend: 'RAPIDLY_INCREASING' | 'STABLE_HIGH' | 'DECLINING';
  riskLevel: SeverityLevel;
  reasons: string[];
  recommendedAction: string;
  collectionIntervalHours: number;
  lastCollectionHoursAgo: number;
  predictionWindowHours: number;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  zone: string;
  wardNumber: number;
  status: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE';
  currentTaskId?: string;
  completedTasksCount: number;
  rating: number;
  assignedVehicleId?: string;
  avatar: string;
}

export interface Vehicle {
  id: string; // e.g. 'W-07'
  registrationNumber: string;
  driverName: string;
  type: 'Compactor Truck 2.5T' | 'Tipper 1.2T' | 'E-Rickshaw Tipper 500kg';
  capacityKg: number;
  currentLoadKg: number;
  status: 'ACTIVE' | 'EN_ROUTE' | 'AT_DEPOT' | 'MAINTENANCE';
  lat: number;
  lng: number;
  fuelBatteryLevel: number;
}

export interface RouteStop {
  stopOrder: number;
  incidentId?: string;
  locationName: string;
  lat: number;
  lng: number;
  wasteVolumeKg: number;
  severity: SeverityLevel;
  isDepot?: boolean;
  estimatedArrivalMin: number;
}

export interface OptimizedRoute {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  driverName: string;
  depotName: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedTimeMin: number;
  totalWasteKg: number;
  priorityScore: number;
  status: 'PLANNED' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface AIInsight {
  id: string;
  category: 'HOTSPOT_ALERT' | 'EFFICIENCY' | 'PUBLIC_HEALTH' | 'ROUTE_SAVING';
  title: string;
  description: string;
  ward?: number;
  zone?: string;
  recommendation: string;
  impactMetric: string;
  timestamp: string;
}

export type UserRole = 'OPERATOR' | 'CITIZEN' | 'WORKER';
