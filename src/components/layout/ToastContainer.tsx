import React from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import { AlertOctagon, SunMedium, X, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, setSelectedAlertId, setCurrentPage, setSelectedStationId } = useSkyGuard();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const isCritical = toast.type === 'CRITICAL_ANOMALY';
        const isGenuine = toast.type === 'GENUINE_WEATHER';
        const isSuccess = toast.type === 'SUCCESS';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-3.5 border shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${
              isCritical
                ? 'bg-[#0B1B2B]/95 border-red-500/80 shadow-[0_0_25px_-5px_rgba(239,68,68,0.5)]'
                : isGenuine
                ? 'bg-[#0B1B2B]/95 border-emerald-500/80 shadow-[0_0_25px_-5px_rgba(34,197,94,0.4)]'
                : isSuccess
                ? 'bg-[#0B1B2B]/95 border-[#38BDF8]/80 shadow-[0_0_25px_-5px_rgba(56,189,248,0.4)]'
                : 'bg-[#0B1B2B]/95 border-[#294155]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg shrink-0 border ${
                  isCritical
                    ? 'bg-red-950/80 border-red-500/60 text-red-400'
                    : isGenuine
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400'
                    : isSuccess
                    ? 'bg-cyan-950/80 border-[#38BDF8]/60 text-[#38BDF8]'
                    : 'bg-[#142C40] border-[#294155] text-[#9FB0BF]'
                }`}
              >
                {isCritical ? (
                  <AlertOctagon size={18} className="animate-bounce" />
                ) : isGenuine ? (
                  <SunMedium size={18} className="animate-spin" />
                ) : isSuccess ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Info size={18} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                      isCritical
                        ? 'text-red-400'
                        : isGenuine
                        ? 'text-emerald-400'
                        : 'text-[#38BDF8]'
                    }`}
                  >
                    {toast.title}
                  </span>
                  <span className="text-[10px] text-[#9FB0BF] font-mono">
                    {toast.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#F8FAFC] font-medium mt-1 leading-snug">
                  {toast.message}
                </p>

                {toast.alertId && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (toast.stationId) setSelectedStationId(toast.stationId);
                        if (toast.alertId) setSelectedAlertId(toast.alertId);
                        setCurrentPage('alert-detail');
                        dismissToast(toast.id);
                      }}
                      className="flex items-center gap-1 text-xs font-mono font-bold text-[#38BDF8] hover:text-white transition-colors bg-[#142C40] hover:bg-[#38BDF8]/30 px-2.5 py-1 rounded-md border border-[#294155]"
                    >
                      <span>Investigate Evidence</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="text-[#9FB0BF] hover:text-[#F8FAFC] p-1 rounded hover:bg-[#142C40] transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
