import React from 'react';
import { IncidentStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  Truck,
  FileCheck2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: IncidentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let config = {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  };

  switch (status) {
    case 'AI Verified':
      config = {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: FileCheck2,
      };
      break;
    case 'Pending':
      config = {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Clock,
      };
      break;
    case 'Assigned':
      config = {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: UserCheck,
      };
      break;
    case 'In Progress':
      config = {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: Truck,
      };
      break;
    case 'Cleanup Submitted':
      config = {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: AlertTriangle,
      };
      break;
    case 'AI Verified Cleanup':
    case 'Resolved':
      config = {
        bg: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: CheckCircle2,
      };
      break;
    case 'Rejected':
      config = {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: XCircle,
      };
      break;
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{status}</span>
    </span>
  );
};
