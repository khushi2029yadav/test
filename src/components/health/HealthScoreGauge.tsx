import React from 'react';
import type { SensorHealthRecord } from '../../types';
import { 
  Thermometer, 
  Gauge, 
  Droplets, 
  Wind, 
  Battery 
} from 'lucide-react';

interface HealthScoreGaugeProps {
  healthRecord: SensorHealthRecord;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ healthRecord }) => {
  const score = healthRecord.overallScore;
  const isUrgent = score < 70;
  const isWarn = score >= 70 && score < 85;

  const strokeDash = 2 * Math.PI * 54;
  const strokeOffset = strokeDash - (strokeDash * score) / 100;

  const getSubsystemStatusBadge = (status: 'GOOD' | 'WARN' | 'CRITICAL') => {
    switch (status) {
      case 'GOOD':
        return <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">GOOD</span>;
      case 'WARN':
        return <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">WARN</span>;
      case 'CRITICAL':
        return <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/50 animate-pulse">CRITICAL</span>;
    }
  };

  const subsystems = [
    {
      name: 'Temperature RTD (PT100)',
      icon: Thermometer,
      data: healthRecord.subsystems.tempRTD,
      metricLabel: 'Drift Rate: ' + healthRecord.subsystems.tempRTD.driftRate
    },
    {
      name: 'Barometer MEMS Transducer',
      icon: Gauge,
      data: healthRecord.subsystems.barometerMEMS,
      metricLabel: 'Diaphragm: ' + healthRecord.subsystems.barometerMEMS.noiseFloor
    },
    {
      name: 'Hygrometer Capacitive Polymer',
      icon: Droplets,
      data: healthRecord.subsystems.hygrometerCapacitive,
      metricLabel: 'Drift: ' + healthRecord.subsystems.hygrometerCapacitive.driftRate
    },
    {
      name: 'Ultrasonic 2D Anemometer',
      icon: Wind,
      data: healthRecord.subsystems.anemometerSonic,
      metricLabel: 'Transducer: Clean'
    },
    {
      name: 'Solar MPPT & LiFePO4 Battery',
      icon: Battery,
      data: healthRecord.subsystems.powerSystem,
      metricLabel: healthRecord.subsystems.powerSystem.batteryHealth
    }
  ];

  return (
    <div className="rounded-2xl border border-[#294155] bg-[#0B1B2B] p-5 shadow-2xl space-y-5 select-none">
      {/* Top Section with Radial Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-[#294155]">
        <div className="flex items-center gap-5">
          {/* Circular SVG Gauge */}
          <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                className="stroke-[#142C40]"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                className={`transition-all duration-1000 ease-out ${
                  isUrgent ? 'stroke-red-500' : isWarn ? 'stroke-amber-400' : 'stroke-emerald-400'
                }`}
                strokeWidth="10"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center font-mono">
              <span className={`text-3xl font-bold ${
                isUrgent ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {score}
              </span>
              <span className="text-[10px] text-[#9FB0BF] uppercase font-bold">Health</span>
            </div>
          </div>

          {/* Health Info Details */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#F8FAFC] font-mono">
                {healthRecord.stationName}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#102536] text-[#38BDF8] border border-[#294155]">
                {healthRecord.stationId}
              </span>
            </div>

            <div className="mt-2 space-y-1 text-xs font-mono">
              <div className="text-[#9FB0BF]">
                Maintenance Priority: <strong className={isUrgent ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}>{healthRecord.maintenancePriority}</strong>
              </div>
              <div className="text-[#9FB0BF]">
                Predicted MTBF: <strong className="text-white">{healthRecord.predictedMTBFDays} Days</strong>
              </div>
              <div className="text-[#9FB0BF]">
                Monthly Degradation Velocity: <strong className="text-red-400">{healthRecord.degradationRatePerMonth}% / mo</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Calibration Due Box */}
        <div className="p-3.5 rounded-xl bg-[#07111F] border border-[#294155] font-mono text-xs space-y-1.5 min-w-[200px]">
          <span className="text-[10px] font-bold text-[#9FB0BF] uppercase block">
            Calibration Schedule
          </span>
          <div className="flex justify-between text-[#9FB0BF]">
            <span>Last Calibrated:</span>
            <span className="text-white">{healthRecord.lastCalibrated}</span>
          </div>
          <div className="flex justify-between text-[#9FB0BF]">
            <span>Next Due:</span>
            <span className={healthRecord.nextCalibrationDue.includes('OVERDUE') ? 'text-red-400 font-bold' : 'text-[#38BDF8]'}>
              {healthRecord.nextCalibrationDue}
            </span>
          </div>
        </div>
      </div>

      {/* Subsystem Health Breakdown */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider font-mono text-[#9FB0BF] block">
          Sensor Subsystem Micro-Diagnostics
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {subsystems.map((sub, idx) => {
            const Icon = sub.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#07111F] border border-[#294155] flex items-center justify-between gap-3 hover:border-[#38BDF8]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#102536] text-[#38BDF8]">
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block truncate max-w-[180px]">
                      {sub.name}
                    </span>
                    <span className="text-[10px] text-[#9FB0BF]">
                      {sub.metricLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className={`text-sm font-bold ${
                    sub.data.status === 'CRITICAL' ? 'text-red-400' : sub.data.status === 'WARN' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {sub.data.score}%
                  </span>
                  {getSubsystemStatusBadge(sub.data.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
