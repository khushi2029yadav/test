import React from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import { WifiOff, RefreshCw } from 'lucide-react';

export const ConnectionStatus: React.FC = () => {
  const { connectionState, setConnectionState, lastUpdated } = useSkyGuard();

  if (connectionState === 'CONNECTED') {
    return null; // Hidden when normal
  }

  return (
    <div className="bg-amber-950/90 border-b border-amber-500/50 px-4 py-2 flex items-center justify-between text-amber-200 text-xs font-mono select-none sticky top-16 z-20 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="p-1 rounded bg-amber-900/60 text-amber-400">
          <WifiOff size={14} className="animate-pulse" />
        </div>
        <div>
          <span className="font-bold tracking-wider uppercase mr-2 text-amber-300">
            {connectionState === 'RECONNECTING' ? 'Telemetry Stream Interrupted — Reconnecting...' : 'Network Offline'}
          </span>
          <span className="text-amber-200/70 text-[11px]">
            Preserving last known observation state. Last successful packet: <strong className="text-amber-100">{lastUpdated}</strong>.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setConnectionState('CONNECTED')}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-800/80 hover:bg-amber-700 border border-amber-500/50 text-white text-xs font-bold transition-colors"
        >
          <RefreshCw size={11} className="animate-spin" />
          <span>Force Reconnect</span>
        </button>
      </div>
    </div>
  );
};
