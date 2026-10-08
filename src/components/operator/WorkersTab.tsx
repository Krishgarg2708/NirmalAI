import React from 'react';
import { useApp } from '../../context/AppContext';
import { HardHat, Truck, Star, Phone, CheckCircle2, BatteryCharging, ShieldCheck } from 'lucide-react';

export const WorkersTab: React.FC = () => {
  const { workers, vehicles, reports } = useApp();

  return (
    <div className="space-y-6">
      {/* Fleet Vehicles Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>Municipal Fleet Telemetry &amp; Payload Gauges</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live compactor and tipper vehicles tracked via GPS in Delhi NCR &amp; Gurugram
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {vehicles.filter((v) => v.status === 'ACTIVE' || v.status === 'EN_ROUTE').length} Active On Field
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {vehicles.map((veh) => {
            const loadPercent = Math.round((veh.currentLoadKg / veh.capacityKg) * 100);

            return (
              <div
                key={veh.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">
                        Vehicle {veh.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          veh.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : veh.status === 'EN_ROUTE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {veh.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {veh.registrationNumber} &bull; {veh.type}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono text-slate-600">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{veh.fuelBatteryLevel}%</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-700">
                  Driver: <strong>{veh.driverName}</strong>
                </div>

                {/* Payload Bar */}
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex justify-between text-xs text-slate-600 font-mono">
                    <span>Payload: {veh.currentLoadKg} kg</span>
                    <span>Cap: {veh.capacityKg} kg ({loadPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        loadPercent > 80
                          ? 'bg-rose-500'
                          : loadPercent > 50
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workers Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-amber-500" />
              <span>Sanitation Workforce (Swachhata Field Force)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Field sanitation officers, task assignments, and AI verified resolution rates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 flex items-start gap-3.5 hover:border-slate-300 transition-colors"
            >
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-300"
              />

              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm truncate">
                    {worker.name}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-600 font-semibold font-mono">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{worker.rating}</span>
                  </div>
                </div>

                <div className="text-slate-500 mt-0.5">
                  {worker.zone} (Ward {worker.wardNumber})
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      worker.status === 'ON_DUTY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {worker.status}
                  </span>

                  <span className="text-[10px] text-slate-500 font-mono">
                    Vehicle: {worker.assignedVehicleId || 'W-07'}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{worker.phone}</span>
                  </span>
                  <span className="font-semibold text-emerald-700">
                    {worker.completedTasksCount} cleanups
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
