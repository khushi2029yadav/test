import React, { useState } from 'react';
import { useSkyGuard } from '../context/SkyGuardContext';
import type { AnomalyAlert } from '../types';
import { RootCauseBadge } from '../components/common/RootCauseBadge';
import { 
  AlertOctagon, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  SunMedium 
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { 
    alerts, 
    setSelectedAlertId, 
    setSelectedStationId, 
    setCurrentPage,
    resolveAlert 
  } = useSkyGuard();

  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'SUSPICIOUS' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [parameterFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    const matchesTab = activeTab === 'ALL' || a.status === activeTab;
    const matchesSearch = a.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.stationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.rootCause.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesParam = parameterFilter === 'ALL' || a.parameter === parameterFilter;

    return matchesTab && matchesSearch && matchesParam;
  });

  const handleAlertClick = (alert: AnomalyAlert) => {
    setSelectedStationId(alert.stationId);
    setSelectedAlertId(alert.id);
    setCurrentPage('alert-detail');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F8FAFC] font-mono tracking-tight">
              Anomaly Alert Center & Quality Control Arbitrations
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/40">
              {alerts.length} Total Records
            </span>
          </div>
          <p className="text-xs text-[#9FB0BF] mt-1">
            Real-time multi-pillar arbitration distinguishing genuine weather from local sensor hardware defects
          </p>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0B1B2B] border border-[#294155] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        {/* Tabs */}
        <div className="flex rounded-xl bg-[#07111F] p-1 border border-[#294155] font-mono text-xs">
          {(['ALL', 'CRITICAL', 'SUSPICIOUS', 'RESOLVED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === tab
                  ? 'bg-[#142C40] text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm'
                  : 'text-[#9FB0BF] hover:text-white'
              }`}
            >
              {tab} ({alerts.filter(a => tab === 'ALL' || a.status === tab).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9FB0BF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search alerts by station or root cause..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#07111F] border border-[#294155] focus:border-[#38BDF8] text-xs font-mono text-white placeholder-[#9FB0BF] outline-none"
          />
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-[#294155] bg-[#0B1B2B]/60 font-mono text-xs text-[#9FB0BF]">
            No anomaly events found for current filter criteria.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'CRITICAL';
            const isGenuine = alert.rootCause === 'GENUINE_WEATHER';
            const isResolved = alert.status === 'RESOLVED';

            return (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xl ${
                  isResolved
                    ? 'border-[#294155] bg-[#0B1B2B]/70'
                    : isCritical
                    ? 'border-red-500/60 bg-[#0B1B2B] hover:border-red-500 hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.4)]'
                    : isGenuine
                    ? 'border-emerald-500/60 bg-[#0B1B2B] hover:border-emerald-500 hover:shadow-[0_0_25px_-5px_rgba(34,197,94,0.3)]'
                    : 'border-amber-500/60 bg-[#0B1B2B] hover:border-amber-500'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${
                      isCritical && !isResolved ? 'bg-red-950 border-red-500/60 text-red-400' :
                      isGenuine ? 'bg-emerald-950 border-emerald-500/60 text-emerald-400' :
                      'bg-[#142C40] border-[#294155] text-[#38BDF8]'
                    }`}>
                      {isCritical ? <AlertOctagon size={20} className="animate-bounce" /> :
                       isGenuine ? <SunMedium size={20} className="animate-spin" /> :
                       <ShieldCheck size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#F8FAFC]">
                          {alert.stationId} • {alert.stationName}
                        </span>
                        <RootCauseBadge rootCause={alert.rootCause} size="sm" />
                      </div>
                      <span className="text-xs text-[#9FB0BF] font-mono">
                        {alert.region} • Parameter: <strong className="text-white">{alert.parameter}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="p-2 rounded-lg bg-[#07111F] border border-[#294155] text-center">
                      <span className="text-[10px] text-[#9FB0BF] block">Raw Observation</span>
                      <strong className={isCritical ? 'text-red-400 font-bold' : 'text-white'}>
                        {alert.rawValue} {alert.unit}
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-[#07111F] border border-[#294155] text-center">
                      <span className="text-[10px] text-[#9FB0BF] block">Suggested Advisory</span>
                      <strong className="text-emerald-400 font-bold">
                        {alert.expectedValue} {alert.unit}
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-[#07111F] border border-[#294155] text-center">
                      <span className="text-[10px] text-[#9FB0BF] block">Fusion Trust</span>
                      <strong className="text-[#38BDF8] font-bold">
                        {(alert.confidence * 100).toFixed(1)}%
                      </strong>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#F8FAFC] font-sans leading-relaxed mb-4">
                  {alert.humanReadableExplanation}
                </p>

                <div className="pt-3 border-t border-[#142C40] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="text-[#9FB0BF] truncate max-w-xl">
                    <strong className="text-[#38BDF8]">Dispatch Advisory:</strong> {alert.recommendedAction}
                  </div>

                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    {!isResolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#142C40] hover:bg-emerald-950 border border-[#294155] hover:border-emerald-500 text-emerald-400 text-xs font-bold transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleAlertClick(alert)}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-[#07111F] font-bold transition-all"
                    >
                      <span>Investigate Evidence</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
