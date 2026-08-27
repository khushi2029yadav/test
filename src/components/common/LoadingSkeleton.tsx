import React from 'react';

export const LoadingSkeleton: React.FC<{ type?: 'card' | 'chart' | 'table' | 'map' }> = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="rounded-xl border border-[#294155] bg-[#0B1B2B]/70 p-4 animate-pulse">
        <div className="flex justify-between items-center mb-3">
          <div className="h-3 w-24 bg-[#142C40] rounded" />
          <div className="h-8 w-8 bg-[#142C40] rounded-lg" />
        </div>
        <div className="h-8 w-32 bg-[#142C40] rounded mb-2" />
        <div className="h-3 w-40 bg-[#142C40] rounded" />
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="rounded-xl border border-[#294155] bg-[#0B1B2B]/70 p-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-4 w-48 bg-[#142C40] rounded" />
          <div className="flex gap-2">
            <div className="h-7 w-16 bg-[#142C40] rounded" />
            <div className="h-7 w-16 bg-[#142C40] rounded" />
          </div>
        </div>
        <div className="h-64 w-full bg-[#102536] rounded-lg flex items-end p-4 gap-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-[#142C40] rounded-t" 
              style={{ height: `${20 + Math.sin(i) * 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="rounded-xl border border-[#294155] bg-[#0B1B2B]/70 p-4 animate-pulse space-y-3">
        <div className="h-10 w-full bg-[#142C40] rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full bg-[#102536] rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="h-80 w-full rounded-xl border border-[#294155] bg-[#0B1B2B]/70 animate-pulse flex flex-col items-center justify-center text-[#9FB0BF]">
      <div className="h-12 w-12 rounded-full border-2 border-[#38BDF8]/40 border-t-[#38BDF8] animate-spin mb-3" />
      <span className="text-xs font-mono tracking-wider uppercase">Loading Geospatial & Telemetry Grid...</span>
    </div>
  );
};
