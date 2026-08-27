import React from 'react';
import type { StationStatus } from '../../types';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface StatusPillProps {
  status: StationStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({ 
  status, 
  size = 'md',
  showPulse = true 
}) => {
  const getStatusConfig = (s: StationStatus) => {
    switch (s) {
      case 'NORMAL':
        return {
          label: 'NORMAL / TRUSTED',
          icon: CheckCircle2,
          bg: 'bg-emerald-950/60',
          border: 'border-emerald-500/50',
          text: 'text-emerald-400',
          dot: 'bg-emerald-400',
          pulse: 'bg-emerald-400/30'
        };
      case 'SUSPICIOUS':
        return {
          label: 'SUSPICIOUS',
          icon: AlertTriangle,
          bg: 'bg-amber-950/60',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
          dot: 'bg-amber-400',
          pulse: 'bg-amber-400/30'
        };
      case 'ANOMALY':
        return {
          label: 'CRITICAL ANOMALY',
          icon: AlertOctagon,
          bg: 'bg-red-950/70',
          border: 'border-red-500/60',
          text: 'text-red-400',
          dot: 'bg-red-400',
          pulse: 'bg-red-400/30'
        };
      default:
        return {
          label: 'UNKNOWN',
          icon: AlertTriangle,
          bg: 'bg-slate-900',
          border: 'border-slate-700',
          text: 'text-slate-400',
          dot: 'bg-slate-400',
          pulse: 'bg-slate-400/30'
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-2 font-medium',
    lg: 'px-3.5 py-1.5 text-sm gap-2.5 font-semibold'
  };

  return (
    <span className={`inline-flex items-center rounded-md border ${config.bg} ${config.border} ${config.text} ${sizeClasses[size]} tracking-wide`}>
      <span className="relative flex h-2 w-2 items-center justify-center">
        {showPulse && status !== 'NORMAL' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulse} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`} />
      </span>
      <IconComponent size={size === 'sm' ? 12 : 14} className="shrink-0" />
      <span className="font-mono uppercase font-bold text-[10px] tracking-wider">{config.label}</span>
    </span>
  );
};
