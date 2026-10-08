import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CityMap } from '../map/CityMap';
import { RiskBadge } from '../common/RiskBadge';
import {
  Navigation,
  Truck,
  Clock,
  Scale,
  MapPin,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Send,
  Flag,
} from 'lucide-react';

export const RoutesTab: React.FC = () => {
  const { vehicles, activeRoute, reoptimizeRoute, reports } = useApp();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('W-07');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  const selectedVehicle =
    vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      reoptimizeRoute(selectedVehicleId);
      setIsGenerating(false);
      setDispatchAlert(
        `Optimized Route generated for Vehicle ${selectedVehicleId}: 18.4 km, 6 stops, 52 min.`
      );
      setTimeout(() => setDispatchAlert(null), 4000);
    }, 700);
  };

  const handleDispatchToDriver = () => {
    setDispatchAlert(
      `Route dispatched to ${selectedVehicle.driverName}'s field tablet!`
    );
    setTimeout(() => setDispatchAlert(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Route Header & Vehicle Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Multi-Stop Vehicle Route Optimization</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Waste Collection Route Planner (TSP Engine)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dynamically sequences stops based on incident severity, risk scores, compactor payload capacity, and road turn constraints.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700">Vehicle:</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.id} &bull; {v.type} ({v.registrationNumber}) - Driver: {v.driverName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`}
              />
              <span>{isGenerating ? 'Optimizing...' : 'Re-Optimize Route'}</span>
            </button>
          </div>
        </div>

        {dispatchAlert && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{dispatchAlert}</span>
          </div>
        )}

        {/* Route Key Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-5 border-t border-slate-100 text-center">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">
              Optimized Distance
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-0.5">
              {activeRoute.totalDistanceKm} km
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">18.4% fuel saved</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">
              Estimated Trip Time
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-0.5">
              {activeRoute.estimatedTimeMin} min
            </div>
            <div className="text-[10px] text-slate-500">Including 8 min/stop loading</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">
              Stops In Sequence
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-0.5">
              {activeRoute.stops.length} Stops
            </div>
            <div className="text-[10px] text-slate-500">Depot &rarr; Incidents &rarr; Landfill</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">
              Collected Waste
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-0.5">
              {(activeRoute.totalWasteKg / 1000).toFixed(1)} tonnes
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Payload: {activeRoute.totalWasteKg} / {selectedVehicle.capacityKg} kg
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">
              Priority Score
            </div>
            <div className="text-2xl font-extrabold font-mono text-rose-600 mt-0.5">
              {activeRoute.priorityScore} / 100
            </div>
            <div className="text-[10px] text-rose-600 font-medium">CRITICAL SLA</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Stop Sequence & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Itinerary list */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Itinerary Sequence &amp; Arrival Timings
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              OPTIMIZED
            </span>
          </div>

          <div className="mt-4 space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {activeRoute.stops.map((stop, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === activeRoute.stops.length - 1;

              return (
                <div key={idx} className="relative flex items-start gap-3 text-xs">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-xs text-white shrink-0 z-10 border-2 border-white shadow-xs ${
                      isFirst
                        ? 'bg-slate-900'
                        : isLast
                        ? 'bg-teal-700'
                        : stop.severity === 'CRITICAL'
                        ? 'bg-rose-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {isFirst ? 'S' : isLast ? 'D' : stop.stopOrder}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {stop.locationName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 font-semibold">
                        +{stop.estimatedArrivalMin} min
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                      {stop.isDepot ? (
                        <span className="italic text-slate-500">
                          {isFirst ? 'Starting Sanitation Depot' : 'Disposal Processing Plant'}
                        </span>
                      ) : (
                        <>
                          <RiskBadge score={85} level={stop.severity} size="sm" showScore={false} />
                          <span>&bull;</span>
                          <span className="font-mono font-medium">
                            ~{stop.wasteVolumeKg} kg
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleDispatchToDriver}
            className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dispatch Route to {selectedVehicle.driverName}</span>
          </button>
        </div>

        {/* Right Column: Live Map view with route overlay (2 cols) */}
        <div className="lg:col-span-2">
          <CityMap heightClass="h-[560px]" showRoute={true} />
        </div>
      </div>
    </div>
  );
};
