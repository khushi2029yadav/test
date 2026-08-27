import React from 'react';
import type { AnomalyAlert, EvidencePillars } from '../../types';
import { 
  Clock, 
  BarChart3, 
  Cpu, 
  Boxes, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Info, 
  Share2 
} from 'lucide-react';

interface EvidenceSummaryProps {
  alert: AnomalyAlert;
}

export const EvidenceSummary: React.FC<EvidenceSummaryProps> = ({ alert }) => {
  const evidence: EvidencePillars = alert.evidence;

  const getPillarStatusBadge = (status: 'PASS' | 'WARN' | 'FAIL' | 'NEUTRAL') => {
    switch (status) {
      case 'PASS':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 size={11} /> PASS / CONSISTENT
          </span>
        );
      case 'WARN':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/40">
            <AlertTriangle size={11} /> WARN / DEVIATION
          </span>
        );
      case 'FAIL':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/50">
            <AlertOctagon size={11} /> FAIL / ANOMALY
          </span>
        );
      case 'NEUTRAL':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
            <Info size={11} /> UNAVAILABLE / NEUTRAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Banner: Fusion Arbiter Verdict */}
      <div className="p-4 rounded-2xl bg-[#0B1B2B] border border-[#294155] shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] font-mono">
                Multi-Pillar Evidence Fusion Matrix
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#102536] text-[#9FB0BF] border border-[#294155]">
                Dempster-Shafer Consensus
              </span>
            </div>
            <p className="text-sm font-semibold text-[#F8FAFC] mt-1 font-mono">
              {evidence.fusion.verdict}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#102536] border border-[#294155] text-center font-mono">
              <span className="text-[10px] text-[#9FB0BF] block">Fusion Confidence</span>
              <span className="text-xl font-bold text-[#38BDF8]">
                {evidence.fusion.overallConfidence}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#102536] border border-[#294155] text-center font-mono">
              <span className="text-[10px] text-[#9FB0BF] block">Hard Physics Check</span>
              <span className="text-xl font-bold text-red-400">
                {evidence.fusion.hardConfidence}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#102536] border border-[#294155] text-center font-mono">
              <span className="text-[10px] text-[#9FB0BF] block">ML Soft Score</span>
              <span className="text-xl font-bold text-[#A78BFA]">
                {evidence.fusion.softConfidence}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Pillar Detailed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1: Temporal Evidence */}
        <div className="p-4 rounded-xl bg-[#0B1B2B] border border-[#294155] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#38BDF8]">
                <Clock size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  1. Temporal & Rate-of-Change
                </h4>
              </div>
              {getPillarStatusBadge(evidence.temporal.status)}
            </div>
            <p className="text-xs text-[#9FB0BF] leading-relaxed">
              {evidence.temporal.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#142C40] font-mono text-[11px] text-center">
            <div className="p-2 rounded bg-[#102536]">
              <span className="text-[10px] text-[#9FB0BF] block">Z-Score</span>
              <strong className="text-red-400">{evidence.temporal.zScore}σ</strong>
            </div>
            <div className="p-2 rounded bg-[#102536]">
              <span className="text-[10px] text-[#9FB0BF] block">Slope / Rate</span>
              <strong className="text-red-400">{evidence.temporal.rateOfChange > 0 ? `+${evidence.temporal.rateOfChange}` : evidence.temporal.rateOfChange}°C/min</strong>
            </div>
            <div className="p-2 rounded bg-[#102536]">
              <span className="text-[10px] text-[#9FB0BF] block">Limit Threshold</span>
              <strong className="text-[#38BDF8]">±{evidence.temporal.threshold}°C/min</strong>
            </div>
          </div>
        </div>

        {/* Pillar 2: Statistical & Distributional Evidence */}
        <div className="p-4 rounded-xl bg-[#0B1B2B] border border-[#294155] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <BarChart3 size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  2. Statistical & Robust MAD
                </h4>
              </div>
              {getPillarStatusBadge(evidence.statistical.status)}
            </div>
            <p className="text-xs text-[#9FB0BF] leading-relaxed">
              {evidence.statistical.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#142C40] font-mono text-[11px] text-center">
            <div className="p-2 rounded bg-[#102536]">
              <span className="text-[10px] text-[#9FB0BF] block">MAD Deviation</span>
              <strong className="text-amber-400">{evidence.statistical.madScore}x Median</strong>
            </div>
            <div className="p-2 rounded bg-[#102536]">
              <span className="text-[10px] text-[#9FB0BF] block">Climatology Percentile</span>
              <strong className="text-red-400">{evidence.statistical.distributionPercentile}th %ile</strong>
            </div>
          </div>
        </div>

        {/* Pillar 3: Machine Learning Evidence */}
        <div className="p-4 rounded-xl bg-[#0B1B2B] border border-[#294155] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#A78BFA]">
                <Cpu size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  3. ML Isolation & Autoencoder
                </h4>
              </div>
              {getPillarStatusBadge(evidence.ml.status)}
            </div>
            <p className="text-xs text-[#9FB0BF] leading-relaxed">
              {evidence.ml.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#142C40] font-mono text-[11px] text-center">
            <div className="p-2 rounded bg-[#102536]">
              <span className="text-[10px] text-[#9FB0BF] block">Autoencoder Loss</span>
              <strong className="text-purple-400">{evidence.ml.autoencoderReconLoss}x</strong>
            </div>
            <div className="p-2 rounded bg-[#102536]">
              <span className="text-[10px] text-[#9FB0BF] block">Isolation Score</span>
              <strong className="text-red-400">{(evidence.ml.isolationForestScore * 100).toFixed(1)}%</strong>
            </div>
            <div className="p-2 rounded bg-[#102536]">
              <span className="text-[10px] text-[#9FB0BF] block">Model Trust</span>
              <strong className="text-[#38BDF8]">{(evidence.ml.modelConfidence * 100).toFixed(0)}%</strong>
            </div>
          </div>
        </div>

        {/* Pillar 4: Multivariate Physical Consistency */}
        <div className="p-4 rounded-xl bg-[#0B1B2B] border border-[#294155] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Boxes size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  4. Multivariate Physical Laws
                </h4>
              </div>
              {getPillarStatusBadge(evidence.multivariate.status)}
            </div>
            <p className="text-xs text-[#9FB0BF] leading-relaxed">
              {evidence.multivariate.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#142C40] font-mono text-[10px] text-center">
            <div className={`p-1.5 rounded ${evidence.multivariate.dewPointConsistency ? 'bg-emerald-950/60 text-emerald-400' : 'bg-red-950/60 text-red-400'}`}>
              <span>Dew Point: <strong>{evidence.multivariate.dewPointConsistency ? 'VALID' : 'VIOLATED'}</strong></span>
            </div>
            <div className={`p-1.5 rounded ${evidence.multivariate.vaporPressureCoherence ? 'bg-emerald-950/60 text-emerald-400' : 'bg-red-950/60 text-red-400'}`}>
              <span>Vapor Coherence: <strong>{evidence.multivariate.vaporPressureCoherence ? 'VALID' : 'VIOLATED'}</strong></span>
            </div>
            <div className={`p-1.5 rounded ${evidence.multivariate.solarThermalCorrelated ? 'bg-emerald-950/60 text-emerald-400' : 'bg-red-950/60 text-red-400'}`}>
              <span>Solar Flux: <strong>{evidence.multivariate.solarThermalCorrelated ? 'CORRELATED' : 'UNCORRELATED'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar 5: Spatial Neighbor Cross-Validation & Kriging */}
      <div className="p-4 rounded-xl bg-[#0B1B2B] border border-[#294155] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-orange-400">
            <Share2 size={16} />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
              5. Spatial Neighbor Agreement & Ordinary Kriging
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#9FB0BF]">
              Spatial Consensus: <strong className={evidence.spatial.neighborAgreementPercent < 30 ? 'text-red-400' : 'text-emerald-400'}>{evidence.spatial.neighborAgreementPercent}%</strong>
            </span>
            {getPillarStatusBadge(evidence.spatial.status)}
          </div>
        </div>

        <p className="text-xs text-[#9FB0BF] leading-relaxed">
          {evidence.spatial.description}
        </p>

        {/* Surrounding Neighbor AWS Comparison Table */}
        <div className="overflow-x-auto rounded-lg border border-[#142C40]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#102536] text-[#9FB0BF] text-[10px] uppercase">
              <tr>
                <th className="p-2.5">Adjacent AWS Node</th>
                <th className="p-2.5">Distance</th>
                <th className="p-2.5">Observed Value</th>
                <th className="p-2.5">Spatial Delta (Δ)</th>
                <th className="p-2.5 text-right">Consensus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142C40] bg-[#07111F]">
              {evidence.spatial.neighbors.map((neighbor, idx) => (
                <tr key={idx} className="hover:bg-[#0B1B2B] transition-colors">
                  <td className="p-2.5 font-bold text-[#F8FAFC]">
                    {neighbor.stationId} • {neighbor.name}
                  </td>
                  <td className="p-2.5 text-[#9FB0BF]">
                    {neighbor.distanceKm} km
                  </td>
                  <td className="p-2.5 text-white font-bold">
                    {neighbor.observedVal}°C
                  </td>
                  <td className="p-2.5 text-amber-400 font-bold">
                    {neighbor.delta > 0 ? `+${neighbor.delta.toFixed(1)}` : neighbor.delta.toFixed(1)}°C
                  </td>
                  <td className="p-2.5 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        neighbor.status === 'AGREE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-950 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {neighbor.status === 'AGREE' ? 'CORROBORATED' : 'DISAGREES'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
