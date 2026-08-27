import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  variant?: 'cyan' | 'green' | 'amber' | 'red' | 'purple' | 'default';
  glow?: boolean;
  onClick?: () => void;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  glow = false,
  onClick,
  badge
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return {
          iconColor: 'text-[#38BDF8]',
          iconBg: 'bg-[#38BDF8]/10 border-[#38BDF8]/30',
          valueColor: 'text-[#38BDF8]',
          glowClass: glow ? 'shadow-[0_0_25px_-5px_rgba(56,189,248,0.3)]' : ''
        };
      case 'green':
        return {
          iconColor: 'text-[#22C55E]',
          iconBg: 'bg-[#22C55E]/10 border-[#22C55E]/30',
          valueColor: 'text-[#22C55E]',
          glowClass: glow ? 'shadow-[0_0_25px_-5px_rgba(34,197,94,0.3)]' : ''
        };
      case 'amber':
        return {
          iconColor: 'text-[#F59E0B]',
          iconBg: 'bg-[#F59E0B]/10 border-[#F59E0B]/30',
          valueColor: 'text-[#F59E0B]',
          glowClass: glow ? 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)]' : ''
        };
      case 'red':
        return {
          iconColor: 'text-[#EF4444]',
          iconBg: 'bg-[#EF4444]/10 border-[#EF4444]/30',
          valueColor: 'text-[#EF4444]',
          glowClass: glow ? 'shadow-[0_0_25px_-5px_rgba(239,68,68,0.35)]' : ''
        };
      case 'purple':
        return {
          iconColor: 'text-[#A78BFA]',
          iconBg: 'bg-[#A78BFA]/10 border-[#A78BFA]/30',
          valueColor: 'text-[#A78BFA]',
          glowClass: glow ? 'shadow-[0_0_25px_-5px_rgba(167,139,250,0.3)]' : ''
        };
      default:
        return {
          iconColor: 'text-[#9FB0BF]',
          iconBg: 'bg-[#142C40] border-[#294155]',
          valueColor: 'text-[#F8FAFC]',
          glowClass: ''
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border border-[#294155] bg-[#0B1B2B]/90 p-4 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#38BDF8]/60 hover:bg-[#102536]' : ''
      } ${styles.glowClass}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9FB0BF]">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142C40] text-[#38BDF8] border border-[#294155]">
              {badge}
            </span>
          )}
          <div className={`p-2 rounded-lg border ${styles.iconBg} ${styles.iconColor}`}>
            <Icon size={18} />
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className={`text-2xl lg:text-3xl font-bold font-mono tracking-tight ${styles.valueColor}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-[#9FB0BF] font-mono">
            {unit}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#142C40] text-xs">
        {subtitle && (
          <span className="text-[#9FB0BF] truncate max-w-[140px]">{subtitle}</span>
        )}
        {trend && (
          <div className="flex items-center gap-1 ml-auto font-mono text-[11px]">
            {trend.direction === 'up' && <TrendingUp size={12} className="text-[#22C55E]" />}
            {trend.direction === 'down' && <TrendingDown size={12} className="text-[#EF4444]" />}
            {trend.direction === 'neutral' && <Minus size={12} className="text-[#9FB0BF]" />}
            <span
              className={
                trend.direction === 'up'
                  ? 'text-[#22C55E]'
                  : trend.direction === 'down'
                  ? 'text-[#EF4444]'
                  : 'text-[#9FB0BF]'
              }
            >
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
