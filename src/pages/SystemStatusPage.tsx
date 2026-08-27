import React from 'react';
import { SYSTEM_SERVICES } from '../data/mockData';
import { CheckCircle2 } from 'lucide-react';

export const SystemStatusPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F8FAFC] font-mono tracking-tight">
              System Infrastructure, ML Pipeline & Data Quality Metrics
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
              All Systems Operational
            </span>
          </div>
          <p className="text-xs text-[#9FB0BF] mt-1">
            Real-time health telemetry of the ingestion broker, TimescaleDB cluster, ONNX model servers and WebSocket event bus
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#0B1B2B] border border-[#294155] text-[#38BDF8]">
            Ingestion Rate: <strong>2,480 msg/s</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#0B1B2B] border border-[#294155] text-emerald-400">
            Avg QC Latency: <strong>3.2ms</strong>
          </div>
        </div>
      </div>

      {/* High-Level System Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-[#0B1B2B] border border-[#294155] space-y-1">
          <span className="text-[10px] text-[#9FB0BF] uppercase block">Data Quality Index (DQI)</span>
          <strong className="text-2xl font-bold text-emerald-400">99.98%</strong>
          <span className="text-[10px] text-[#9FB0BF] block">WMO-No. 8 physical checks</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1B2B] border border-[#294155] space-y-1">
          <span className="text-[10px] text-[#9FB0BF] uppercase block">Model Drift Index (PSI)</span>
          <strong className="text-2xl font-bold text-[#38BDF8]">0.014</strong>
          <span className="text-[10px] text-emerald-400 block">Negligible Concept Drift</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1B2B] border border-[#294155] space-y-1">
          <span className="text-[10px] text-[#9FB0BF] uppercase block">TimescaleDB Hypertable IOPS</span>
          <strong className="text-2xl font-bold text-[#A78BFA]">18,200</strong>
          <span className="text-[10px] text-[#9FB0BF] block">ZSTD 9.4x Compression</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1B2B] border border-[#294155] space-y-1">
          <span className="text-[10px] text-[#9FB0BF] uppercase block">Active WebSocket Listeners</span>
          <strong className="text-2xl font-bold text-white">48 Clients</strong>
          <span className="text-[10px] text-[#38BDF8] block">Protobuf / JSON Live Bus</span>
        </div>
      </div>

      {/* Microservices & Components Detailed Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#38BDF8]">
          Core Microservices & Orchestrators
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYSTEM_SERVICES.map(svc => (
            <div
              key={svc.id}
              className="p-5 rounded-2xl border border-[#294155] bg-[#0B1B2B] shadow-xl space-y-3 flex flex-col justify-between hover:border-[#38BDF8]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#102536] text-[#38BDF8] border border-[#294155]">
                    {svc.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                    <CheckCircle2 size={10} /> {svc.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#F8FAFC] font-mono">
                  {svc.name}
                </h4>
              </div>

              {/* Service Metrics List */}
              <div className="p-3 rounded-xl bg-[#07111F] border border-[#142C40] space-y-1.5 font-mono text-xs">
                {Object.entries(svc.details).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-[#9FB0BF]">
                    <span className="text-[11px] truncate max-w-[150px]">{key}:</span>
                    <strong className="text-white text-[11px]">{val}</strong>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#142C40] flex items-center justify-between text-[10px] font-mono text-[#9FB0BF]">
                <span>Throughput: <strong className="text-[#38BDF8]">{svc.throughput}</strong></span>
                <span>Uptime: <strong className="text-emerald-400">{svc.uptime}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
