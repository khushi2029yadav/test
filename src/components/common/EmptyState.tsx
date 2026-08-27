import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Database, Search, FilterX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'no-data' | 'no-filter' | 'no-neighbors';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: CustomIcon,
  actionLabel,
  onAction,
  variant = 'no-data'
}) => {
  const getDefaults = () => {
    switch (variant) {
      case 'no-filter':
        return {
          icon: FilterX,
          defaultTitle: 'No Matching Telemetry Found',
          defaultDesc: 'No stations or anomaly events match your current filter criteria. Try resetting filters.'
        };
      case 'no-neighbors':
        return {
          icon: Search,
          defaultTitle: 'Spatial Evidence Unavailable',
          defaultDesc: 'Spatial evidence = "Unavailable / Neutral". No adjacent AWS nodes found within 75 km search radius.'
        };
      case 'no-data':
      default:
        return {
          icon: Database,
          defaultTitle: 'No Observations Recorded',
          defaultDesc: 'Waiting for MQTT/LoRaWAN stream ingestion or select an active station to begin inspection.'
        };
    }
  };

  const defaults = getDefaults();
  const Icon = CustomIcon || defaults.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-[#294155] bg-[#0B1B2B]/60 my-4">
      <div className="p-3.5 rounded-full bg-[#102536] border border-[#294155] text-[#38BDF8] mb-3">
        <Icon size={24} />
      </div>
      <h4 className="text-sm font-semibold text-[#F8FAFC] tracking-wide mb-1 font-mono">
        {title || defaults.defaultTitle}
      </h4>
      <p className="text-xs text-[#9FB0BF] max-w-sm mb-4 leading-relaxed">
        {description || defaults.defaultDesc}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-3.5 py-1.5 rounded-lg bg-[#142C40] hover:bg-[#38BDF8]/20 border border-[#294155] hover:border-[#38BDF8] text-xs font-medium text-[#38BDF8] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
