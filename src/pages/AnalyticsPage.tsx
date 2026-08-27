import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useSkyGuard } from '../context/SkyGuardContext';
import { 
  BarChart, 
  PieChart, 
  Boxes 
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { stations, alerts } = useSkyGuard();
  const [selectedParam, setSelectedParam] = useState<'temperature' | 'pressure' | 'humidity'>('temperature');

  // Fault Distribution Data
  const faultCounts = {
    SPIKE: alerts.filter(a => a.rootCause === 'SPIKE').length,
    DRIFT: alerts.filter(a => a.rootCause === 'DRIFT').length,
    FREEZE: alerts.filter(a => a.rootCause === 'FREEZE').length,
    BIAS: alerts.filter(a => a.rootCause === 'BIAS').length,
    NOISE: alerts.filter(a => a.rootCause === 'NOISE').length,
    DROPOUT: alerts.filter(a => a.rootCause === 'DROPOUT').length,
    GENUINE_WEATHER: alerts.filter(a => a.rootCause === 'GENUINE_WEATHER').length,
  };

  // Fault Distribution Donut Chart
  const donutOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0B1B2B',
      borderColor: '#294155',
      textStyle: { color: '#F8FAFC', fontFamily: 'JetBrains Mono' }
    },
    legend: {
      bottom: '0%',
      textStyle: { color: '#9FB0BF', fontSize: 10, fontFamily: 'JetBrains Mono' }
    },
    series: [
      {
        name: 'Fault Classification',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#07111F',
          borderWidth: 2
        },
        label: { show: false },
        data: [
          { value: Math.max(1, faultCounts.SPIKE), name: 'Spike Fault', itemStyle: { color: '#EF4444' } },
          { value: Math.max(1, faultCounts.DRIFT), name: 'Sensor Drift', itemStyle: { color: '#F59E0B' } },
          { value: Math.max(1, faultCounts.GENUINE_WEATHER), name: 'Genuine Weather', itemStyle: { color: '#22C55E' } },
          { value: 1, name: 'Freeze / Stuck', itemStyle: { color: '#38BDF8' } },
          { value: 1, name: 'High Noise', itemStyle: { color: '#A78BFA' } }
        ]
      }
    ]
  };

  // Station Comparison Bar Chart
  const barOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0B1B2B',
      borderColor: '#294155',
      textStyle: { color: '#F8FAFC', fontFamily: 'JetBrains Mono' },
      axisPointer: { type: 'shadow' }
    },
    grid: {
      top: '10%',
      left: '4%',
      right: '4%',
      bottom: '14%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: stations.map(s => s.id),
      axisLine: { lineStyle: { color: '#294155' } },
      axisLabel: { color: '#9FB0BF', fontSize: 10, fontFamily: 'JetBrains Mono' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#294155' } },
      axisLabel: { color: '#9FB0BF', fontSize: 10, fontFamily: 'JetBrains Mono' },
      splitLine: { lineStyle: { color: '#102536', type: 'dashed' } }
    },
    series: [
      {
        name: selectedParam.toUpperCase(),
        type: 'bar',
        data: stations.map(s => 
          selectedParam === 'temperature' ? s.currentReadings.temperature :
          selectedParam === 'pressure' ? s.currentReadings.pressure : s.currentReadings.humidity
        ),
        itemStyle: {
          color: (params: any) => {
            const station = stations[params.dataIndex];
            if (station.status === 'ANOMALY') return '#EF4444';
            if (station.status === 'SUSPICIOUS') return '#F59E0B';
            return '#38BDF8';
          },
          borderRadius: [6, 6, 0, 0]
        }
      }
    ]
  };

  // Multivariate T vs P vs RH Scatter Matrix
  const scatterOption = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: '#0B1B2B',
      borderColor: '#294155',
      textStyle: { color: '#F8FAFC', fontFamily: 'JetBrains Mono' },
      formatter: (params: any) => {
        const d = params.data;
        return `<div style="font-weight:bold; color:#38BDF8;">${d[3]} (${d[4]})</div>
        <div>Temp: <strong>${d[0]}°C</strong></div>
        <div>Pressure: <strong>${d[1]} hPa</strong></div>
        <div>Humidity: <strong>${d[2]}%</strong></div>`;
      }
    },
    grid: {
      top: '12%',
      left: '6%',
      right: '6%',
      bottom: '12%',
      containLabel: true
    },
    xAxis: {
      name: 'Temperature (°C)',
      nameLocation: 'middle',
      nameGap: 24,
      nameTextStyle: { color: '#9FB0BF', fontFamily: 'JetBrains Mono', fontSize: 10 },
      type: 'value',
      scale: true,
      axisLine: { lineStyle: { color: '#294155' } },
      axisLabel: { color: '#9FB0BF', fontFamily: 'JetBrains Mono' },
      splitLine: { lineStyle: { color: '#102536', type: 'dashed' } }
    },
    yAxis: {
      name: 'Atmospheric Pressure (hPa)',
      nameLocation: 'middle',
      nameGap: 36,
      nameTextStyle: { color: '#9FB0BF', fontFamily: 'JetBrains Mono', fontSize: 10 },
      type: 'value',
      scale: true,
      axisLine: { lineStyle: { color: '#294155' } },
      axisLabel: { color: '#9FB0BF', fontFamily: 'JetBrains Mono' },
      splitLine: { lineStyle: { color: '#102536', type: 'dashed' } }
    },
    series: [
      {
        name: 'Stations',
        type: 'scatter',
        symbolSize: (data: any[]) => Math.max(16, data[2] / 3), // sized by RH
        data: stations.map(s => [
          s.currentReadings.temperature,
          s.currentReadings.pressure,
          s.currentReadings.humidity,
          s.id,
          s.name
        ]),
        itemStyle: {
          color: (params: any) => {
            const temp = params.data[0];
            if (temp > 50) return '#EF4444';
            if (temp > 40) return '#F59E0B';
            return '#38BDF8';
          },
          shadowBlur: 10,
          shadowColor: 'rgba(56,189,248,0.5)'
        }
      }
    ]
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC] font-mono tracking-tight">
            Network Analytics & Multivariate Thermodynamic Exploration
          </h2>
          <p className="text-xs text-[#9FB0BF] mt-1">
            Cross-station correlation, spatial buddy deviations and anomaly root cause distribution
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex rounded-xl bg-[#0B1B2B] p-1 border border-[#294155] font-mono text-xs">
          {(['temperature', 'pressure', 'humidity'] as const).map(p => (
            <button
              key={p}
              onClick={() => setSelectedParam(p)}
              className={`px-3 py-1.5 rounded-lg capitalize font-bold transition-colors ${
                selectedParam === p
                  ? 'bg-[#142C40] text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm'
                  : 'text-[#9FB0BF] hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Station Comparison Bar & Fault Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Station Cross-Comparison Bar (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-[#294155] bg-[#0B1B2B] shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#294155]">
            <div className="flex items-center gap-2 text-[#38BDF8]">
              <BarChart size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                Live Parameter Distribution Across 10 AWS Nodes ({selectedParam.toUpperCase()})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-red-400 font-bold">
              Red = Confirmed Outlier
            </span>
          </div>

          <div className="h-72 w-full">
            <ReactECharts option={barOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Fault Distribution Donut (1 col) */}
        <div className="p-5 rounded-2xl border border-[#294155] bg-[#0B1B2B] shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#294155]">
            <div className="flex items-center gap-2 text-[#A78BFA]">
              <PieChart size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                Anomaly Type Breakdown
              </h3>
            </div>
          </div>

          <div className="h-72 w-full">
            <ReactECharts option={donutOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Multivariate Scatter Matrix */}
      <div className="p-5 rounded-2xl border border-[#294155] bg-[#0B1B2B] shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#294155]">
          <div className="flex items-center gap-2 text-emerald-400">
            <Boxes size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Multivariate Thermodynamic State Space (Temperature vs Barometric Pressure vs Relative Humidity)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#9FB0BF]">
            Bubble size proportional to Relative Humidity (%)
          </span>
        </div>

        <div className="h-80 w-full">
          <ReactECharts option={scatterOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  );
};
