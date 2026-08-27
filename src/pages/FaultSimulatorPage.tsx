import React, { useState } from 'react';
import { useSkyGuard } from '../context/SkyGuardContext';
import { FaultPipelineVisualizer } from '../components/simulator/FaultPipelineVisualizer';
import type { ParameterType, RootCauseType } from '../types';
import { 
  Zap, 
  SunMedium, 
  TrendingUp, 
  Snowflake, 
  Play 
} from 'lucide-react';

export const FaultSimulatorPage: React.FC = () => {
  const { 
    stations, 
    injectFault, 
    isPipelineActive 
  } = useSkyGuard();

  const [selectedStation, setSelectedStation] = useState<string>('ST-104');
  const [selectedParam, setSelectedParam] = useState<ParameterType>('TEMPERATURE');
  const [selectedFaultType, setSelectedFaultType] = useState<RootCauseType>('SPIKE');
  const [severityPercent, setSeverityPercent] = useState<number>(95);
  const [durationSeconds, setDurationSeconds] = useState<number>(300);
  const [customValue, setCustomValue] = useState<string>('55.2');

  const handleInject = () => {
    injectFault({
      stationId: selectedStation,
      parameter: selectedParam,
      faultType: selectedFaultType,
      severityPercent,
      durationSeconds,
      customValue: customValue ? parseFloat(customValue) : undefined
    });
  };

  const applyPreset = (
    stationId: string,
    param: ParameterType,
    fault: RootCauseType,
    val: string,
    severity: number
  ) => {
    setSelectedStation(stationId);
    setSelectedParam(param);
    setSelectedFaultType(fault);
    setCustomValue(val);
    setSeverityPercent(severity);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F8FAFC] font-mono tracking-tight">
              AI/ML Fault Simulation & Pipeline Stress-Test Engine
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
              Interactive Testbed
            </span>
          </div>
          <p className="text-xs text-[#9FB0BF] mt-1">
            Inject synthetic faults or genuine weather anomalies to evaluate end-to-end QC and spatial Kriging reaction
          </p>
        </div>
      </div>

      {/* Quick Hero Presets Bar */}
      <div className="p-4 rounded-2xl bg-[#0B1B2B] border border-[#294155] space-y-2.5 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider font-mono text-[#38BDF8] block">
          One-Click Benchmark Scenarios
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Preset 1 */}
          <button
            onClick={() => applyPreset('ST-104', 'TEMPERATURE', 'SPIKE', '55.2', 95)}
            className={`p-3 rounded-xl border text-left transition-all font-mono text-xs ${
              selectedFaultType === 'SPIKE' && selectedStation === 'ST-104'
                ? 'bg-red-950/80 border-red-500 text-white shadow-md'
                : 'bg-[#07111F] border-[#142C40] text-[#9FB0BF] hover:border-red-500/60'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-red-400 mb-1">
              <Zap size={13} />
              <span>Hero 1: ST-104 Spike (55°C)</span>
            </div>
            <span className="text-[11px] text-[#9FB0BF] block">Local RTD open circuit fault</span>
          </button>

          {/* Preset 2 */}
          <button
            onClick={() => applyPreset('ST-109', 'TEMPERATURE', 'GENUINE_WEATHER', '45.4', 85)}
            className={`p-3 rounded-xl border text-left transition-all font-mono text-xs ${
              selectedFaultType === 'GENUINE_WEATHER' && selectedStation === 'ST-109'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                : 'bg-[#07111F] border-[#142C40] text-[#9FB0BF] hover:border-emerald-500/60'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
              <SunMedium size={13} />
              <span>Hero 2: ST-109 Heatwave (45°C)</span>
            </div>
            <span className="text-[11px] text-[#9FB0BF] block">Synoptic agreement verified</span>
          </button>

          {/* Preset 3 */}
          <button
            onClick={() => applyPreset('ST-105', 'PRESSURE', 'DRIFT', '782.5', 80)}
            className={`p-3 rounded-xl border text-left transition-all font-mono text-xs ${
              selectedFaultType === 'DRIFT' && selectedStation === 'ST-105'
                ? 'bg-amber-950/80 border-amber-500 text-white shadow-md'
                : 'bg-[#07111F] border-[#142C40] text-[#9FB0BF] hover:border-amber-500/60'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
              <TrendingUp size={13} />
              <span>ST-105 Barometer Drift</span>
            </div>
            <span className="text-[11px] text-[#9FB0BF] block">-0.42 hPa/hr diaphragm leak</span>
          </button>

          {/* Preset 4 */}
          <button
            onClick={() => applyPreset('ST-106', 'TEMPERATURE', 'FREEZE', '18.6', 90)}
            className={`p-3 rounded-xl border text-left transition-all font-mono text-xs ${
              selectedFaultType === 'FREEZE' && selectedStation === 'ST-106'
                ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-md'
                : 'bg-[#07111F] border-[#142C40] text-[#9FB0BF] hover:border-cyan-500/60'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-cyan-400 mb-1">
              <Snowflake size={13} />
              <span>ST-106 Frozen Value (18.6°C)</span>
            </div>
            <span className="text-[11px] text-[#9FB0BF] block">ADC register stuck state</span>
          </button>
        </div>
      </div>

      {/* Simulator Injection Controls */}
      <div className="p-5 rounded-2xl border border-[#294155] bg-[#0B1B2B] shadow-2xl space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white pb-3 border-b border-[#294155]">
          Simulation Parameter Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Target Station Select */}
          <div className="space-y-1.5">
            <label className="text-[#9FB0BF]">Target AWS Node:</label>
            <select
              value={selectedStation}
              onChange={e => setSelectedStation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#07111F] border border-[#294155] text-white focus:border-[#38BDF8] outline-none"
            >
              {stations.map(s => (
                <option key={s.id} value={s.id}>
                  {s.id} — {s.name} ({s.region})
                </option>
              ))}
            </select>
          </div>

          {/* Target Parameter */}
          <div className="space-y-1.5">
            <label className="text-[#9FB0BF]">Meteorological Parameter:</label>
            <select
              value={selectedParam}
              onChange={e => setSelectedParam(e.target.value as ParameterType)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#07111F] border border-[#294155] text-white focus:border-[#38BDF8] outline-none"
            >
              <option value="TEMPERATURE">Temperature (°C)</option>
              <option value="PRESSURE">Atmospheric Pressure (hPa)</option>
              <option value="HUMIDITY">Relative Humidity (%)</option>
              <option value="WIND_SPEED">Wind Velocity (m/s)</option>
              <option value="PRECIPITATION">Precipitation Rate (mm/h)</option>
            </select>
          </div>

          {/* Fault Model */}
          <div className="space-y-1.5">
            <label className="text-[#9FB0BF]">Anomaly / Fault Type:</label>
            <select
              value={selectedFaultType}
              onChange={e => setSelectedFaultType(e.target.value as RootCauseType)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#07111F] border border-[#294155] text-white focus:border-[#38BDF8] outline-none"
            >
              <option value="SPIKE">Transient Thermal Spike (RTD Open Circuit)</option>
              <option value="GENUINE_WEATHER">Likely Genuine Regional Weather (Heatwave)</option>
              <option value="DRIFT">Continuous Monotonic Sensor Drift</option>
              <option value="FREEZE">ADC Register Stuck Value (Freeze)</option>
              <option value="BIAS">Systematic Calibration Bias Offset</option>
              <option value="NOISE">High-Variance Transducer Noise</option>
              <option value="DROPOUT">LoRaWAN/MQTT Packet Dropout</option>
            </select>
          </div>
        </div>

        {/* Sliders for Severity & Target Value */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3 border-t border-[#142C40] font-mono text-xs">
          {/* Target Injected Value */}
          <div className="space-y-1.5">
            <label className="text-[#9FB0BF]">Target Injected Value:</label>
            <input
              type="number"
              step="0.1"
              value={customValue}
              onChange={e => setCustomValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#07111F] border border-[#294155] text-white focus:border-[#38BDF8] outline-none"
            />
          </div>

          {/* Severity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#9FB0BF]">
              <span>Anomaly Magnitude / Severity:</span>
              <strong className="text-[#38BDF8]">{severityPercent}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={severityPercent}
              onChange={e => setSeverityPercent(parseInt(e.target.value))}
              className="w-full accent-[#38BDF8]"
            />
          </div>

          {/* Duration Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#9FB0BF]">
              <span>Simulation Duration:</span>
              <strong className="text-white">{durationSeconds}s ({Math.round(durationSeconds / 60)} min)</strong>
            </div>
            <input
              type="range"
              min="30"
              max="1800"
              step="30"
              value={durationSeconds}
              onChange={e => setDurationSeconds(parseInt(e.target.value))}
              className="w-full accent-[#38BDF8]"
            />
          </div>
        </div>

        {/* Trigger Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={handleInject}
            disabled={isPipelineActive}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95 disabled:opacity-50"
          >
            <Play size={14} className="fill-current" />
            <span>{isPipelineActive ? 'Executing QC Pipeline...' : 'Inject Fault Into Live Stream'}</span>
          </button>
        </div>
      </div>

      {/* Live Animated Pipeline Visualizer */}
      <FaultPipelineVisualizer />
    </div>
  );
};
