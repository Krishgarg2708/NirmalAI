import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteReport, IncidentStatus, SeverityLevel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const IncidentsTab: React.FC = () => {
  const { reports, setSelectedIncident, workers, assignWorker } = useApp();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | SeverityLevel>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');
  const [wardFilter, setWardFilter] = useState<string>('ALL');

  const filtered = reports.filter((r) => {
    if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (wardFilter !== 'ALL' && r.wardNumber.toString() !== wardFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.locationName.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.primaryWasteType.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Filter Bar */}
      <div className="p-5 border-b border-slate-200/90 bg-slate-50/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Municipal Incident Registry &amp; Response Console
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active garbage reports, AI risk audits, and field worker task dispatch
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, location, waste..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52 sm:w-64"
            />
          </div>

          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AI Verified">AI Verified</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Cleanup Submitted">Cleanup Submitted</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Ward */}
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Wards</option>
            <option value="14">Ward 14 (Old Gurugram)</option>
            <option value="12">Ward 12 (Sadar Bazaar)</option>
            <option value="21">Ward 21 (Cybercity/DLF)</option>
            <option value="8">Ward 8 (Chandni Chowk)</option>
            <option value="19">Ward 19 (Lajpat Nagar)</option>
            <option value="34">Ward 34 (Hauz Khas)</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Incident ID</th>
              <th className="py-3 px-4">Location &amp; Ward</th>
              <th className="py-3 px-4">Waste Type</th>
              <th className="py-3 px-4">Severity &amp; Risk Score</th>
              <th className="py-3 px-4">Reported</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Crew</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No incidents matching your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    <button
                      onClick={() => setSelectedIncident(report)}
                      className="hover:text-emerald-600 transition-colors"
                    >
                      {report.id}
                    </button>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      {report.locationName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Ward {report.wardNumber} &bull; {report.zoneName}
                    </div>
                  </td>

                  {/* Waste Type */}
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">
                      {report.primaryWasteType}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono">
                      ~{report.estimatedVolumeKg} kg
                    </div>
                  </td>

                  {/* Severity & Risk */}
                  <td className="py-3.5 px-4">
                    <RiskBadge score={report.riskScore} level={report.severity} size="sm" />
                  </td>

                  {/* Reported */}
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    <div>
                      {new Date(report.reportedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="text-slate-400">
                      {report.reportedBy.role}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={report.status} />
                  </td>

                  {/* Assigned Crew */}
                  <td className="py-3.5 px-4">
                    {report.assignedWorkerName ? (
                      <div>
                        <div className="font-semibold text-slate-800">
                          {report.assignedWorkerName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Vehicle {report.assignedVehicleId || 'W-07'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedIncident(report)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-medium text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing {filtered.length} of {reports.length} municipal incidents
        </div>
        <div className="font-mono text-[11px]">
          SLA Target: 4.0 hrs &bull; Real-time AI Priority Enabled
        </div>
      </div>
    </div>
  );
};
