import React from 'react';
import ReactECharts from 'echarts-for-react';
import { LineChart as ChartIcon } from 'lucide-react';

interface HealthTrendChartProps {
  stationId: string;
}

export const HealthTrendChart: React.FC<HealthTrendChartProps> = ({ stationId }) => {
  const months = ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026 (Now)', 'Sep 2026 (Proj)', 'Oct 2026 (Proj)'];
  
  // ST-104 degrades rapidly, ST-101 remains stable
  const scores = stationId === 'ST-104' 
    ? [95, 92, 88, 81, 74, 68, 59, 48] 
    : [98, 97, 98, 96, 97, 96, 95, 95];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0B1B2B',
      borderColor: '#294155',
      textStyle: { color: '#F8FAFC', fontFamily: 'JetBrains Mono', fontSize: 12 },
      formatter: (params: any[]) => {
        const item = params[0];
        const isProjected = item.name.includes('Proj');
        return `<div style="color:#38BDF8; font-weight:bold;">${item.name}</div>
        <div>Sensor Health Index: <strong>${item.value}%</strong></div>
        ${isProjected ? '<div style="color:#EF4444; font-size:10px;">⚠️ Projected failure boundary if uncalibrated</div>' : ''}`;
      }
    },
    grid: {
      top: '14%',
      left: '4%',
      right: '4%',
      bottom: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: '#294155' } },
      axisLabel: { color: '#9FB0BF', fontSize: 10, fontFamily: 'JetBrains Mono' }
    },
    yAxis: {
      type: 'value',
      min: 30,
      max: 100,
      axisLine: { lineStyle: { color: '#294155' } },
      axisLabel: { color: '#9FB0BF', fontSize: 10, fontFamily: 'JetBrains Mono', formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#102536', type: 'dashed' } }
    },
    series: [
      {
        name: 'Health Index',
        type: 'line',
        data: scores,
        smooth: true,
        symbolSize: 6,
        lineStyle: {
          color: stationId === 'ST-104' ? '#EF4444' : '#22C55E',
          width: 3
        },
        itemStyle: {
          color: stationId === 'ST-104' ? '#EF4444' : '#22C55E'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: stationId === 'ST-104' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(34, 197, 94, 0.25)' },
              { offset: 1, color: 'transparent' }
            ]
          }
        },
        markLine: {
          silent: true,
          lineStyle: { color: '#F59E0B', type: 'dashed' },
          data: [{ yAxis: 70, label: { formatter: 'Maintenance Threshold (70%)', color: '#F59E0B', fontSize: 10 } }]
        }
      }
    ]
  };

  return (
    <div className="rounded-2xl border border-[#294155] bg-[#0B1B2B] p-5 shadow-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#38BDF8]">
          <ChartIcon size={16} />
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
            Sensor Degradation Trajectory & MTBF Projection
          </h4>
        </div>
        <span className="text-xs font-mono text-[#9FB0BF]">
          Predictive Curve (Kalman Filter)
        </span>
      </div>

      <div className="h-64 w-full">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
