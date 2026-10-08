import { WasteReport, Vehicle, OptimizedRoute, RouteStop } from '../types';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function generateOptimizedRoute(
  selectedIncidents: WasteReport[],
  vehicle: Vehicle,
  depot = {
    name: 'Sector 10 Municipal Sanitation Depot',
    lat: 28.455,
    lng: 77.022,
  },
  landfill = {
    name: 'Bandhwari Solid Waste Processing Plant',
    lat: 28.384,
    lng: 77.162,
  }
): OptimizedRoute {
  // Sort incidents by Priority (Critical first, then High, then closest to depot)
  const sorted = [...selectedIncidents].sort((a, b) => {
    // Score based on riskScore + proximity
    return b.riskScore - a.riskScore;
  });

  const stops: RouteStop[] = [];

  // Stop 1: Start Depot
  stops.push({
    stopOrder: 1,
    locationName: `${depot.name} (Start Depot)`,
    lat: depot.lat,
    lng: depot.lng,
    wasteVolumeKg: 0,
    severity: 'LOW',
    isDepot: true,
    estimatedArrivalMin: 0,
  });

  let currentLat = depot.lat;
  let currentLng = depot.lng;
  let accumulatedKm = 0;
  let accumulatedMin = 0;
  let totalWasteKg = 0;

  // Add incident stops
  sorted.forEach((inc, idx) => {
    const dist = calculateDistanceKm(currentLat, currentLng, inc.lat, inc.lng);
    accumulatedKm += Math.max(1.5, dist * 1.3); // Road factor 1.3
    accumulatedMin += Math.round(dist * 2.4) + 8; // Travel time + 8 min loading
    totalWasteKg += inc.estimatedVolumeKg;

    stops.push({
      stopOrder: idx + 2,
      incidentId: inc.id,
      locationName: inc.locationName,
      lat: inc.lat,
      lng: inc.lng,
      wasteVolumeKg: inc.estimatedVolumeKg,
      severity: inc.severity,
      estimatedArrivalMin: accumulatedMin,
    });

    currentLat = inc.lat;
    currentLng = inc.lng;
  });

  // Final Stop: Landfill / Transfer Station
  const finalDist = calculateDistanceKm(
    currentLat,
    currentLng,
    landfill.lat,
    landfill.lng
  );
  accumulatedKm += Math.max(3, finalDist * 1.25);
  accumulatedMin += Math.round(finalDist * 2.2) + 12;

  stops.push({
    stopOrder: stops.length + 1,
    locationName: `${landfill.name} (Disposal Destination)`,
    lat: landfill.lat,
    lng: landfill.lng,
    wasteVolumeKg: 0,
    severity: 'LOW',
    isDepot: true,
    estimatedArrivalMin: accumulatedMin,
  });

  const avgPriority =
    sorted.length > 0
      ? Math.round(
          sorted.reduce((acc, curr) => acc + curr.riskScore, 0) / sorted.length
        )
      : 80;

  return {
    id: `RT-OPT-${vehicle.id}-${Date.now().toString().slice(-4)}`,
    vehicleId: vehicle.id,
    vehicleReg: vehicle.registrationNumber,
    driverName: vehicle.driverName,
    depotName: depot.name,
    stops,
    totalDistanceKm: Math.round(accumulatedKm * 10) / 10,
    estimatedTimeMin: accumulatedMin,
    totalWasteKg,
    priorityScore: avgPriority,
    status: 'PLANNED',
  };
}
