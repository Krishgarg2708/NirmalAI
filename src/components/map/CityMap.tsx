import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { WasteReport, Hotspot, Vehicle, SeverityLevel } from '../../types';
import {
  Layers,
  Truck,
  Flame,
  Filter,
  Maximize2,
  Navigation,
  Compass,
} from 'lucide-react';

interface CityMapProps {
  heightClass?: string;
  onSelectIncident?: (report: WasteReport) => void;
  onSelectHotspot?: (hotspot: Hotspot) => void;
  showRoute?: boolean;
}

export const CityMap: React.FC<CityMapProps> = ({
  heightClass = 'h-[580px]',
  onSelectIncident,
  onSelectHotspot,
  showRoute = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  const {
    reports,
    hotspots,
    vehicles,
    activeRoute,
    setSelectedIncident,
    setSelectedHotspot,
  } = useApp();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | SeverityLevel>('ALL');
  const [showHotspotsLayer, setShowHotspotsLayer] = useState<boolean>(true);
  const [showVehiclesLayer, setShowVehiclesLayer] = useState<boolean>(true);
  const [showRouteLayer, setShowRouteLayer] = useState<boolean>(showRoute);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Gurugram / Delhi corridor
    const map = L.map(mapContainerRef.current, {
      center: [28.472, 77.04],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | NirmalAI Municipal Platform',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers and Overlays
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !routeLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    routeLayerRef.current.clearLayers();

    // 1. Render Incidents
    reports.forEach((rep) => {
      if (severityFilter !== 'ALL' && rep.severity !== severityFilter) return;

      const color =
        rep.severity === 'CRITICAL'
          ? '#e11d48'
          : rep.severity === 'HIGH'
          ? '#f59e0b'
          : rep.severity === 'MEDIUM'
          ? '#3b82f6'
          : '#10b981';

      const isResolved = rep.status === 'Resolved';
      const markerHtml = `
        <div class="relative group cursor-pointer">
          <div style="background-color: ${isResolved ? '#059669' : color};" 
               class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
            ${isResolved ? '✓' : rep.riskScore}
          </div>
          ${
            rep.severity === 'CRITICAL' && !isResolved
              ? `<div style="border-color: ${color};" class="absolute -inset-1.5 rounded-full border-2 animate-ping opacity-60 pointer-events-none"></div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: markerHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([rep.lat, rep.lng], { icon: customIcon });

      const popupContent = `
        <div class="p-1 font-sans">
          <div class="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">${rep.id}</div>
          <div class="font-bold text-xs text-slate-900 mt-0.5">${rep.locationName}</div>
          <div class="mt-1 flex items-center gap-1.5">
            <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold text-white" style="background-color: ${color}">
              ${rep.severity}
            </span>
            <span class="text-[10px] text-slate-600 font-mono">Risk: ${rep.riskScore}/100</span>
          </div>
          <div class="text-[11px] text-slate-600 mt-1 line-clamp-2">${rep.title}</div>
          <div class="mt-2 text-[10px] text-emerald-700 font-medium cursor-pointer">👉 Click to inspect incident in detail</div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedIncident(rep);
        if (onSelectIncident) onSelectIncident(rep);
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // 2. Render Hotspots (Pulse Circles & Hotspot Icons)
    if (showHotspotsLayer) {
      hotspots.forEach((hs) => {
        const circle = L.circle([hs.lat, hs.lng], {
          color: hs.riskLevel === 'CRITICAL' ? '#e11d48' : '#f59e0b',
          fillColor: hs.riskLevel === 'CRITICAL' ? '#fda4af' : '#fed7aa',
          fillOpacity: 0.25,
          radius: 350,
          weight: 1.5,
          dashArray: '4, 4',
        });

        const hsMarkerHtml = `
          <div class="cursor-pointer bg-white/95 text-slate-900 px-2 py-0.5 rounded-md border border-rose-300 shadow-md text-[10px] font-bold flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>HOTSPOT: ${hs.currentScore}</span>
          </div>
        `;

        const hsIcon = L.divIcon({
          className: 'hotspot-pin',
          html: hsMarkerHtml,
          iconSize: [95, 20],
          iconAnchor: [47, 10],
        });

        const hsMarker = L.marker([hs.lat, hs.lng], { icon: hsIcon });
        hsMarker.on('click', () => {
          setSelectedHotspot(hs);
          if (onSelectHotspot) onSelectHotspot(hs);
        });

        markersLayerRef.current?.addLayer(circle);
        markersLayerRef.current?.addLayer(hsMarker);
      });
    }

    // 3. Render Vehicles
    if (showVehiclesLayer) {
      vehicles.forEach((veh) => {
        const vehicleHtml = `
          <div class="cursor-pointer bg-slate-900 text-white p-1 rounded-full shadow-xl border-2 border-emerald-400 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
        `;

        const vehIcon = L.divIcon({
          className: 'vehicle-pin',
          html: vehicleHtml,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const vMarker = L.marker([veh.lat, veh.lng], { icon: vehIcon });
        vMarker.bindPopup(`
          <div class="p-1 font-sans text-xs">
            <div class="font-bold text-slate-900">Vehicle ${veh.id}</div>
            <div class="text-slate-600 text-[10px]">${veh.type} (${veh.registrationNumber})</div>
            <div class="mt-1 text-slate-700">Driver: ${veh.driverName}</div>
            <div class="mt-0.5 text-emerald-600 font-semibold font-mono">Load: ${veh.currentLoadKg} / ${veh.capacityKg} kg</div>
          </div>
        `);

        markersLayerRef.current?.addLayer(vMarker);
      });
    }

    // 4. Render Route Polyline
    if (showRouteLayer && activeRoute && activeRoute.stops.length > 1) {
      const latlngs: [number, number][] = activeRoute.stops.map((s) => [s.lat, s.lng]);

      const polyline = L.polyline(latlngs, {
        color: '#059669',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 6',
      });

      routeLayerRef.current?.addLayer(polyline);

      // Add numbered stop markers
      activeRoute.stops.forEach((s) => {
        const stopHtml = `
          <div class="w-5 h-5 rounded-full ${
            s.isDepot ? 'bg-slate-900' : 'bg-emerald-600'
          } text-white text-[10px] font-bold flex items-center justify-center border border-white shadow-sm">
            ${s.stopOrder}
          </div>
        `;
        const stopIcon = L.divIcon({
          className: 'stop-pin',
          html: stopHtml,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const sm = L.marker([s.lat, s.lng], { icon: stopIcon });
        sm.bindPopup(`
          <div class="p-1 text-xs">
            <div class="font-bold">Stop ${s.stopOrder}: ${s.locationName}</div>
            <div class="text-[10px] text-slate-500">ETA: +${s.estimatedArrivalMin} min</div>
          </div>
        `);
        routeLayerRef.current?.addLayer(sm);
      });
    }
  }, [
    reports,
    hotspots,
    vehicles,
    activeRoute,
    severityFilter,
    showHotspotsLayer,
    showVehiclesLayer,
    showRouteLayer,
  ]);

  const fitBoundsToAll = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([28.472, 77.04], 13);
  };

  const centerOnDelhi = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([28.62, 77.22], 12);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Top Map Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Severity Filter Pills */}
        <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-200/90 shadow-md text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                severityFilter === sev
                  ? sev === 'CRITICAL'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : sev === 'HIGH'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : sev === 'MEDIUM'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Layer Toggles & View Selectors */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-200/90 shadow-md text-xs">
            <button
              onClick={() => setShowHotspotsLayer(!showHotspotsLayer)}
              className={`px-2 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                showHotspotsLayer
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Toggle Recurring Hotspots"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Hotspots</span>
            </button>

            <button
              onClick={() => setShowVehiclesLayer(!showVehiclesLayer)}
              className={`px-2 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                showVehiclesLayer
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Toggle Municipal Trucks"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fleet</span>
            </button>

            <button
              onClick={() => setShowRouteLayer(!showRouteLayer)}
              className={`px-2 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                showRouteLayer
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Toggle Optimized Route"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Route W-07</span>
            </button>
          </div>

          {/* Quick city jump */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-md">
            <button
              onClick={fitBoundsToAll}
              className="px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Center Gurugram"
            >
              Gurugram
            </button>
            <button
              onClick={centerOnDelhi}
              className="px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Center Central Delhi"
            >
              Delhi
            </button>
          </div>
        </div>
      </div>

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className={`w-full ${heightClass}`} />

      {/* Map Legend Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-700">Map Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>Critical (&gt;85 Risk)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>High (70-84)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Medium (50-69)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Resolved</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-dashed border-rose-500 bg-rose-200/60" />
            <span>Predictive Hotspot Zone</span>
          </span>
        </div>

        <div className="font-mono text-[11px] text-slate-500">
          Showing {reports.length} incidents &bull; 8 recurring hotspots &bull; 5 live vehicles
        </div>
      </div>
    </div>
  );
};
