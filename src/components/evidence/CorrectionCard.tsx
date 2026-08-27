import React from 'react';
import type { CorrectionAdvisory } from '../../types';
import { useSkyGuard } from '../../context/SkyGuardContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Send 
} from 'lucide-react';

interface CorrectionCardProps {
  correction: CorrectionAdvisory;
  alertId: string;
}

export const CorrectionCard: React.FC<CorrectionCardProps> = ({ correction, alertId }) => {
  const { acceptCorrectionAdvisory } = useSkyGuard();
  const [copied, setCopied] = React.useState(false);

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(correction.provenanceHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAccepted = correction.status === 'ACCEPTED_DOWNSTREAM';

  return (
    <div className="rounded-2xl border border-[#38BDF8]/50 bg-[#0B1B2B] p-5 shadow-2xl space-y-4 select-none backdrop-blur-md">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#294155]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8]">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                ADVISORY — RAW VALUE PRESERVED
              </span>
              <span className="text-[10px] font-mono text-[#9FB0BF]">
                WMO Integrity Policy
              </span>
            </div>
            <p className="text-xs text-[#9FB0BF] mt-0.5 font-medium">
              Raw sensor observation is permanently archived in the immutable audit vault.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAccepted ? (
            <span className="flex items-center gap-1 text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/50">
              <CheckCircle2 size={13} />
              <span>ROUTED DOWNSTREAM</span>
            </span>
          ) : (
            <button
              onClick={() => acceptCorrectionAdvisory(alertId)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-[#07111F] text-xs font-mono font-bold transition-all shadow-md active:scale-95"
            >
              <Send size={12} />
              <span>Accept & Route Advisory</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparison Grid: Raw vs Suggested Value */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Raw Observation */}
        <div className="p-4 rounded-xl bg-[#07111F] border border-red-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#9FB0BF] uppercase">
              Original Ingested Observation
            </span>
            <span className="text-[10px] font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40">
              RAW UNTOUCHED
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-red-400">
              {correction.originalValue}
            </span>
            <span className="text-sm font-mono text-[#9FB0BF]">
              {correction.unit}
            </span>
          </div>

          <p className="text-[11px] text-[#9FB0BF] leading-relaxed">
            Preserved in audit hypertable with zero data loss. Flagged downstream as quality-deficient.
          </p>
        </div>

        {/* Suggested Reconstruction */}
        <div className="p-4 rounded-xl bg-[#07111F] border border-emerald-500/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#9FB0BF] uppercase">
              Suggested Reconstructed Value
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40">
              {correction.confidence}% CONFIDENCE
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">
              {correction.suggestedValue}
            </span>
            <span className="text-sm font-mono text-[#9FB0BF]">
              {correction.unit}
            </span>
            <span className="text-xs text-emerald-400/80 font-mono font-semibold ml-2">
              (Δ {(correction.originalValue - correction.suggestedValue).toFixed(1)}{correction.unit})
            </span>
          </div>

          <p className="text-[11px] text-[#9FB0BF] leading-relaxed">
            Reconstructed using {correction.method} from 3 surrounding calibrated AWS nodes.
          </p>
        </div>
      </div>

      {/* Provenance & Algorithm Metadata */}
      <div className="p-3.5 rounded-xl bg-[#102536] border border-[#294155] font-mono text-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#9FB0BF]">
          <span>Reconstruction Algorithm:</span>
          <span className="text-[#38BDF8] font-bold">{correction.method}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#9FB0BF]">
          <span>Cryptographic Provenance Hash:</span>
          <div className="flex items-center gap-1.5">
            <code className="text-emerald-300 text-[11px] bg-[#0B1B2B] px-2 py-0.5 rounded border border-[#294155]">
              {correction.provenanceHash}
            </code>
            <button
              onClick={handleCopyHash}
              className="p-1 text-[#9FB0BF] hover:text-white rounded hover:bg-[#142C40] transition-colors"
              title="Copy Hash"
            >
              <Copy size={12} />
            </button>
            {copied && <span className="text-[10px] text-emerald-400">Copied!</span>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#9FB0BF] pt-1 border-t border-[#142C40]">
          <span>Generated At:</span>
          <span className="text-white">{new Date(correction.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
