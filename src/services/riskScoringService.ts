import { RiskFactorBreakdown, SeverityLevel, WasteCategory } from '../types';

export interface CalculatedRisk {
  totalScore: number; // 0 - 100
  riskLevel: SeverityLevel;
  breakdown: RiskFactorBreakdown;
  reasons: string[];
  recommendedResponseWindowHours: number;
}

export function calculateWasteRiskScore(params: {
  historicalReportsCount: number;
  recentReportFrequencyPerHour: number;
  severity: SeverityLevel;
  unresolvedHours: number;
  estimatedVolumeKg: number;
  isSensitiveLocation?: boolean; // school, hospital, major transit market
  wasteType: WasteCategory;
}): CalculatedRisk {
  const {
    historicalReportsCount,
    recentReportFrequencyPerHour,
    severity,
    unresolvedHours,
    estimatedVolumeKg,
    isSensitiveLocation = true,
    wasteType,
  } = params;

  // 1. Historical recurrence (Max 30 pts)
  // 0 reports -> 5 pts, 5 reports -> 15 pts, 12+ reports -> 30 pts
  const historicalRecurrence = Math.min(
    30,
    Math.round((Math.min(historicalReportsCount, 15) / 15) * 30)
  );

  // 2. Recent report frequency (Max 20 pts)
  // e.g., 3 reports/hr -> 20 pts
  const recentFrequency = Math.min(
    20,
    Math.round(Math.min(recentReportFrequencyPerHour, 3) * (20 / 3))
  );

  // 3. Severity Weight (Max 20 pts)
  let severityWeight = 10;
  if (severity === 'CRITICAL') severityWeight = 20;
  else if (severity === 'HIGH') severityWeight = 16;
  else if (severity === 'MEDIUM') severityWeight = 11;
  else severityWeight = 6;

  // 4. Unresolved duration (Max 15 pts)
  // >12 hrs -> 15 pts
  const unresolvedDuration = Math.min(
    15,
    Math.round((Math.min(unresolvedHours, 16) / 16) * 15)
  );

  // 5. Estimated volume weight (Max 10 pts)
  // >250 kg -> 10 pts
  const estimatedVolumeWeight = Math.min(
    10,
    Math.round((Math.min(estimatedVolumeKg, 250) / 250) * 10)
  );

  // 6. Location sensitivity (Max 5 pts)
  const locationSensitivity = isSensitiveLocation ? 5 : 2;

  const totalScore = Math.min(
    100,
    historicalRecurrence +
      recentFrequency +
      severityWeight +
      unresolvedDuration +
      estimatedVolumeWeight +
      locationSensitivity
  );

  let riskLevel: SeverityLevel = 'LOW';
  let recommendedResponseWindowHours = 24;

  if (totalScore >= 85) {
    riskLevel = 'CRITICAL';
    recommendedResponseWindowHours = 4;
  } else if (totalScore >= 70) {
    riskLevel = 'HIGH';
    recommendedResponseWindowHours = 8;
  } else if (totalScore >= 50) {
    riskLevel = 'MEDIUM';
    recommendedResponseWindowHours = 16;
  }

  // Explainability Reasons
  const reasons: string[] = [];

  if (historicalReportsCount >= 10) {
    reasons.push(
      `${historicalReportsCount} previous incidents recorded at this location in the last 30 days.`
    );
  }
  if (unresolvedHours >= 8) {
    reasons.push(
      `Waste has remained uncollected for ${unresolvedHours} hours, exceeding SLA threshold.`
    );
  }
  if (recentReportFrequencyPerHour >= 1.5) {
    reasons.push(
      `Multiple distinct citizen complaints filed in rapid succession (${recentReportFrequencyPerHour.toFixed(
        1
      )}/hr).`
    );
  }
  if (estimatedVolumeKg >= 150) {
    reasons.push(
      `High volume accumulation (~${estimatedVolumeKg} kg) threatens public right-of-way.`
    );
  }
  if (wasteType === 'Hazardous & Medical') {
    reasons.push(
      `Presence of hazardous bio-waste poses severe community contagion risk.`
    );
  } else if (wasteType === 'Plastic') {
    reasons.push(
      `High non-biodegradable plastic packaging density risks local drain choking.`
    );
  } else if (wasteType === 'Organic') {
    reasons.push(
      `Perishable wet waste under direct sunlight accelerates bacterial rot and stray animal nuisance.`
    );
  }

  if (reasons.length === 0) {
    reasons.push('Standard single-point municipal waste accumulation.');
  }

  return {
    totalScore,
    riskLevel,
    breakdown: {
      historicalRecurrence,
      recentFrequency,
      severityWeight,
      unresolvedDuration,
      estimatedVolumeWeight,
      locationSensitivity,
    },
    reasons,
    recommendedResponseWindowHours,
  };
}
