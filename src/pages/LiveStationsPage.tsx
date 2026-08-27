import React, { useState } from 'react';
import { useSkyGuard } from '../context/SkyGuardContext';
import { StationTable } from '../components/station/StationTable';
import { LiveStationMap } from '../components/map/LiveStationMap';
import { Map, List, Layers } from 'lucide-react';

export const LiveStationsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'SPLIT' | 'TABLE_ONLY' | 'MAP_ONLY'>('SPLIT');
  const { stations, setSelectedStationId, setCurrentPage } = useSkyGuard();

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F8FAFC] font-mono tracking-tight">
              Live AWS Station Registry & Spatial Grid
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#102536] text-[#38BDF8] border border-[#294155]">
              {stations.length} Telemetry Nodes
            </span>
          </div>
          <p className="text-xs text-[#9FB0BF] mt-1">
            Real-time geospatial distribution, physical parameters and quality control flags
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-xl bg-[#0B1B2B] p-1 border border-[#294155] font-mono text-xs">
          <button
            onClick={() => setViewMode('SPLIT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'SPLIT'
                ? 'bg-[#142C40] text-[#38BDF8] font-bold border border-[#38BDF8]/40'
                : 'text-[#9FB0BF] hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>Split View</span>
          </button>
          <button
            onClick={() => setViewMode('TABLE_ONLY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'TABLE_ONLY'
                ? 'bg-[#142C40] text-[#38BDF8] font-bold border border-[#38BDF8]/40'
                : 'text-[#9FB0BF] hover:text-white'
            }`}
          >
            <List size={13} />
            <span>Table Registry</span>
          </button>
          <button
            onClick={() => setViewMode('MAP_ONLY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'MAP_ONLY'
                ? 'bg-[#142C40] text-[#38BDF8] font-bold border border-[#38BDF8]/40'
                : 'text-[#9FB0BF] hover:text-white'
            }`}
          >
            <Map size={13} />
            <span>Full Map</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content Based on View Mode */}
      {viewMode === 'SPLIT' && (
        <div className="space-y-6">
          <LiveStationMap height="h-[420px]" />
          <StationTable onStationSelect={(id) => {
            setSelectedStationId(id);
          }} />
        </div>
      )}

      {viewMode === 'TABLE_ONLY' && (
        <StationTable onStationSelect={(id) => {
          setSelectedStationId(id);
          setCurrentPage('station-detail');
        }} />
      )}

      {viewMode === 'MAP_ONLY' && (
        <LiveStationMap height="h-[680px]" />
      )}
    </div>
  );
};
