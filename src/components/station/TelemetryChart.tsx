import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import { generateStationTelemetrySeries } from '../../data/mockData';
import type { TelemetryReading } from '../../types';
import { 
  LineChart as ChartIcon, 
  Layers, 
  Info 
} from 'lucide-react';

interface TelemetryChartProps {
  stationId?: string;
  height?: string;
  onAnomalyPointClick?: (alertId?: string) => void;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  stationId,
  height = '380px',
  onAnomalyPointClick
}) => {
  const { 
    selectedStation, 
    selectedAlertId, 
    setSelectedAlertId, 
    setCurrentPage 
  } = useSkyGuard();

  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [activeMetric, setActiveMetric] = useState<'temperature' | 'pressure' | 'humidity'>('temperature');
  const [showConfidenceBands, setShowConfidenceBands] = useState(true);

  const targetStationId = stationId || selectedStation.id;
  const isTargetSpikeHero = targetStationId === 'ST-104';

  const telemetryData: TelemetryReading[] = useMemo(() => {
    return generateStationTelemetrySeries(
      targetStationId,
      selectedStation.currentReadings.temperature,
      selectedStation.currentReadings.pressure,
      selectedStation.currentReadings.humidity,
      isTargetSpikeHero
    );
  }, [targetStationId, selectedStation, isTargetSpikeHero]);

  const chartOption = useMemo(() => {
    const timestamps = telemetryData.map(d => d.timestamp);
    const values = telemetryData.map(d => 
      activeMetric === 'temperature' ? d.temperature :
      activeMetric === 'pressure' ? d.pressure : d.humidity
    );

    const minBounds = telemetryData.map(d => 
      activeMetric === 'temperature' ? d.expectedRanges?.tempMin ?? d.temperature - 2.5 :
      activeMetric === 'pressure' ? d.expectedRanges?.pressMin ?? d.pressure - 3 :
      d.expectedRanges?.rhMin ?? d.humidity - 8
    );

    const maxBounds = telemetryData.map(d => 
      activeMetric === 'temperature' ? d.expectedRanges?.tempMax ?? d.temperature + 2.5 :
      activeMetric === 'pressure' ? d.expectedRanges?.pressMax ?? d.pressure + 3 :
      d.expectedRanges?.rhMax ?? d.humidity + 8
    );

    const unit = activeMetric === 'temperature' ? '°C' : activeMetric === 'pressure' ? 'hPa' : '%';
    const lineColor = activeMetric === 'temperature' ? '#38BDF8' : activeMetric === 'pressure' ? '#A78BFA' : '#22C55E';

    // Mark anomalies
    const markPoints = telemetryData
      .filter(d => d.isAnomaly)
      .map(d => ({
        name: 'Critical Anomaly',
        coord: [d.timestamp, activeMetric === 'temperature' ? d.temperature : activeMetric === 'pressure' ? d.pressure : d.humidity],
        value: `${d.anomalyType ?? 'SPIKE'} (${activeMetric === 'temperature' ? d.temperature : d.humidity}${unit})`,
        itemStyle: {
          color: '#EF4444',
          borderColor: '#FEE2E2',
          borderWidth: 2,
          shadowBlur: 15,
          shadowColor: '#EF4444'
        },
        label: {
          show: true,
          formatter: '🚨 {b}\n{c}',
          color: '#FEE2E2',
          fontSize: 10,
          fontWeight: 'bold',
          backgroundColor: 'rgba(11, 27, 43, 0.95)',
          borderColor: '#EF4444',
          borderWidth: 1,
          borderRadius: 6,
          padding: [4, 6]
        }
      }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0B1B2B',
        borderColor: '#294155',
        borderWidth: 1,
        textStyle: {
          color: '#F8FAFC',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12
        },
        formatter: (params: any[]) => {
          if (!params || params.length === 0) return '';
          const point = params[0];
          const rawItem = telemetryData[point.dataIndex];
          const isPointAnomaly = rawItem?.isAnomaly;

          let html = `<div style="font-weight:bold; color:#38BDF8; margin-bottom:4px;">⏱ ${point.axisValue} • ${targetStationId}</div>`;
          html += `<div style="display:flex; justify-content:space-between; gap:16px;">
            <span style="color:#9FB0BF;">Observed ${activeMetric.toUpperCase()}:</span>
            <span style="font-weight:bold; color:${isPointAnomaly ? '#EF4444' : '#F8FAFC'}">${point.value} ${unit}</span>
          </div>`;

          if (rawItem?.expectedRanges) {
            const expMin = activeMetric === 'temperature' ? rawItem.expectedRanges.tempMin : activeMetric === 'pressure' ? rawItem.expectedRanges.pressMin : rawItem.expectedRanges.rhMin;
            const expMax = activeMetric === 'temperature' ? rawItem.expectedRanges.tempMax : activeMetric === 'pressure' ? rawItem.expectedRanges.pressMax : rawItem.expectedRanges.rhMax;
            html += `<div style="display:flex; justify-content:space-between; gap:16px; font-size:11px; color:#9FB0BF; margin-top:2px;">
              <span>Expected Range:</span>
              <span>[${expMin} - ${expMax}] ${unit}</span>
            </div>`;
          }

          if (isPointAnomaly) {
            html += `<div style="margin-top:6px; padding:4px 8px; background:rgba(239,68,68,0.2); border:1px solid #EF4444; border-radius:6px; color:#F87171; font-weight:bold; font-size:10px;">
              🚨 CONFIRMED ${rawItem.anomalyType} ANOMALY (Confidence: ${(rawItem.confidence! * 100).toFixed(1)}%)<br/>
              👉 Click point to inspect 5-Pillar Evidence
            </div>`;
          }

          return html;
        }
      },
      grid: {
        top: '12%',
        left: '4%',
        right: '4%',
        bottom: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timestamps,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#294155' } },
        axisLabel: { color: '#9FB0BF', fontSize: 10, fontFamily: 'JetBrains Mono' },
        splitLine: { show: true, lineStyle: { color: '#102536', type: 'dashed' } }
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLine: { lineStyle: { color: '#294155' } },
        axisLabel: {
          color: '#9FB0BF',
          fontSize: 10,
          fontFamily: 'JetBrains Mono',
          formatter: `{value} ${unit}`
        },
        splitLine: { lineStyle: { color: '#102536', type: 'dashed' } }
      },
      series: [
        ...(showConfidenceBands ? [
          {
            name: 'Confidence Upper',
            type: 'line',
            data: maxBounds,
            lineStyle: { opacity: 0 },
            stack: 'confidence-band',
            symbol: 'none'
          },
          {
            name: 'Expected Confidence Envelope (±2.5σ)',
            type: 'line',
            data: minBounds.map((min, idx) => maxBounds[idx] - min),
            lineStyle: { opacity: 0 },
            areaStyle: {
              color: 'rgba(56, 189, 248, 0.08)'
            },
            stack: 'confidence-band',
            symbol: 'none'
          }
        ] : []),
        {
          name: `Observed ${activeMetric}`,
          type: 'line',
          data: values,
          smooth: true,
          showSymbol: true,
          symbolSize: 4,
          lineStyle: {
            color: lineColor,
            width: 2.5,
            shadowColor: lineColor,
            shadowBlur: 10
          },
          itemStyle: {
            color: lineColor
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${lineColor}33` },
                { offset: 1, color: 'transparent' }
              ]
            }
          },
          markPoint: {
            data: markPoints
          }
        }
      ]
    };
  }, [telemetryData, activeMetric, showConfidenceBands, targetStationId]);

  const onChartClick = (params: any) => {
    if (params.componentType === 'markPoint' || (params.data && params.data.isAnomaly)) {
      if (onAnomalyPointClick) {
        onAnomalyPointClick(selectedAlertId);
      } else {
        setSelectedAlertId('ALT-2026-8801');
        setCurrentPage('alert-detail');
      }
    }
  };

  return (
    <div className="rounded-2xl border border-[#294155] bg-[#0B1B2B]/90 p-5 shadow-2xl backdrop-blur-md">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#142C40] border border-[#294155] text-[#38BDF8]">
            <ChartIcon size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#F8FAFC] font-mono tracking-tight">
                High-Frequency Telemetry & QC Envelope
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#102536] text-[#38BDF8] border border-[#294155]">
                {targetStationId}
              </span>
            </div>
            <p className="text-[11px] text-[#9FB0BF]">
              Real-time WMO threshold bands and AI anomaly annotations
            </p>
          </div>
        </div>

        {/* Metric Switcher & Range Picker */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Parameter Select */}
          <div className="flex rounded-lg bg-[#07111F] p-1 border border-[#294155]">
            <button
              onClick={() => setActiveMetric('temperature')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeMetric === 'temperature'
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] font-bold border border-[#38BDF8]/40'
                  : 'text-[#9FB0BF] hover:text-white'
              }`}
            >
              Temp (°C)
            </button>
            <button
              onClick={() => setActiveMetric('pressure')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeMetric === 'pressure'
                  ? 'bg-[#A78BFA]/20 text-[#A78BFA] font-bold border border-[#A78BFA]/40'
                  : 'text-[#9FB0BF] hover:text-white'
              }`}
            >
              Pressure (hPa)
            </button>
            <button
              onClick={() => setActiveMetric('humidity')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeMetric === 'humidity'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                  : 'text-[#9FB0BF] hover:text-white'
              }`}
            >
              RH (%)
            </button>
          </div>

          {/* Confidence Envelope Toggle */}
          <button
            onClick={() => setShowConfidenceBands(!showConfidenceBands)}
            title="Toggle Confidence Envelope Bands"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] transition-colors ${
              showConfidenceBands
                ? 'bg-[#142C40] border-[#38BDF8]/50 text-[#38BDF8]'
                : 'bg-[#07111F] border-[#294155] text-[#9FB0BF]'
            }`}
          >
            <Layers size={13} />
            <span>±2.5σ Bounds</span>
          </button>

          {/* Time Range */}
          <div className="flex rounded-lg bg-[#07111F] p-1 border border-[#294155]">
            {(['1h', '6h', '24h', '7d'] as const).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2 py-1 rounded-md text-[11px] transition-colors ${
                  timeRange === r
                    ? 'bg-[#142C40] text-white font-bold'
                    : 'text-[#9FB0BF] hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive ECharts Surface */}
      <div style={{ height }}>
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          onEvents={{ click: onChartClick }}
        />
      </div>

      {/* Footer Info Notice */}
      <div className="mt-2 pt-2.5 border-t border-[#142C40] flex items-center justify-between text-xs font-mono text-[#9FB0BF]">
        <span className="flex items-center gap-1.5">
          <Info size={13} className="text-[#38BDF8]" />
          <span>Click any red anomaly marker to open the 5-Pillar Root Cause Evidence</span>
        </span>
        <span className="text-[#38BDF8] font-bold">
          Ingestion Sampling: 15s • QC Latency: 3.2ms
        </span>
      </div>
    </div>
  );
};
