import React from 'react';
import { useSkyGuard } from '../context/SkyGuardContext';
import { SENSOR_HEALTH_DATA } from '../data/mockData';
import { HealthScoreGauge } from '../components/health/HealthScoreGauge';
import { HealthTrendChart } from '../components/health/HealthTrendChart';
import { MaintenanceCard } from '../components/health/MaintenanceCard';
import { Activity } from 'lucide-react';

export const SensorHealthPage: React.FC = () => {
  const { stations, selectedStationId, setSelectedStationId } = useSkyGuard();

  const activeHealthRecord = SENSOR_HEALTH_DATA[selectedStationId] || SENSOR_HEALTH_DATA['ST-104'];

  const averageNetworkHealth = Math.round(
    stations.reduce((acc, s) => acc + s.healthScore, 0) / stations.length
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F8FAFC] font-mono tracking-tight">
              Sensor Health & Predictive Maintenance Center
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#102536] text-[#38BDF8] border border-[#294155]">
              Network Score: {averageNetworkHealth}%
            </span>
          </div>
          <p className="text-xs text-[#9FB0BF] mt-1">
            Component-level drift velocity, transducer degradation modeling and automated maintenance scheduling
          </p>
        </div>

        {/* Station Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-lg font-mono text-xs p-1 rounded-xl bg-[#0B1B2B] border border-[#294155]">
          {stations.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStationId(s.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-colors ${
                s.id === selectedStationId
                  ? 'bg-[#142C40] text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm'
                  : 'text-[#9FB0BF] hover:text-white'
              }`}
            >
              {s.id} ({s.healthScore}%)
            </button>
          ))}
        </div>
      </div>

      {/* Main Selected Station Health Score Gauge & Diagnostics */}
      <HealthScoreGauge healthRecord={activeHealthRecord} />

      {/* Grid: Degradation Trend Chart & Field Maintenance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthTrendChart stationId={activeHealthRecord.stationId} />
        <MaintenanceCard healthRecord={activeHealthRecord} />
      </div>

      {/* Fault History Log Table */}
      <div className="p-5 rounded-2xl border border-[#294155] bg-[#0B1B2B] shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#294155]">
          <div className="flex items-center gap-2 text-amber-400">
            <Activity size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Historical Sensor Fault Log ({activeHealthRecord.stationId})
            </h3>
          </div>
          <span className="text-xs font-mono text-[#9FB0BF]">
            Last 90 Days Hardware Audit
          </span>
        </div>

        {activeHealthRecord.faultHistory.length === 0 ? (
          <p className="text-xs font-mono text-[#9FB0BF] py-6 text-center">
            No historical hardware faults recorded for this station. Sensor operating at optimal baseline.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#102536] text-[#9FB0BF] text-[10px] uppercase border-b border-[#294155]">
                <tr>
                  <th className="p-3">Event ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Fault Classification</th>
                  <th className="p-3">Impacted Parameter</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3 text-right">Resolution Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#142C40] bg-[#07111F]">
                {activeHealthRecord.faultHistory.map(fh => (
                  <tr key={fh.id} className="hover:bg-[#0B1B2B] transition-colors">
                    <td className="p-3 font-bold text-[#38BDF8]">{fh.id}</td>
                    <td className="p-3 text-[#9FB0BF]">{fh.date}</td>
                    <td className="p-3 font-bold text-red-400">{fh.faultType}</td>
                    <td className="p-3 text-white">{fh.parameter}</td>
                    <td className="p-3 text-[#9FB0BF]">{fh.durationMinutes} min</td>
                    <td className="p-3 text-right text-emerald-400 font-medium">{fh.resolvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
