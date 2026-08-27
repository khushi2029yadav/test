import React from 'react';
import type { RootCauseType } from '../../types';
import { 
  Zap, 
  Snowflake, 
  TrendingUp, 
  Scale, 
  Activity, 
  WifiOff, 
  SunMedium, 
  Wrench 
} from 'lucide-react';

interface RootCauseBadgeProps {
  rootCause: RootCauseType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RootCauseBadge: React.FC<RootCauseBadgeProps> = ({ 
  rootCause, 
  size = 'md', 
  showIcon = true 
}) => {
  const getBadgeConfig = (type: RootCauseType) => {
    switch (type) {
      case 'SPIKE':
        return {
          label: 'Spike Anomaly',
          icon: Zap,
          bg: 'bg-red-950/70',
          border: 'border-red-500/60',
          text: 'text-red-400',
          glow: 'shadow-red-900/30'
        };
      case 'FREEZE':
        return {
          label: 'Data Freeze / Stuck',
          icon: Snowflake,
          bg: 'bg-cyan-950/70',
          border: 'border-cyan-500/60',
          text: 'text-cyan-400',
          glow: 'shadow-cyan-900/30'
        };
      case 'DRIFT':
        return {
          label: 'Sensor Baseline Drift',
          icon: TrendingUp,
          bg: 'bg-amber-950/70',
          border: 'border-amber-500/60',
          text: 'text-amber-400',
          glow: 'shadow-amber-900/30'
        };
      case 'BIAS':
        return {
          label: 'Systematic Bias Offset',
          icon: Scale,
          bg: 'bg-orange-950/70',
          border: 'border-orange-500/60',
          text: 'text-orange-400',
          glow: 'shadow-orange-900/30'
        };
      case 'NOISE':
        return {
          label: 'High Variance Noise',
          icon: Activity,
          bg: 'bg-purple-950/70',
          border: 'border-purple-500/60',
          text: 'text-purple-400',
          glow: 'shadow-purple-900/30'
        };
      case 'DROPOUT':
        return {
          label: 'Packet / Data Dropout',
          icon: WifiOff,
          bg: 'bg-rose-950/70',
          border: 'border-rose-500/60',
          text: 'text-rose-400',
          glow: 'shadow-rose-900/30'
        };
      case 'GENUINE_WEATHER':
        return {
          label: 'Likely Genuine Weather',
          icon: SunMedium,
          bg: 'bg-emerald-950/70',
          border: 'border-emerald-500/60',
          text: 'text-emerald-400',
          glow: 'shadow-emerald-900/30'
        };
      case 'CALIBRATION':
        return {
          label: 'Calibration Drift',
          icon: Wrench,
          bg: 'bg-indigo-950/70',
          border: 'border-indigo-500/60',
          text: 'text-indigo-400',
          glow: 'shadow-indigo-900/30'
        };
      default:
        return {
          label: 'Unknown Fault',
          icon: Activity,
          bg: 'bg-slate-900',
          border: 'border-slate-700',
          text: 'text-slate-300',
          glow: 'shadow-none'
        };
    }
  };

  const config = getBadgeConfig(rootCause);
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-semibold'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span 
      className={`inline-flex items-center rounded-lg border shadow-sm ${config.bg} ${config.border} ${config.text} ${sizeClasses[size]} ${config.glow} tracking-wide`}
    >
      {showIcon && <IconComponent size={iconSizes[size]} className="shrink-0 animate-pulse" />}
      <span>{config.label}</span>
    </span>
  );
};
