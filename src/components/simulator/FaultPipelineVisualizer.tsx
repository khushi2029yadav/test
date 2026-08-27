import React from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import type { PipelineStep } from '../../types';
import { 
  CheckCircle2, 
  AlertOctagon, 
  Loader2, 
  Clock, 
  Zap 
} from 'lucide-react';

export const FaultPipelineVisualizer: React.FC = () => {
  const { pipelineSteps, isPipelineActive } = useSkyGuard();

  const getStepIcon = (status: PipelineStep['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'FLAGGED':
        return <AlertOctagon size={16} className="text-red-400 animate-bounce" />;
      case 'PROCESSING':
        return <Loader2 size={16} className="text-[#38BDF8] animate-spin" />;
      default:
        return <Clock size={16} className="text-[#9FB0BF]" />;
    }
  };

  const getStepBorder = (status: PipelineStep['status']) => {
    switch (status) {
      case 'FLAGGED':
        return 'border-red-500/80 bg-red-950/40 shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]';
      case 'COMPLETED':
        return 'border-emerald-500/50 bg-[#0B1B2B]';
      case 'PROCESSING':
        return 'border-[#38BDF8] bg-[#102536] shadow-[0_0_15px_-3px_rgba(56,189,248,0.4)]';
      default:
        return 'border-[#294155] bg-[#07111F] opacity-60';
    }
  };

  return (
    <div className="rounded-2xl border border-[#294155] bg-[#07111F] p-5 shadow-2xl space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#294155]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8]">
            <Zap size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                Live End-to-End Processing Pipeline
              </h3>
              {isPipelineActive && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/30 animate-pulse">
                  <Loader2 size={10} className="animate-spin" /> INJECTING...
                </span>
              )}
            </div>
            <p className="text-xs text-[#9FB0BF]">
              Real-time telemetry evaluation flow: Ingested → QC → Features → ML → Spatial → Fusion → Alert → WebSocket
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-[#9FB0BF]">
          Total Latency: <strong className="text-[#38BDF8]">44.2ms</strong>
        </div>
      </div>

      {/* Horizontal / Grid Pipeline Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pipelineSteps.map((step) => (
          <div
            key={step.id}
            className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${getStepBorder(step.status)}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#F8FAFC]">
                  {step.label}
                </span>
                {getStepIcon(step.status)}
              </div>
              <p className="text-[11px] font-mono text-[#9FB0BF] leading-snug">
                {step.outputSummary}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-[#142C40] flex items-center justify-between text-[10px] font-mono text-[#9FB0BF]">
              <span>Latency: <strong className="text-white">{step.latencyMs}ms</strong></span>
              <span>{step.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
