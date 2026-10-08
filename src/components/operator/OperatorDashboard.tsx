import React from 'react';
import { useApp } from '../../context/AppContext';
import { OverviewTab } from './OverviewTab';
import { IncidentsTab } from './IncidentsTab';
import { PredictionsTab } from './PredictionsTab';
import { RoutesTab } from './RoutesTab';
import { WorkersTab } from './WorkersTab';
import { AnalyticsTab } from './AnalyticsTab';
import { ImpactTab } from './ImpactTab';
import { CityMap } from '../map/CityMap';
import { IncidentDrawer } from '../common/IncidentDrawer';
import { HotspotModal } from '../common/HotspotModal';
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  Flame,
  Navigation,
  HardHat,
  BarChart3,
  Leaf,
} from 'lucide-react';

export const OperatorDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedIncident,
    setSelectedIncident,
    selectedHotspot,
    setSelectedHotspot,
    reports,
    hotspots,
  } = useApp();

  const TABS = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'map', label: 'Live City Map', icon: MapPin },
    {
      id: 'incidents',
      label: 'Incidents Registry',
      icon: ClipboardList,
      badge: reports.filter((r) => r.status !== 'Resolved').length,
    },
    {
      id: 'predictions',
      label: 'Predictive Hotspots',
      icon: Flame,
      highlight: true,
      badge: hotspots.filter((h) => h.riskLevel === 'CRITICAL').length,
    },
    { id: 'routes', label: 'Route Optimizer', icon: Navigation },
    { id: 'workers', label: 'Workers & Fleet', icon: HardHat },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'impact', label: 'Civic Impact', icon: Leaf },
  ];

  return (
    <div className="space-y-6">
      {/* Subnav Tab Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? t.highlight
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs'
                    : t.highlight
                    ? 'text-rose-700 hover:bg-rose-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-white' : t.highlight ? 'text-rose-600' : 'text-slate-500'
                  }`}
                />
                <span>{t.label}</span>
                {t.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : t.highlight
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Live Geospatial Municipal Waste Grid
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click pins to open incident diagnostic drawer or inspect recurring hotspot zones
              </p>
            </div>
          </div>
          <CityMap heightClass="h-[620px]" />
        </div>
      )}
      {activeTab === 'incidents' && <IncidentsTab />}
      {activeTab === 'predictions' && <PredictionsTab />}
      {activeTab === 'routes' && <RoutesTab />}
      {activeTab === 'workers' && <WorkersTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'impact' && <ImpactTab />}

      {/* Modals & Drawers */}
      {selectedIncident && (
        <IncidentDrawer
          report={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {selectedHotspot && (
        <HotspotModal
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
        />
      )}
    </div>
  );
};
