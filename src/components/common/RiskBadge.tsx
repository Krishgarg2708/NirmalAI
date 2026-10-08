import React from 'react';
import { SeverityLevel } from '../../types';

interface RiskBadgeProps {
  score: number;
  level?: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  size = 'md',
  showScore = true,
}) => {
  const resolvedLevel =
    level || (score >= 85 ? 'CRITICAL' : score >= 70 ? 'HIGH' : score >= 50 ? 'MEDIUM' : 'LOW');

  let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
  let dotColor = 'bg-emerald-500';

  if (resolvedLevel === 'CRITICAL') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
    dotColor = 'bg-rose-500';
  } else if (resolvedLevel === 'HIGH') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
    dotColor = 'bg-amber-500';
  } else if (resolvedLevel === 'MEDIUM') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
    dotColor = 'bg-blue-500';
  }

  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2 py-0.5'
      : size === 'lg'
      ? 'text-sm px-3.5 py-1.5 font-semibold'
      : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ring-1 ${colorClasses} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${resolvedLevel === 'CRITICAL' ? 'animate-pulse' : ''}`} />
      <span>{resolvedLevel}</span>
      {showScore && (
        <span className="font-mono opacity-80 pl-0.5 font-semibold">
          {score}/100
        </span>
      )}
    </span>
  );
};
