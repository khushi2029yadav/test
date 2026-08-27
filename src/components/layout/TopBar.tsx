import React, { useState } from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import { 
  WifiOff, 
  Bell, 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertOctagon, 
  AlertTriangle 
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    currentPage,
    stations,
    connectionState,
    latencyMs,
    lastUpdated,
    isStreaming,
    setIsStreaming,
    streamSpeed,
    setStreamSpeed,
    setIsAssistantDrawerOpen,
    setCurrentPage,
    resetToDefaultState,
    toasts
  } = useSkyGuard();

  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Mission Control Overview';
      case 'stations':
        return 'Live AWS Station Network';
      case 'station-detail':
        return 'Station Telemetry & QC Investigation';
      case 'alerts':
        return 'Anomaly Alerts & Evidence Center';
      case 'alert-detail':
        return 'Multi-Pillar Evidence & Root Cause Analysis';
      case 'analytics':
        return 'Comparative Analytics & Multivariate Space';
      case 'health':
        return 'Sensor Health & Predictive Maintenance';
      case 'health-detail':
        return 'Sensor Subsystem Degradation Curves';
      case 'simulator':
        return 'Fault Simulator & Pipeline Injector';
      case 'copilot':
        return 'SkyGuard AI Intelligence Copilot';
      case 'system':
        return 'System Infrastructure & Model Health';
      default:
        return 'SkyGuard Intelligence';
    }
  };

  const activeCount = stations.length;
  const criticalCount = stations.filter(s => s.status === 'ANOMALY').length;
  const suspiciousCount = stations.filter(s => s.status === 'SUSPICIOUS').length;
  const healthyCount = stations.filter(s => s.status === 'NORMAL').length;

  return (
    <header className="h-16 bg-[#07111F]/90 backdrop-blur-md border-b border-[#294155] px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Page Title & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#F8FAFC] tracking-tight font-mono">
              {getPageTitle()}
            </h1>
            <span className="text-[10px] font-mono text-[#9FB0BF] px-2 py-0.5 rounded bg-[#102536] border border-[#294155]">
              v2.4-PROD
            </span>
          </div>
          <p className="text-[11px] text-[#9FB0BF]">
            AI/ML Real-Time AWS Quality Control & Evidence Engine
          </p>
        </div>
      </div>

      {/* Center: Live Station Health Chips */}
      <div className="hidden xl:flex items-center gap-2.5 font-mono text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1B2B] border border-[#294155] text-[#38BDF8]">
          <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="font-bold">{activeCount}</span>
          <span className="text-[#9FB0BF] text-[10px]">ACTIVE</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 size={13} />
          <span className="font-bold">{healthyCount}</span>
          <span className="text-emerald-400/70 text-[10px]">HEALTHY</span>
        </div>

        {suspiciousCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-400">
            <AlertTriangle size={13} />
            <span className="font-bold">{suspiciousCount}</span>
            <span className="text-amber-400/70 text-[10px]">SUSPICIOUS</span>
          </div>
        )}

        {criticalCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-500/60 text-red-400 shadow-[0_0_15px_-4px_rgba(239,68,68,0.5)]">
            <AlertOctagon size={13} className="animate-bounce" />
            <span className="font-bold">{criticalCount}</span>
            <span className="text-red-400/80 text-[10px]">CRITICAL</span>
          </div>
        )}
      </div>

      {/* Right: Controls, Connection state, AI toggle, Notifications */}
      <div className="flex items-center gap-3">
        {/* Stream Play/Pause & Speed */}
        <div className="flex items-center bg-[#0B1B2B] border border-[#294155] rounded-lg p-0.5">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            title={isStreaming ? 'Pause Realtime Ingestion' : 'Resume Realtime Ingestion'}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              isStreaming
                ? 'bg-[#38BDF8]/20 text-[#38BDF8]'
                : 'text-[#9FB0BF] hover:text-[#F8FAFC]'
            }`}
          >
            {isStreaming ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button
            onClick={() => setStreamSpeed(streamSpeed === 1 ? 2 : streamSpeed === 2 ? 5 : 1)}
            title="Stream Acceleration Multiplier"
            className="px-2 py-1 text-[10px] font-mono font-bold text-[#9FB0BF] hover:text-[#38BDF8] transition-colors"
          >
            {streamSpeed}x
          </button>
        </div>

        {/* Connection Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1B2B] border border-[#294155] text-xs font-mono">
          {connectionState === 'CONNECTED' ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-bold text-[11px]">LIVE</span>
              <span className="text-[10px] text-[#9FB0BF]">
                {latencyMs}ms
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-400">
              <WifiOff size={13} className="animate-pulse" />
              <span className="font-bold text-[11px]">RECONNECTING</span>
            </div>
          )}
        </div>

        {/* Quick Simulator Launcher */}
        <button
          onClick={() => setCurrentPage('simulator')}
          title="Open Fault Simulator"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142C40] hover:bg-[#38BDF8]/20 border border-[#294155] hover:border-[#38BDF8]/60 text-xs font-mono text-[#38BDF8] transition-all"
        >
          <Sliders size={13} />
          <span className="hidden md:inline font-semibold">Simulate Fault</span>
        </button>

        {/* AI Copilot Drawer Button */}
        <button
          onClick={() => setIsAssistantDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#38BDF8]/20 to-[#A78BFA]/20 hover:from-[#38BDF8]/30 hover:to-[#A78BFA]/30 border border-[#A78BFA]/40 text-[#A78BFA] text-xs font-mono font-bold transition-all shadow-[0_0_15px_-4px_rgba(167,139,250,0.3)]"
        >
          <Sparkles size={14} className="text-[#A78BFA] animate-spin" />
          <span className="hidden sm:inline">SkyGuard AI</span>
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-[#0B1B2B] hover:bg-[#142C40] border border-[#294155] text-[#9FB0BF] hover:text-[#F8FAFC] transition-colors"
          >
            <Bell size={15} />
            {toasts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-mono font-bold text-white">
                {toasts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0B1B2B] border border-[#294155] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#294155]">
                <span className="text-xs font-bold font-mono uppercase text-[#F8FAFC]">
                  Live Stream Notifications
                </span>
                <span className="text-[10px] text-[#9FB0BF]">
                  Last: {lastUpdated}
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {toasts.length === 0 ? (
                  <p className="text-xs text-[#9FB0BF] py-4 text-center">
                    No active anomaly notifications
                  </p>
                ) : (
                  toasts.map(t => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg bg-[#102536] border border-[#294155] text-left hover:border-[#38BDF8]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="font-bold text-red-400">{t.title}</span>
                        <span className="text-[#9FB0BF]">{t.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#F8FAFC]">{t.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reset System State */}
        <button
          onClick={resetToDefaultState}
          title="Reset Simulation to Initial State"
          className="p-2 rounded-lg bg-[#0B1B2B] hover:bg-[#142C40] border border-[#294155] text-[#9FB0BF] hover:text-[#38BDF8] transition-colors"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </header>
  );
};
