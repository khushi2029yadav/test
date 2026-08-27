import React from 'react';
import { useSkyGuard } from '../context/SkyGuardContext';
import { EvidenceSummary } from '../components/evidence/EvidenceSummary';
import { CorrectionCard } from '../components/evidence/CorrectionCard';
import { TelemetryChart } from '../components/station/TelemetryChart';
import { RootCauseBadge } from '../components/common/RootCauseBadge';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

export const AlertDetailPage: React.FC = () => {
  const { 
    selectedAlert, 
    setCurrentPage, 
    resolveAlert,
    setIsAssistantDrawerOpen 
  } = useSkyGuard();

  if (!selectedAlert) {
    return (
      <div className="p-12 text-center text-xs font-mono text-[#9FB0BF]">
        No anomaly alert selected. Return to <button onClick={() => setCurrentPage('alerts')} className="text-[#38BDF8] underline">Alert Center</button>.
      </div>
    );
  }

  const isCritical = selectedAlert.severity === 'CRITICAL';
  const isGenuine = selectedAlert.rootCause === 'GENUINE_WEATHER';
  const isResolved = selectedAlert.status === 'RESOLVED';

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#294155]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('alerts')}
            className="p-2 rounded-xl bg-[#0B1B2B] hover:bg-[#142C40] border border-[#294155] text-[#9FB0BF] hover:text-white transition-colors"
            title="Back to Alerts"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-[#F8FAFC] font-mono tracking-tight">
                {selectedAlert.stationName}
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#102536] text-[#38BDF8] border border-[#294155]">
                {selectedAlert.id}
              </span>
              <RootCauseBadge rootCause={selectedAlert.rootCause} size="sm" />
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs font-mono text-[#9FB0BF]">
              <span>Parameter: <strong className="text-white">{selectedAlert.parameter}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                <span>Detected: {selectedAlert.timestamp}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isResolved ? (
            <button
              onClick={() => resolveAlert(selectedAlert.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold transition-all"
            >
              <CheckCircle2 size={13} />
              <span>Mark Alert Resolved</span>
            </button>
          ) : (
            <span className="px-3.5 py-2 rounded-xl bg-[#142C40] text-emerald-400 text-xs font-mono font-bold border border-emerald-500/40">
              ✓ RESOLVED
            </span>
          )}

          <button
            onClick={() => setIsAssistantDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#38BDF8]/20 to-[#A78BFA]/20 hover:from-[#38BDF8]/30 hover:to-[#A78BFA]/30 border border-[#A78BFA]/50 text-[#A78BFA] text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <Sparkles size={14} className="text-[#A78BFA]" />
            <span>Ask AI About This Anomaly</span>
          </button>
        </div>
      </div>

      {/* Human Readable Narrative Banner */}
      <div className={`p-5 rounded-2xl border ${
        isCritical && !isResolved ? 'bg-red-950/30 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' :
        isGenuine ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]' :
        'bg-[#0B1B2B] border-[#294155]'
      } space-y-2`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider font-mono text-[#38BDF8] flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Deterministic & AI Root Cause Diagnosis
          </span>
          <span className="text-xs font-mono text-[#9FB0BF]">
            Fusion Confidence: <strong className="text-white">{(selectedAlert.confidence * 100).toFixed(1)}%</strong>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed font-sans">
          {selectedAlert.humanReadableExplanation}
        </p>
      </div>

      {/* Interactive Telemetry Chart with Focused Anomaly Pin */}
      <TelemetryChart stationId={selectedAlert.stationId} height="360px" />

      {/* The 5-Pillar Evidence Breakdown */}
      <EvidenceSummary alert={selectedAlert} />

      {/* Advisory Correction Card (Raw Value Preserved) */}
      <CorrectionCard correction={selectedAlert.correction} alertId={selectedAlert.id} />
    </div>
  );
};
