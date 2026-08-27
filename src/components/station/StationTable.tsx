import React, { useState } from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import type { Station, StationStatus } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { 
  Search, 
  ArrowUpDown, 
  Radio, 
  Sliders, 
  Eye, 
  HeartPulse 
} from 'lucide-react';

interface StationTableProps {
  onStationSelect?: (stationId: string) => void;
}

export const StationTable: React.FC<StationTableProps> = ({ onStationSelect }) => {
  const { 
    stations, 
    selectedStationId, 
    setSelectedStationId, 
    setIsStationDrawerOpen,
    setCurrentPage,
    injectFault 
  } = useSkyGuard();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | StationStatus>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'id' | 'temperature' | 'health' | 'status'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  const regions = ['ALL', ...Array.from(new Set(stations.map(s => s.region)))];

  const filteredStations = stations.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesRegion = regionFilter === 'ALL' || s.region === regionFilter;

    return matchesSearch && matchesStatus && matchesRegion;
  }).sort((a, b) => {
    let cmp = 0;
    if (sortField === 'id') cmp = a.id.localeCompare(b.id);
    else if (sortField === 'temperature') cmp = a.currentReadings.temperature - b.currentReadings.temperature;
    else if (sortField === 'health') cmp = a.healthScore - b.healthScore;
    else if (sortField === 'status') cmp = a.status.localeCompare(b.status);

    return sortAsc ? cmp : -cmp;
  });

  const handleRowClick = (station: Station) => {
    setSelectedStationId(station.id);
    setIsStationDrawerOpen(true);
    if (onStationSelect) onStationSelect(station.id);
  };

  return (
    <div className="rounded-2xl border border-[#294155] bg-[#0B1B2B] overflow-hidden shadow-2xl select-none">
      {/* Header Filters Bar */}
      <div className="p-4 border-b border-[#294155] bg-[#07111F]/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9FB0BF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search stations by name, code or ST-ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B1B2B] border border-[#294155] focus:border-[#38BDF8] text-xs font-mono text-white placeholder-[#9FB0BF] outline-none"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Status Filter */}
          <div className="flex rounded-lg bg-[#0B1B2B] p-1 border border-[#294155]">
            {(['ALL', 'NORMAL', 'SUSPICIOUS', 'ANOMALY'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  statusFilter === st
                    ? 'bg-[#142C40] text-[#38BDF8] border border-[#38BDF8]/40'
                    : 'text-[#9FB0BF] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Region Select */}
          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0B1B2B] border border-[#294155] text-xs text-[#9FB0BF] focus:text-white outline-none font-mono"
          >
            {regions.map(r => (
              <option key={r} value={r}>Region: {r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#102536] text-[#9FB0BF] text-[10px] uppercase tracking-wider border-b border-[#294155]">
            <tr>
              <th className="p-3.5 cursor-pointer" onClick={() => { setSortField('id'); setSortAsc(!sortAsc); }}>
                <div className="flex items-center gap-1.5">
                  <span>Station / Identity</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="p-3.5">Region & Elev</th>
              <th className="p-3.5 cursor-pointer" onClick={() => { setSortField('temperature'); setSortAsc(!sortAsc); }}>
                <div className="flex items-center gap-1.5">
                  <span>Temp (°C)</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="p-3.5">Pressure</th>
              <th className="p-3.5">Humidity</th>
              <th className="p-3.5 cursor-pointer" onClick={() => { setSortField('health'); setSortAsc(!sortAsc); }}>
                <div className="flex items-center gap-1.5">
                  <span>Health Score</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="p-3.5 cursor-pointer" onClick={() => { setSortField('status'); setSortAsc(!sortAsc); }}>
                <div className="flex items-center gap-1.5">
                  <span>QC Status</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#142C40] bg-[#0B1B2B]/60">
            {filteredStations.map(station => {
              const isSelected = station.id === selectedStationId;
              const isAnomaly = station.status === 'ANOMALY';
              const isSuspicious = station.status === 'SUSPICIOUS';

              return (
                <tr
                  key={station.id}
                  onClick={() => handleRowClick(station)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#102536] border-l-4 border-l-[#38BDF8]'
                      : 'hover:bg-[#102536]/80'
                  }`}
                >
                  {/* Station Code & Name */}
                  <td className="p-3.5 font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg border ${
                        isAnomaly ? 'bg-red-950/80 border-red-500 text-red-400' :
                        isSuspicious ? 'bg-amber-950/80 border-amber-500 text-amber-400' :
                        'bg-[#142C40] border-[#294155] text-[#38BDF8]'
                      }`}>
                        <Radio size={14} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-[#F8FAFC]">{station.id}</strong>
                          <span className="text-[10px] text-[#9FB0BF]">({station.code})</span>
                        </div>
                        <span className="text-[11px] text-[#9FB0BF] font-sans block truncate max-w-[160px]">
                          {station.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Region & Elevation */}
                  <td className="p-3.5 text-[#9FB0BF]">
                    <div>{station.region}</div>
                    <span className="text-[10px] text-[#38BDF8]">Elev: {station.elevationM}m</span>
                  </td>

                  {/* Temperature */}
                  <td className="p-3.5 font-bold">
                    <span className={`text-sm ${
                      station.currentReadings.temperature > 50 ? 'text-red-400' : 'text-[#38BDF8]'
                    }`}>
                      {station.currentReadings.temperature}°C
                    </span>
                  </td>

                  {/* Pressure */}
                  <td className="p-3.5 text-white">
                    {station.currentReadings.pressure} hPa
                  </td>

                  {/* Humidity */}
                  <td className="p-3.5 text-emerald-400 font-medium">
                    {station.currentReadings.humidity}%
                  </td>

                  {/* Health Score */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <HeartPulse size={14} className={station.healthScore < 80 ? 'text-amber-400' : 'text-emerald-400'} />
                      <span className={`font-bold ${station.healthScore < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {station.healthScore}%
                      </span>
                    </div>
                  </td>

                  {/* QC Status */}
                  <td className="p-3.5">
                    <StatusPill status={station.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setSelectedStationId(station.id);
                          setCurrentPage('station-detail');
                        }}
                        className="p-1.5 rounded-lg bg-[#142C40] hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#294155] transition-colors"
                        title="Open Deep Investigation"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => {
                          injectFault({
                            stationId: station.id,
                            parameter: 'TEMPERATURE',
                            faultType: 'SPIKE',
                            severityPercent: 90,
                            durationSeconds: 300,
                            customValue: 55.2
                          });
                        }}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 transition-colors"
                        title="Simulate Fault on Station"
                      >
                        <Sliders size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
