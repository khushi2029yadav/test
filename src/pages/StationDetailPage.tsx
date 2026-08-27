import React from 'react';
import { useSkyGuard } from '../context/SkyGuardContext';
import { StatusPill } from '../components/common/StatusPill';
import { CurrentReadings } from '../components/station/CurrentReadings';
import { TelemetryChart } from '../components/station/TelemetryChart';
import { EvidenceSummary } from '../components/evidence/EvidenceSummary';
import { CorrectionCard } from '../components/evidence/CorrectionCard';
import { 
  MapPin, 
  ArrowLeft, 
  Sparkles, 
  AlertOctagon, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export const StationDetailPage: React.FC = () => {
  const { 
    selectedStation, 
    setCurrentPage, 
    alerts, 
    injectFault,
    setIsAssistantDrawerOpen 
  } = useSkyGuard();

  const stationAlerts = alerts.filter(a => a.stationId === selectedStation.id);
  const primaryAlert = stationAlerts[0];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Back Button & Top Identity Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#294155]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('stations')}
            className="p-2 rounded-xl bg-[#0B1B2B] hover:bg-[#142C40] border border-[#294155] text-[#9FB0BF] hover:text-white transition-colors"
            title="Back to Station Registry"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-[#F8FAFC] font-mono tracking-tight">
                {selectedStation.name}
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#102536] text-[#38BDF8] border border-[#294155]">
                {selectedStation.id} ({selectedStation.code})
              </span>
              <StatusPill status={selectedStation.status} size="sm" />
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs font-mono text-[#9FB0BF]">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-[#38BDF8]" />
                <span>{selectedStation.region}</span>
              </span>
              <span>•</span>
              <span>Elev: <strong className="text-white">{selectedStation.elevationM}m</strong></span>
              <span>•</span>
              <span>Lat: <strong className="text-white">{selectedStation.lat.toFixed(4)}°N</strong>, Lng: <strong className="text-white">{selectedStation.lng.toFixed(4)}°E</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Station Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              injectFault({
                stationId: selectedStation.id,
                parameter: 'TEMPERATURE',
                faultType: 'SPIKE',
                severityPercent: 95,
                durationSeconds: 300,
                customValue: 55.2
              });
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/50 text-red-300 text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <Zap size={14} className="text-red-400" />
            <span>Inject Spike (+26.8°C)</span>
          </button>

          <button
            onClick={() => setIsAssistantDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#38BDF8]/20 to-[#A78BFA]/20 hover:from-[#38BDF8]/30 hover:to-[#A78BFA]/30 border border-[#A78BFA]/50 text-[#A78BFA] text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <Sparkles size={14} className="text-[#A78BFA]" />
            <span>Ask AI About {selectedStation.id}</span>
          </button>
        </div>
      </div>

      {/* Hardware Health & Telemetry Readings */}
      <CurrentReadings 
        station={selectedStation} 
        onInjectFaultClick={() => {
          injectFault({
            stationId: selectedStation.id,
            parameter: 'TEMPERATURE',
            faultType: 'SPIKE',
            severityPercent: 95,
            durationSeconds: 300,
            customValue: 55.2
          });
        }} 
      />

      {/* Interactive Time Series Chart */}
      <TelemetryChart stationId={selectedStation.id} height="380px" />

      {/* Active Anomaly Evidence & Correction Section */}
      {primaryAlert ? (
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-2">
            <AlertOctagon size={18} className="text-red-400 animate-bounce" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-[#F8FAFC]">
              Active Anomaly Detection & 5-Pillar Evidence Breakdown
            </h3>
          </div>

          <EvidenceSummary alert={primaryAlert} />

          <CorrectionCard correction={primaryAlert.correction} alertId={primaryAlert.id} />
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-2">
          <ShieldCheck size={28} className="mx-auto text-emerald-400" />
          <h4 className="text-sm font-bold font-mono text-emerald-300 uppercase">
            All Real-Time Physical & Statistical QC Checks Passed
          </h4>
          <p className="text-xs text-[#9FB0BF] max-w-md mx-auto">
            {selectedStation.name} telemetry matches regional spatial Kriging and thermodynamic diurnal bounds.
          </p>
        </div>
      )}
    </div>
  );
};
