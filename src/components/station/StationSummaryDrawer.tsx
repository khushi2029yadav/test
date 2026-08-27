import React from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import { StatusPill } from '../common/StatusPill';
import { RootCauseBadge } from '../common/RootCauseBadge';
import { 
  X, 
  Radio, 
  MapPin, 
  Zap, 
  ArrowRight, 
  HeartPulse, 
  Battery, 
  Sun, 
  Wifi 
} from 'lucide-react';

export const StationSummaryDrawer: React.FC = () => {
  const { 
    isStationDrawerOpen, 
    setIsStationDrawerOpen, 
    selectedStation, 
    setCurrentPage, 
    setSelectedAlertId, 
    alerts,
    injectFault 
  } = useSkyGuard();

  if (!isStationDrawerOpen) return null;

  const stationAlerts = alerts.filter(a => a.stationId === selectedStation.id);
  const primaryAlert = stationAlerts[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsStationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#07111F] border-l border-[#294155] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-[#294155] bg-[#0B1B2B]/90">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="text-[#38BDF8]" size={18} />
                <span className="font-mono font-bold text-sm text-[#F8FAFC]">
                  {selectedStation.code}
                </span>
              </div>
              <button
                onClick={() => setIsStationDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#9FB0BF] hover:text-[#F8FAFC] hover:bg-[#142C40] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="text-lg font-bold text-[#F8FAFC] font-mono tracking-tight">
              {selectedStation.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-[#9FB0BF]">
              <MapPin size={12} className="text-[#38BDF8]" />
              <span>{selectedStation.region}</span>
              <span>•</span>
              <span>Elev: {selectedStation.elevationM}m</span>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#142C40]">
              <StatusPill status={selectedStation.status} size="md" />
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#9FB0BF]">
                <HeartPulse size={14} className={selectedStation.healthScore < 80 ? 'text-amber-400' : 'text-emerald-400'} />
                <span>Health: <strong className="text-white">{selectedStation.healthScore}%</strong></span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Live Observation Matrix */}
            <div>
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#9FB0BF] block mb-2">
                Instant Observation Telemetry
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#0B1B2B] border border-[#294155]">
                  <span className="text-[#9FB0BF] text-[11px] block">Air Temperature</span>
                  <span className={`text-xl font-bold ${selectedStation.currentReadings.temperature > 50 ? 'text-red-400' : 'text-[#38BDF8]'}`}>
                    {selectedStation.currentReadings.temperature}°C
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B1B2B] border border-[#294155]">
                  <span className="text-[#9FB0BF] text-[11px] block">Atm Pressure</span>
                  <span className="text-xl font-bold text-[#A78BFA]">
                    {selectedStation.currentReadings.pressure} hPa
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B1B2B] border border-[#294155]">
                  <span className="text-[#9FB0BF] text-[11px] block">Rel Humidity</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {selectedStation.currentReadings.humidity}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B1B2B] border border-[#294155]">
                  <span className="text-[#9FB0BF] text-[11px] block">Wind Speed</span>
                  <span className="text-xl font-bold text-cyan-300">
                    {selectedStation.currentReadings.windSpeed} m/s
                  </span>
                </div>
              </div>
            </div>

            {/* Active Alert Card if present */}
            {primaryAlert && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-red-400 flex items-center gap-1.5">
                    <Zap size={13} className="animate-bounce" />
                    Active Critical Anomaly
                  </span>
                  <RootCauseBadge rootCause={primaryAlert.rootCause} size="sm" />
                </div>
                <p className="text-xs text-[#F8FAFC] leading-relaxed">
                  {primaryAlert.humanReadableExplanation}
                </p>
                <div className="pt-2 border-t border-red-500/30 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-red-300">
                    Confidence: {(primaryAlert.confidence * 100).toFixed(1)}%
                  </span>
                  <button
                    onClick={() => {
                      setSelectedAlertId(primaryAlert.id);
                      setCurrentPage('alert-detail');
                      setIsStationDrawerOpen(false);
                    }}
                    className="flex items-center gap-1 text-xs font-mono font-bold text-[#38BDF8] hover:text-white"
                  >
                    <span>Full Evidence</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Hardware & Diagnostics */}
            <div className="p-4 rounded-xl bg-[#0B1B2B] border border-[#294155] space-y-2.5 font-mono text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9FB0BF] block">
                Hardware Node Identity & Power
              </span>
              <div className="flex justify-between text-[#9FB0BF]">
                <span>Hardware:</span>
                <span className="text-white font-medium">{selectedStation.hardwareModel}</span>
              </div>
              <div className="flex justify-between text-[#9FB0BF]">
                <span>Firmware:</span>
                <span className="text-white font-medium">{selectedStation.firmwareVersion}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#142C40] text-center">
                <div className="p-2 rounded bg-[#102536]">
                  <Battery size={13} className="mx-auto text-emerald-400 mb-1" />
                  <span className="text-[10px] text-[#9FB0BF] block">Battery</span>
                  <span className="font-bold text-white">{selectedStation.batteryPercent}%</span>
                </div>
                <div className="p-2 rounded bg-[#102536]">
                  <Sun size={13} className="mx-auto text-yellow-400 mb-1" />
                  <span className="text-[10px] text-[#9FB0BF] block">Solar</span>
                  <span className="font-bold text-white">{selectedStation.solarWatts}W</span>
                </div>
                <div className="p-2 rounded bg-[#102536]">
                  <Wifi size={13} className="mx-auto text-[#38BDF8] mb-1" />
                  <span className="text-[10px] text-[#9FB0BF] block">SNR</span>
                  <span className="font-bold text-white">{selectedStation.signalSNR} dB</span>
                </div>
              </div>
            </div>

            {/* Quick Fault Injection Shortcuts */}
            <div className="p-4 rounded-xl bg-[#102536]/80 border border-[#294155] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9FB0BF] block">
                Simulator Triggers
              </span>
              <div className="grid grid-cols-2 gap-2">
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
                  className="px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-xs font-mono font-semibold transition-colors"
                >
                  ⚡ Inject Spike (+26°C)
                </button>
                <button
                  onClick={() => {
                    injectFault({
                      stationId: selectedStation.id,
                      parameter: 'PRESSURE',
                      faultType: 'DRIFT',
                      severityPercent: 80,
                      durationSeconds: 300,
                      customValue: 782.5
                    });
                  }}
                  className="px-3 py-2 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold transition-colors"
                >
                  📈 Inject Drift (-0.4 hPa)
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#294155] bg-[#0B1B2B] flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentPage('station-detail');
                setIsStationDrawerOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-[#07111F] text-xs font-mono font-bold transition-all shadow-md active:scale-95"
            >
              <span>Full Investigation Page</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
