import React, { useState } from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import type { Station } from '../../types';
import { 
  Flame, 
  Droplets, 
  Compass, 
  MapPin, 
  Zap, 
  Share2 
} from 'lucide-react';

interface LiveStationMapProps {
  height?: string;
  onStationSelect?: (stationId: string) => void;
  showRadarSweep?: boolean;
}

export const LiveStationMap: React.FC<LiveStationMapProps> = ({
  height = 'h-[520px]',
  onStationSelect,
  showRadarSweep = true
}) => {
  const { 
    stations, 
    selectedStationId, 
    setSelectedStationId, 
    setIsStationDrawerOpen 
  } = useSkyGuard();

  const [overlayMode, setOverlayMode] = useState<'NONE' | 'TEMP_HEAT' | 'HUMIDITY_HEAT' | 'SPATIAL_VECTORS'>('SPATIAL_VECTORS');

  // Focus station
  const activeStation = stations.find(s => s.id === selectedStationId) || stations[0];

  // Map Bounds for Indian Meteorological Grid (Coordinates approx 18N to 35N, 73E to 92E)
  const minLat = 17.0, maxLat = 35.5;
  const minLng = 72.0, maxLng = 93.0;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const handleMarkerClick = (station: Station) => {
    setSelectedStationId(station.id);
    setIsStationDrawerOpen(true);
    if (onStationSelect) onStationSelect(station.id);
  };

  return (
    <div className={`relative ${height} w-full rounded-2xl border border-[#294155] bg-[#07111F] overflow-hidden select-none shadow-2xl group`}>
      {/* Top Map Controls & HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1B2B]/90 backdrop-blur-md border border-[#294155] text-xs font-mono text-[#F8FAFC]">
          <Compass size={14} className="text-[#38BDF8] animate-spin" />
          <span className="font-bold">INDIAN METEOROLOGICAL AWS GRID</span>
          <span className="text-[#9FB0BF] text-[10px]">10 NODES</span>
        </div>

        {/* Heatmap & Vector Overlay Toggles */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B1B2B]/90 backdrop-blur-md border border-[#294155] text-xs font-mono">
          <button
            onClick={() => setOverlayMode(overlayMode === 'SPATIAL_VECTORS' ? 'NONE' : 'SPATIAL_VECTORS')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
              overlayMode === 'SPATIAL_VECTORS'
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                : 'text-[#9FB0BF] hover:text-[#F8FAFC]'
            }`}
          >
            <Share2 size={12} />
            <span>Kriging Links</span>
          </button>

          <button
            onClick={() => setOverlayMode(overlayMode === 'TEMP_HEAT' ? 'NONE' : 'TEMP_HEAT')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
              overlayMode === 'TEMP_HEAT'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'text-[#9FB0BF] hover:text-[#F8FAFC]'
            }`}
          >
            <Flame size={12} />
            <span>Thermal Field</span>
          </button>

          <button
            onClick={() => setOverlayMode(overlayMode === 'HUMIDITY_HEAT' ? 'NONE' : 'HUMIDITY_HEAT')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
              overlayMode === 'HUMIDITY_HEAT'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-[#9FB0BF] hover:text-[#F8FAFC]'
            }`}
          >
            <Droplets size={12} />
            <span>RH Field</span>
          </button>
        </div>
      </div>

      {/* Top Right: Legend */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 p-2 rounded-xl bg-[#0B1B2B]/90 backdrop-blur-md border border-[#294155] text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
          <span>NORMAL</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
          <span>SUSPICIOUS</span>
        </div>
        <div className="flex items-center gap-1.5 text-red-400">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444] animate-ping" />
          <span>ANOMALY</span>
        </div>
      </div>

      {/* SVG Canvas Map Surface */}
      <svg className="w-full h-full absolute inset-0 bg-[#07111F]">
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#102536" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="1" fill="#294155" />
          </pattern>

          {/* Thermal Heat Gradients */}
          <radialGradient id="heat-spike" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#EF4444" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="heat-normal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#22C55E" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Topography Contours */}
        <path
          d="M 120 80 Q 240 140 380 90 T 680 110 T 890 140"
          fill="none"
          stroke="#142C40"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M 100 130 Q 260 190 410 140 T 710 160 T 920 180"
          fill="none"
          stroke="#142C40"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
        <path
          d="M 80 260 Q 220 320 360 280 T 640 310 T 860 340"
          fill="none"
          stroke="#102536"
          strokeWidth="1.2"
        />

        {/* Optional Radar Sweep Effect */}
        {showRadarSweep && (
          <g className="animate-radar-sweep pointer-events-none origin-[30%_35%]">
            <line
              x1="30%"
              y1="35%"
              x2="90%"
              y2="10%"
              stroke="rgba(56, 189, 248, 0.4)"
              strokeWidth="1.5"
            />
            <circle cx="30%" cy="35%" r="220" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="30%" cy="35%" r="140" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" />
          </g>
        )}

        {/* Heatmap Overlay */}
        {overlayMode === 'TEMP_HEAT' && (
          <g className="transition-opacity duration-300">
            {stations.map(s => {
              const pos = projectCoords(s.lat, s.lng);
              const isHigh = s.currentReadings.temperature > 40;
              return (
                <circle
                  key={'heat-' + s.id}
                  cx={`${pos.x}%`}
                  cy={`${pos.y}%`}
                  r={isHigh ? 90 : 60}
                  fill={isHigh ? 'url(#heat-spike)' : 'url(#heat-normal)'}
                />
              );
            })}
          </g>
        )}

        {/* Spatial Correlation Kriging Links */}
        {overlayMode === 'SPATIAL_VECTORS' && (
          <g className="transition-opacity duration-300">
            {(() => {
              const hrd = stations.find(s => s.id === 'ST-104');
              const ddn = stations.find(s => s.id === 'ST-101');
              const mus = stations.find(s => s.id === 'ST-102');
              const rsk = stations.find(s => s.id === 'ST-103');

              if (!hrd || !ddn || !mus || !rsk) return null;

              const pHrd = projectCoords(hrd.lat, hrd.lng);
              const pDdn = projectCoords(ddn.lat, ddn.lng);
              const pMus = projectCoords(mus.lat, mus.lng);
              const pRsk = projectCoords(rsk.lat, rsk.lng);

              return (
                <g>
                  {/* Spatial radius circle around ST-104 */}
                  <circle
                    cx={`${pHrd.x}%`}
                    cy={`${pHrd.y}%`}
                    r="85"
                    fill="rgba(239, 68, 68, 0.05)"
                    stroke="rgba(239, 68, 68, 0.4)"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />
                  {/* Vector lines */}
                  <line
                    x1={`${pHrd.x}%`}
                    y1={`${pHrd.y}%`}
                    x2={`${pDdn.x}%`}
                    y2={`${pDdn.y}%`}
                    stroke="rgba(239, 68, 68, 0.7)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={`${pHrd.x}%`}
                    y1={`${pHrd.y}%`}
                    x2={`${pRsk.x}%`}
                    y2={`${pRsk.y}%`}
                    stroke="rgba(239, 68, 68, 0.7)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={`${pHrd.x}%`}
                    y1={`${pHrd.y}%`}
                    x2={`${pMus.x}%`}
                    y2={`${pMus.y}%`}
                    stroke="rgba(239, 68, 68, 0.5)"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={`${pDdn.x}%`}
                    y1={`${pDdn.y}%`}
                    x2={`${pRsk.x}%`}
                    y2={`${pRsk.y}%`}
                    stroke="rgba(34, 197, 94, 0.6)"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })()}
          </g>
        )}
      </svg>

      {/* Station Interactive Markers Layer */}
      <div className="absolute inset-0 pointer-events-auto">
        {stations.map(station => {
          const pos = projectCoords(station.lat, station.lng);
          const isSelected = station.id === selectedStationId;
          const isAnomaly = station.status === 'ANOMALY';
          const isSuspicious = station.status === 'SUSPICIOUS';

          return (
            <div
              key={station.id}
              onClick={() => handleMarkerClick(station)}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute cursor-pointer transition-all duration-200 group/marker z-20"
            >
              {/* Pulse Ring for Anomaly */}
              {isAnomaly && (
                <span className="absolute -inset-3 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
              )}
              {isSuspicious && (
                <span className="absolute -inset-2.5 rounded-full bg-amber-500/30 animate-pulse pointer-events-none" />
              )}

              {/* Station Marker Body */}
              <div
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-mono shadow-xl transition-all ${
                  isAnomaly
                    ? 'bg-red-950/90 border-red-500 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-110'
                    : isSuspicious
                    ? 'bg-amber-950/90 border-amber-500 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                    : isSelected
                    ? 'bg-[#102536] border-[#38BDF8] text-[#F8FAFC] shadow-[0_0_15px_rgba(56,189,248,0.5)] scale-105'
                    : 'bg-[#0B1B2B]/90 border-[#294155] text-[#9FB0BF] hover:border-[#38BDF8]/70 hover:text-white'
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    isAnomaly
                      ? 'bg-red-500 animate-pulse'
                      : isSuspicious
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[11px] text-white">
                      {station.id}
                    </span>
                    {isAnomaly && (
                      <Zap size={10} className="text-red-400 fill-current animate-bounce" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      isAnomaly
                        ? 'text-red-300'
                        : isSuspicious
                        ? 'text-amber-300'
                        : 'text-[#38BDF8]'
                    }`}
                  >
                    {station.currentReadings.temperature}°C
                  </span>
                </div>
              </div>

              {/* Hover Tooltip Card */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/marker:flex flex-col w-52 p-3 rounded-xl bg-[#0B1B2B]/95 border border-[#294155] shadow-2xl backdrop-blur-md z-30 pointer-events-none">
                <div className="flex items-center justify-between border-b border-[#294155] pb-1.5 mb-1.5">
                  <span className="font-mono font-bold text-xs text-[#F8FAFC]">
                    {station.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      isAnomaly
                        ? 'bg-red-950 text-red-400 border border-red-500/40'
                        : isSuspicious
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {station.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-[#9FB0BF]">
                  <div>T: <strong className="text-white">{station.currentReadings.temperature}°C</strong></div>
                  <div>P: <strong className="text-white">{station.currentReadings.pressure} hPa</strong></div>
                  <div>RH: <strong className="text-white">{station.currentReadings.humidity}%</strong></div>
                  <div>Wind: <strong className="text-white">{station.currentReadings.windSpeed} m/s</strong></div>
                </div>

                <div className="mt-2 pt-1 border-t border-[#142C40] flex items-center justify-between text-[9px] font-mono">
                  <span className="text-[#9FB0BF]">Health: {station.healthScore}%</span>
                  <span className="text-[#38BDF8] font-bold">Click to Investigate →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Info Pill */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#0B1B2B]/90 backdrop-blur-md border border-[#294155] text-xs font-mono text-[#9FB0BF]">
        <div className="flex items-center gap-2">
          <MapPin size={13} className="text-[#38BDF8]" />
          <span>Focused: <strong className="text-[#F8FAFC]">{activeStation.name}</strong></span>
        </div>
        <span className="text-[#294155]">|</span>
        <div>Elev: <strong className="text-[#38BDF8]">{activeStation.elevationM}m</strong></div>
        <span className="text-[#294155]">|</span>
        <div>Lat: <strong className="text-white">{activeStation.lat.toFixed(3)}°N</strong>, Lng: <strong className="text-white">{activeStation.lng.toFixed(3)}°E</strong></div>
      </div>
    </div>
  );
};
