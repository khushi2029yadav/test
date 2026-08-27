import React, { useState } from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Minimize2, 
  Maximize2,
  X,
  ArrowUpRight
} from 'lucide-react';

export const DEMO_STEPS_INFO = [
  {
    step: 1,
    title: 'Open Dashboard',
    proof: 'Network health, live map, KPI counters and live state',
    actionLabel: 'Go to Dashboard',
    action: (ctx: any) => ctx.goToDemoStep(1)
  },
  {
    step: 2,
    title: 'Open Station ST-104',
    proof: 'Station identity, coordinates, live readings and baseline',
    actionLabel: 'Inspect ST-104',
    action: (ctx: any) => {
      ctx.setSelectedStationId('ST-104');
      ctx.setCurrentPage('station-detail');
      ctx.goToDemoStep(2);
    }
  },
  {
    step: 3,
    title: 'Inject Temperature Spike',
    proof: 'Fault simulator: 55.2°C temperature step injection on ST-104',
    actionLabel: 'Inject Spike (55°C)',
    action: (ctx: any) => {
      ctx.setCurrentPage('simulator');
      ctx.goToDemoStep(3);
      ctx.injectFault({
        stationId: 'ST-104',
        parameter: 'TEMPERATURE',
        faultType: 'SPIKE',
        severityPercent: 95,
        durationSeconds: 300,
        customValue: 55.2
      });
    }
  },
  {
    step: 4,
    title: 'Watch Real-Time Pipeline Reaction',
    proof: 'WebSocket broadcast: Ingested → QC → ML → Spatial → Fusion → Alert',
    actionLabel: 'View Dashboard Live Reaction',
    action: (ctx: any) => {
      ctx.setCurrentPage('dashboard');
      ctx.goToDemoStep(4);
    }
  },
  {
    step: 5,
    title: 'Open Critical Alert ALT-2026-8801',
    proof: 'Anomaly timeline marker, alert card, and telemetry breach',
    actionLabel: 'Open Alert Detail',
    action: (ctx: any) => {
      ctx.setSelectedAlertId('ALT-2026-8801');
      ctx.setCurrentPage('alert-detail');
      ctx.goToDemoStep(5);
    }
  },
  {
    step: 6,
    title: 'Inspect 5-Pillar Evidence Chain',
    proof: 'Temporal (5.8σ) + Statistical (MAD) + ML (94.2%) + Spatial (4.2%) + Multivariate',
    actionLabel: 'Examine 5 Pillars',
    action: (ctx: any) => {
      ctx.setSelectedAlertId('ALT-2026-8801');
      ctx.setCurrentPage('alert-detail');
      ctx.goToDemoStep(6);
    }
  },
  {
    step: 7,
    title: 'Review Fusion & Root Cause',
    proof: 'Confidence (96.8%) + Severity (Critical) + Root Cause (Spike Fault)',
    actionLabel: 'Inspect Fusion Matrix',
    action: (ctx: any) => {
      ctx.setSelectedAlertId('ALT-2026-8801');
      ctx.setCurrentPage('alert-detail');
      ctx.goToDemoStep(7);
    }
  },
  {
    step: 8,
    title: 'Ask SkyGuard AI Why',
    proof: 'Context-aware explainability copilot with neighbor station citations',
    actionLabel: 'Trigger AI Explanation',
    action: (ctx: any) => {
      ctx.setIsAssistantDrawerOpen(true);
      ctx.sendCopilotMessage('Why was ST-104 flagged? What is the root cause?');
      ctx.goToDemoStep(8);
    }
  },
  {
    step: 9,
    title: 'Evaluate Advisory Correction',
    proof: 'ADVISORY — RAW VALUE PRESERVED (Raw 55.2°C vault vs Spatial Kriging 28.4°C)',
    actionLabel: 'View Correction Card',
    action: (ctx: any) => {
      ctx.setSelectedAlertId('ALT-2026-8801');
      ctx.setCurrentPage('alert-detail');
      ctx.goToDemoStep(9);
    }
  },
  {
    step: 10,
    title: 'Trigger Genuine Weather Heatwave Case',
    proof: 'Hero Case 2: ST-109 (45.4°C) with 94.8% neighbor agreement prevents false alarm',
    actionLabel: 'Simulate Genuine Heatwave (45°C)',
    action: (ctx: any) => {
      ctx.setSelectedStationId('ST-109');
      ctx.setSelectedAlertId('ALT-2026-8802');
      ctx.setCurrentPage('dashboard');
      ctx.goToDemoStep(10);
      ctx.injectFault({
        stationId: 'ST-109',
        parameter: 'TEMPERATURE',
        faultType: 'GENUINE_WEATHER',
        severityPercent: 85,
        durationSeconds: 300,
        customValue: 45.4
      });
    }
  },
  {
    step: 11,
    title: 'Open Sensor Health & Predictive Maintenance',
    proof: 'Sensor degradation curve, RTD drift velocity, MTBF (14 days), and ticket dispatch',
    actionLabel: 'Open Sensor Health',
    action: (ctx: any) => {
      ctx.setSelectedStationId('ST-104');
      ctx.setCurrentPage('health');
      ctx.goToDemoStep(11);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }
];

export const GuidedDemoTour: React.FC = () => {
  const ctx = useSkyGuard();
  const { demoStep, isTourActive, setIsTourActive, nextDemoStep, prevDemoStep, goToDemoStep } = ctx;
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isTourActive) return null;

  const currentStepData = DEMO_STEPS_INFO[demoStep - 1] || DEMO_STEPS_INFO[0];
  const progressPercent = (demoStep / DEMO_STEPS_INFO.length) * 100;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl select-none animate-in slide-in-from-bottom-6 duration-300">
      <div className="rounded-2xl border border-[#38BDF8]/60 bg-[#07111F]/95 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(56,189,248,0.35)] overflow-hidden">
        {/* Progress Bar Top */}
        <div className="h-1.5 w-full bg-[#142C40]">
          <div
            className="h-full bg-gradient-to-r from-[#38BDF8] via-[#A78BFA] to-[#22C55E] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Inner Content */}
        <div className="p-3.5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#38BDF8]/20 to-[#A78BFA]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono font-bold">
                <Sparkles size={13} className="text-[#A78BFA]" />
                <span>SIH Demo Guide: Step {demoStep} / 11</span>
              </span>
              <span className="text-xs font-bold text-[#F8FAFC] hidden sm:inline font-mono">
                {currentStepData.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-lg text-[#9FB0BF] hover:text-[#F8FAFC] hover:bg-[#142C40] transition-colors"
                title={isMinimized ? 'Expand Demo Dock' : 'Minimize Demo Dock'}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button
                onClick={() => setIsTourActive(false)}
                className="p-1 rounded-lg text-[#9FB0BF] hover:text-red-400 hover:bg-[#142C40] transition-colors"
                title="Dismiss Demo Dock"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-xl bg-[#0B1B2B] border border-[#294155]">
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#38BDF8] block">
                    UI Proof Objective
                  </span>
                  <p className="text-xs text-[#F8FAFC] font-medium leading-tight mt-0.5">
                    {currentStepData.proof}
                  </p>
                </div>

                <button
                  onClick={() => currentStepData.action(ctx)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-[#07111F] text-xs font-mono font-bold shadow-md hover:shadow-cyan-500/20 transition-all shrink-0 active:scale-95"
                >
                  <Play size={12} className="fill-current" />
                  <span>{currentStepData.actionLabel}</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>

              {/* Step Navigation Dots & Arrows */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={prevDemoStep}
                  disabled={demoStep === 1}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#142C40] hover:bg-[#1E3A5F] text-[#9FB0BF] hover:text-[#F8FAFC] text-xs font-mono disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>

                {/* Micro Step Numbers */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-[340px] px-2 py-1">
                  {DEMO_STEPS_INFO.map(s => (
                    <button
                      key={s.step}
                      onClick={() => goToDemoStep(s.step)}
                      className={`h-6 w-6 rounded-md font-mono text-[10px] font-bold flex items-center justify-center transition-all ${
                        s.step === demoStep
                          ? 'bg-[#38BDF8] text-[#07111F] shadow-[0_0_10px_rgba(56,189,248,0.5)] scale-110'
                          : s.step < demoStep
                          ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                          : 'bg-[#102536] text-[#9FB0BF] hover:text-[#F8FAFC] border border-[#294155]'
                      }`}
                      title={s.title}
                    >
                      {s.step}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextDemoStep}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono font-bold transition-colors"
                >
                  <span>{demoStep === 11 ? 'Finish' : 'Next Step'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
