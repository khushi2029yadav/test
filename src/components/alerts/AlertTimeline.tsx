import React from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import type { AnomalyAlert } from '../../types';
import { RootCauseBadge } from '../common/RootCauseBadge';
import { 
  AlertOctagon, 
  ArrowRight, 
  Clock 
} from 'lucide-react';

interface AlertTimelineProps {
  limit?: number;
  onAlertSelect?: (alertId: string) => void;
}

export const AlertTimeline: React.FC<AlertTimelineProps> = ({ 
  limit = 5,
  onAlertSelect 
}) => {
  const { 
    alerts, 
    selectedAlertId, 
    setSelectedAlertId, 
    setCurrentPage, 
    setSelectedStationId,
    resolveAlert 
  } = useSkyGuard();

  const displayedAlerts = alerts.slice(0, limit);

  const handleAlertClick = (alert: AnomalyAlert) => {
    setSelectedStationId(alert.stationId);
    setSelectedAlertId(alert.id);
    setCurrentPage('alert-detail');
    if (onAlertSelect) onAlertSelect(alert.id);
  };

  return (
    <div className="rounded-2xl border border-[#294155] bg-[#0B1B2B] p-5 shadow-2xl space-y-4 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#294155]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-950/80 border border-red-500/50 text-red-400">
            <AlertOctagon size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Real-Time Anomaly & QC Event Feed
            </h3>
            <p className="text-xs text-[#9FB0BF]">
              Chronological detection stream with multi-pillar fusion classifications
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('alerts')}
          className="flex items-center gap-1 text-xs font-mono text-[#38BDF8] hover:text-white font-bold transition-colors"
        >
          <span>View All Alerts ({alerts.length})</span>
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-3">
        {displayedAlerts.map(alert => {
          const isSelected = alert.id === selectedAlertId;
          const isCritical = alert.severity === 'CRITICAL';
          const isResolved = alert.status === 'RESOLVED';

          return (
            <div
              key={alert.id}
              onClick={() => handleAlertClick(alert)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#38BDF8] bg-[#102536] shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]'
                  : isCritical && !isResolved
                  ? 'border-red-500/50 bg-[#07111F] hover:border-red-500/80 hover:bg-red-950/20'
                  : 'border-[#294155] bg-[#07111F] hover:border-[#38BDF8]/50 hover:bg-[#102536]/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#F8FAFC]">
                    {alert.stationId} • {alert.stationName}
                  </span>
                  <RootCauseBadge rootCause={alert.rootCause} size="sm" />
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-[#9FB0BF]">
                  <Clock size={11} />
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-[#9FB0BF] font-sans line-clamp-2 leading-relaxed mb-3">
                {alert.humanReadableExplanation}
              </p>

              <div className="pt-2 border-t border-[#142C40] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-[#9FB0BF]">
                    Raw: <strong className={isCritical ? 'text-red-400' : 'text-amber-400'}>{alert.rawValue} {alert.unit}</strong>
                  </span>
                  <span className="text-[#9FB0BF]">
                    Expected: <strong className="text-emerald-400">{alert.expectedValue} {alert.unit}</strong>
                  </span>
                  <span className="text-[#9FB0BF]">
                    Confidence: <strong className="text-[#38BDF8]">{(alert.confidence * 100).toFixed(1)}%</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  {isResolved ? (
                    <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40">
                      RESOLVED
                    </span>
                  ) : (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-400 hover:bg-emerald-950/60 border border-emerald-500/40 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => handleAlertClick(alert)}
                    className="flex items-center gap-1 text-xs font-mono font-bold text-[#38BDF8] hover:text-white"
                  >
                    <span>Investigate</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
