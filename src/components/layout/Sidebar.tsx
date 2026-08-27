import React from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import type { PageId } from '../../types';
import {
  LayoutDashboard,
  Radio,
  AlertOctagon,
  LineChart,
  HeartPulse,
  Sliders,
  Sparkles,
  Server,
  ShieldCheck,
  Zap,
  SunMedium
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    stations, 
    alerts, 
    setIsTourActive,
    goToDemoStep,
    injectFault
  } = useSkyGuard();

  const anomalyCount = stations.filter(s => s.status === 'ANOMALY').length;
  const activeAlerts = alerts.filter(a => a.status === 'CRITICAL' || a.status === 'SUSPICIOUS').length;

  const navItems: { id: PageId; label: string; icon: React.FC<{ size?: number; className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stations', label: 'Live Stations', icon: Radio, badge: stations.length, badgeColor: 'text-[#38BDF8] bg-[#142C40]' },
    { id: 'alerts', label: 'Alerts & Evidence', icon: AlertOctagon, badge: activeAlerts, badgeColor: anomalyCount > 0 ? 'text-red-400 bg-red-950/80 border border-red-500/50' : 'text-amber-400 bg-amber-950/80' },
    { id: 'analytics', label: 'Telemetry Analytics', icon: LineChart },
    { id: 'health', label: 'Sensor Health', icon: HeartPulse, badge: `${stations.filter(s => s.healthScore < 80).length} warn`, badgeColor: 'text-amber-400 bg-amber-950/50' },
    { id: 'simulator', label: 'Fault Simulator', icon: Sliders, badge: 'Active QC', badgeColor: 'text-[#A78BFA] bg-purple-950/60 border border-purple-500/30' },
    { id: 'copilot', label: 'SkyGuard AI', icon: Sparkles, badge: 'Copilot', badgeColor: 'text-[#38BDF8] bg-cyan-950/60 border border-cyan-500/40' },
    { id: 'system', label: 'System & Pipeline', icon: Server }
  ];

  return (
    <aside className="w-60 min-w-60 max-w-60 bg-[#07111F] border-r border-[#294155] flex flex-col h-screen select-none z-30 sticky top-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#294155] flex items-center gap-3">
        <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#0B1B2B] to-[#142C40] border border-[#38BDF8]/50 shadow-[0_0_15px_-3px_rgba(56,189,248,0.4)]">
          <ShieldCheck className="text-[#38BDF8]" size={22} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#38BDF8]" />
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-wider text-[#F8FAFC] font-mono">
              SKYGUARD
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40">
              SIH-26073
            </span>
          </div>
          <span className="text-[10px] text-[#9FB0BF] font-mono font-medium tracking-tight">
            AI Weather Intelligence
          </span>
        </div>
      </div>

      {/* Core Question Mission Banner */}
      <div className="mx-3 mt-3 p-2.5 rounded-lg bg-[#0B1B2B] border border-[#294155] text-left">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9FB0BF] block">
          Primary UX Inquiry
        </span>
        <span className="text-xs text-[#38BDF8] font-semibold italic mt-0.5 block">
          "Should I trust this observation?"
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#9FB0BF]">
          Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || 
            (item.id === 'stations' && currentPage === 'station-detail') ||
            (item.id === 'alerts' && currentPage === 'alert-detail') ||
            (item.id === 'health' && currentPage === 'health-detail');

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-[#102536] text-[#38BDF8] border border-[#38BDF8]/40 shadow-[0_0_15px_-4px_rgba(56,189,248,0.25)] font-semibold'
                  : 'text-[#9FB0BF] hover:bg-[#0B1B2B] hover:text-[#F8FAFC] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  size={16}
                  className={`transition-colors ${
                    isActive ? 'text-[#38BDF8]' : 'text-[#9FB0BF] group-hover:text-[#F8FAFC]'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Hero Scenario Shortcuts */}
        <div className="pt-4 px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#9FB0BF]">
          Hero Scenarios
        </div>
        <button
          onClick={() => {
            goToDemoStep(3);
            injectFault({
              stationId: 'ST-104',
              parameter: 'TEMPERATURE',
              faultType: 'SPIKE',
              severityPercent: 95,
              durationSeconds: 300,
              customValue: 55.2
            });
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 hover:border-red-500/60 text-red-300 text-xs font-mono transition-all text-left group"
        >
          <Zap size={13} className="text-red-400 shrink-0 group-hover:animate-bounce" />
          <div className="flex flex-col truncate">
            <span className="font-bold text-[11px]">Hero 1: ST-104 Spike (55°C)</span>
            <span className="text-[9px] text-red-400/80">Local Sensor RTD Fault</span>
          </div>
        </button>

        <button
          onClick={() => {
            goToDemoStep(10);
            injectFault({
              stationId: 'ST-109',
              parameter: 'TEMPERATURE',
              faultType: 'GENUINE_WEATHER',
              severityPercent: 88,
              durationSeconds: 300,
              customValue: 45.4
            });
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 text-xs font-mono transition-all text-left group"
        >
          <SunMedium size={13} className="text-emerald-400 shrink-0 group-hover:animate-spin" />
          <div className="flex flex-col truncate">
            <span className="font-bold text-[11px]">Hero 2: ST-109 Heatwave (45°C)</span>
            <span className="text-[9px] text-emerald-400/80">Genuine Synoptic Agreement</span>
          </div>
        </button>
      </nav>

      {/* Footer System Status & SIH Guided Demo */}
      <div className="p-3 border-t border-[#294155] bg-[#0B1B2B]/60 space-y-2">
        <button
          onClick={() => setIsTourActive(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#38BDF8]/20 to-[#A78BFA]/20 hover:from-[#38BDF8]/30 hover:to-[#A78BFA]/30 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono font-bold transition-all shadow-sm"
        >
          <Sparkles size={14} className="text-[#A78BFA]" />
          <span>SIH 11-Step Demo Flow</span>
        </button>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#9FB0BF] pt-1">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span>Telemetry Bus</span>
          </span>
          <span className="text-[#22C55E] font-semibold">100% HEALTHY</span>
        </div>
      </div>
    </aside>
  );
};
