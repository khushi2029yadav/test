import React from 'react';
import type { Station } from '../../types';
import { 
  Thermometer, 
  Gauge, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain, 
  ShieldCheck, 
  AlertOctagon, 
  Zap 
} from 'lucide-react';

interface CurrentReadingsProps {
  station: Station;
  onInjectFaultClick?: () => void;
}

export const CurrentReadings: React.FC<CurrentReadingsProps> = ({ 
  station,
  onInjectFaultClick 
}) => {
  const readings = station.currentReadings;
  const isAnomaly = station.status === 'ANOMALY';
  const isSuspicious = station.status === 'SUSPICIOUS';

  const metrics = [
    {
      label: 'Temperature',
      value: readings.temperature,
      unit: '°C',
      icon: Thermometer,
      isFlagged: isAnomaly && readings.temperature > 50,
      minMax: 'Min: 18.2°C • Max: 55.2°C',
      qcStatus: isAnomaly && readings.temperature > 50 ? 'WMO Step Limit Violated' : 'Pass (WMO-No. 8)',
      color: isAnomaly && readings.temperature > 50 ? 'text-red-400' : 'text-[#38BDF8]',
      border: isAnomaly && readings.temperature > 50 ? 'border-red-500/80 bg-red-950/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-[#294155] bg-[#0B1B2B]'
    },
    {
      label: 'Atmospheric Pressure',
      value: readings.pressure,
      unit: 'hPa',
      icon: Gauge,
      isFlagged: isSuspicious && readings.pressure < 790,
      minMax: 'Min: 782.5 hPa • Max: 1012.0 hPa',
      qcStatus: isSuspicious && readings.pressure < 790 ? 'Drift Warning (-0.42 hPa/hr)' : 'Pass (Barometric Norm)',
      color: isSuspicious && readings.pressure < 790 ? 'text-amber-400' : 'text-[#A78BFA]',
      border: isSuspicious && readings.pressure < 790 ? 'border-amber-500/80 bg-amber-950/40' : 'border-[#294155] bg-[#0B1B2B]'
    },
    {
      label: 'Relative Humidity',
      value: readings.humidity,
      unit: '%',
      icon: Droplets,
      isFlagged: isAnomaly && readings.humidity < 15,
      minMax: 'Min: 12.0% • Max: 88.4%',
      qcStatus: isAnomaly && readings.humidity < 15 ? 'Dew Point Inconsistent' : 'Pass (Psychrometric)',
      color: 'text-[#22C55E]',
      border: 'border-[#294155] bg-[#0B1B2B]'
    },
    {
      label: 'Wind Velocity',
      value: readings.windSpeed,
      unit: 'm/s',
      icon: Wind,
      isFlagged: false,
      minMax: 'Gust: 5.4 m/s • 10m Mast',
      qcStatus: 'Pass (Sonic Anemometer)',
      color: 'text-cyan-300',
      border: 'border-[#294155] bg-[#0B1B2B]'
    },
    {
      label: 'Solar Irradiance',
      value: readings.solarIrradiance,
      unit: 'W/m²',
      icon: Sun,
      isFlagged: false,
      minMax: 'Zenith Peak: 950 W/m²',
      qcStatus: 'Pass (Kipp & Zonen CMP11)',
      color: 'text-yellow-400',
      border: 'border-[#294155] bg-[#0B1B2B]'
    },
    {
      label: 'Precipitation Rate',
      value: readings.precipitation,
      unit: 'mm/h',
      icon: CloudRain,
      isFlagged: false,
      minMax: '24h Total: 0.0 mm',
      qcStatus: 'Pass (Tipping Bucket 0.2mm)',
      color: 'text-blue-400',
      border: 'border-[#294155] bg-[#0B1B2B]'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#38BDF8]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
            Real-Time Sensor Telemetry Matrix
          </h3>
        </div>
        {onInjectFaultClick && (
          <button
            onClick={onInjectFaultClick}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 text-red-300 text-xs font-mono font-bold transition-colors"
          >
            <Zap size={12} className="text-red-400" />
            <span>Inject Fault On Station</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${m.border} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#9FB0BF] font-semibold truncate">
                  {m.label}
                </span>
                <Icon size={16} className={m.color} />
              </div>

              <div className="flex items-baseline gap-1 my-1">
                <span className={`text-xl lg:text-2xl font-bold font-mono tracking-tight ${m.color}`}>
                  {m.value}
                </span>
                <span className="text-xs font-mono text-[#9FB0BF]">
                  {m.unit}
                </span>
              </div>

              <div className="pt-2 mt-1 border-t border-[#142C40] space-y-1">
                <div className="text-[10px] font-mono text-[#9FB0BF] truncate">
                  {m.minMax}
                </div>
                <div
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                    m.isFlagged
                      ? 'bg-red-950 text-red-400 border border-red-500/50'
                      : 'bg-[#102536] text-emerald-400'
                  }`}
                >
                  {m.isFlagged ? <AlertOctagon size={10} className="shrink-0 animate-bounce" /> : <ShieldCheck size={10} className="shrink-0" />}
                  <span className="truncate">{m.qcStatus}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
