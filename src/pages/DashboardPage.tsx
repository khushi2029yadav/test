import React from 'react';
import { useSkyGuard } from '../context/SkyGuardContext';
import { MetricCard } from '../components/common/MetricCard';
import { LiveStationMap } from '../components/map/LiveStationMap';
import { TelemetryChart } from '../components/station/TelemetryChart';
import { AlertTimeline } from '../components/alerts/AlertTimeline';
import { StatusPill } from '../components/common/StatusPill';
import { 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  SunMedium, 
  ArrowRight, 
  Sparkles, 
  Zap 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    stations, 
    alerts, 
    selectedStation, 
    setSelectedStationId, 
    setCurrentPage, 
    setSelectedAlertId 
  } = useSkyGuard();

  const totalStations = stations.length;
  const healthyCount = stations.filter(s => s.status === 'NORMAL').length;
  const suspiciousCount = stations.filter(s => s.status === 'SUSPICIOUS').length;
  const criticalCount = stations.filter(s => s.status === 'ANOMALY').length;

  const genuineAlert = alerts.find(a => a.rootCause === 'GENUINE_WEATHER');
  const hasGenuineWeatherEvent = !!genuineAlert;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Welcome & Mission Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F8FAFC] font-mono tracking-tight">
              Operational Weather Intelligence Mission Control
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
              WMO-No. 8 Compliant
            </span>
          </div>
          <p className="text-xs text-[#9FB0BF] mt-1">
            Continuous multi-pillar AI anomaly arbitration across 10 regional Automatic Weather Stations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedStationId('ST-104');
              setCurrentPage('simulator');
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 text-red-300 text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <Zap size={14} className="text-red-400" />
            <span>Inject Spike (ST-104)</span>
          </button>

          <button
            onClick={() => setCurrentPage('copilot')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#38BDF8]/20 to-[#A78BFA]/20 hover:from-[#38BDF8]/30 hover:to-[#A78BFA]/30 border border-[#A78BFA]/50 text-[#A78BFA] text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <Sparkles size={14} className="text-[#A78BFA]" />
            <span>Ask SkyGuard AI</span>
          </button>
        </div>
      </div>

      {/* Hero Genuine Weather Banner (When Regional Agreement confirms genuine synoptic event) */}
      {hasGenuineWeatherEvent && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#0B1B2B] to-[#0B1B2B] border border-emerald-500/60 shadow-[0_0_25px_-5px_rgba(34,197,94,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-400 shrink-0">
              <SunMedium size={24} className="animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  LIKELY GENUINE REGIONAL WEATHER DETECTED
                </span>
                <span className="text-xs font-mono text-[#9FB0BF]">
                  Station ST-109 (Pune 45.4°C)
                </span>
              </div>
              <p className="text-xs text-[#F8FAFC] font-medium mt-1 leading-snug">
                Regional consensus verified: 3 adjacent stations confirm synoptic heat dome. Sensor fault escalation was suppressed.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedStationId('ST-109');
              setSelectedAlertId(genuineAlert.id);
              setCurrentPage('alert-detail');
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-md shrink-0 active:scale-95"
          >
            <span>Inspect Genuine Evidence</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active AWS Stations"
          value={totalStations}
          unit="Stations"
          subtitle="100% Ingestion Up"
          icon={Radio}
          variant="cyan"
          trend={{ direction: 'neutral', label: '10/10 Online' }}
          onClick={() => setCurrentPage('stations')}
        />
        <MetricCard
          title="Normal / Trusted"
          value={healthyCount}
          unit="Stations"
          subtitle="QC Verified Passed"
          icon={CheckCircle2}
          variant="green"
          trend={{ direction: 'up', label: `${((healthyCount / totalStations) * 100).toFixed(0)}% Healthy` }}
          onClick={() => setCurrentPage('stations')}
        />
        <MetricCard
          title="Suspicious Observations"
          value={suspiciousCount}
          unit="Events"
          subtitle="Incomplete Evidence"
          icon={AlertTriangle}
          variant="amber"
          glow={suspiciousCount > 0}
          trend={{ direction: suspiciousCount > 0 ? 'down' : 'neutral', label: 'Under Verification' }}
          onClick={() => setCurrentPage('alerts')}
        />
        <MetricCard
          title="Critical Anomalies"
          value={criticalCount}
          unit="Faults"
          subtitle="Confirmed Hardware Spike"
          icon={AlertOctagon}
          variant="red"
          glow={criticalCount > 0}
          trend={{ direction: criticalCount > 0 ? 'down' : 'up', label: criticalCount > 0 ? 'Action Required' : '0 Anomalies' }}
          onClick={() => setCurrentPage('alerts')}
        />
      </div>

      {/* Main Map & Live Readout Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Operational Live Map (2 cols) */}
        <div className="lg:col-span-2 space-y-2">
          <LiveStationMap height="h-[520px]" />
        </div>

        {/* Selected Station Live Card & Alert Feed (1 col) */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-[#294155] bg-[#0B1B2B] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#294155]">
              <div className="flex items-center gap-2">
                <Radio className="text-[#38BDF8]" size={18} />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                  Focused Station Telemetry
                </h3>
              </div>
              <StatusPill status={selectedStation.status} size="sm" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold font-mono text-[#F8FAFC]">
                  {selectedStation.id} • {selectedStation.name}
                </span>
              </div>
              <span className="text-xs text-[#9FB0BF] font-mono">
                {selectedStation.region} • Elev: {selectedStation.elevationM}m
              </span>
            </div>

            {/* Micro Readings Grid */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#07111F] border border-[#294155]">
                <span className="text-[#9FB0BF] text-[11px] block">Temperature</span>
                <strong className={`text-xl font-bold ${selectedStation.currentReadings.temperature > 50 ? 'text-red-400' : 'text-[#38BDF8]'}`}>
                  {selectedStation.currentReadings.temperature}°C
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-[#07111F] border border-[#294155]">
                <span className="text-[#9FB0BF] text-[11px] block">Atm Pressure</span>
                <strong className="text-xl font-bold text-[#A78BFA]">
                  {selectedStation.currentReadings.pressure} hPa
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-[#07111F] border border-[#294155]">
                <span className="text-[#9FB0BF] text-[11px] block">Rel Humidity</span>
                <strong className="text-xl font-bold text-emerald-400">
                  {selectedStation.currentReadings.humidity}%
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-[#07111F] border border-[#294155]">
                <span className="text-[#9FB0BF] text-[11px] block">Wind Speed</span>
                <strong className="text-xl font-bold text-cyan-300">
                  {selectedStation.currentReadings.windSpeed} m/s
                </strong>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('station-detail')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#142C40] hover:bg-[#38BDF8]/20 border border-[#294155] hover:border-[#38BDF8] text-xs font-mono font-bold text-[#38BDF8] transition-colors"
            >
              <span>Deep Station Investigation</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Quick Health Ranking Widget */}
          <div className="p-5 rounded-2xl border border-[#294155] bg-[#0B1B2B] shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#294155]">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                Network Health Ranking
              </span>
              <span className="text-[10px] font-mono text-[#9FB0BF]">Lowest Health First</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {stations
                .slice()
                .sort((a, b) => a.healthScore - b.healthScore)
                .slice(0, 4)
                .map(st => (
                  <div
                    key={st.id}
                    onClick={() => {
                      setSelectedStationId(st.id);
                      setCurrentPage('station-detail');
                    }}
                    className="p-2 rounded-lg bg-[#07111F] border border-[#142C40] hover:border-[#38BDF8]/50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${st.healthScore < 80 ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      <span className="font-bold text-white">{st.id}</span>
                      <span className="text-[11px] text-[#9FB0BF] font-sans truncate max-w-[120px]">{st.name}</span>
                    </div>
                    <span className={`font-bold ${st.healthScore < 80 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {st.healthScore}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive ECharts Telemetry Chart with Anomaly Pins */}
      <TelemetryChart height="360px" />

      {/* Alert Feed Timeline */}
      <AlertTimeline limit={4} />
    </div>
  );
};
