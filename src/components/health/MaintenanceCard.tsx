import React, { useState } from 'react';
import type { SensorHealthRecord } from '../../types';
import { useSkyGuard } from '../../context/SkyGuardContext';
import { 
  Wrench, 
  Send, 
  CheckCircle2 
} from 'lucide-react';

interface MaintenanceCardProps {
  healthRecord: SensorHealthRecord;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ healthRecord }) => {
  const { addToast } = useSkyGuard();
  const [ticketStatus, setTicketStatus] = useState<'IDLE' | 'DISPATCHED'>('IDLE');
  const [ticketId, setTicketId] = useState<string>('');

  const handleDispatchTicket = () => {
    const generatedId = 'TCK-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedId);
    setTicketStatus('DISPATCHED');

    addToast({
      type: 'SUCCESS',
      title: 'MAINTENANCE DISPATCH TICKET GENERATED',
      message: `Ticket ${generatedId} assigned to Garhwal Field Engineering Team for ${healthRecord.stationId}.`
    });
  };

  return (
    <div className="rounded-2xl border border-[#294155] bg-[#0B1B2B] p-5 shadow-2xl space-y-4 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#294155]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-950/70 border border-orange-500/50 text-orange-400">
            <Wrench size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Field Maintenance & Calibration Dispatcher
            </h4>
            <p className="text-xs text-[#9FB0BF]">
              Automated work order creation based on multi-model sensor drift detection
            </p>
          </div>
        </div>

        {ticketStatus === 'DISPATCHED' ? (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 text-xs font-mono font-bold">
            <CheckCircle2 size={13} />
            <span>DISPATCHED ({ticketId})</span>
          </span>
        ) : (
          <button
            onClick={handleDispatchTicket}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <Send size={12} />
            <span>Generate Work Order</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-[#07111F] border border-[#294155] space-y-1">
          <span className="text-[10px] text-[#9FB0BF] uppercase block">Recommended Action</span>
          <strong className="text-white block">Replace PT100 RTD Sensor</strong>
          <span className="text-[11px] text-red-400">Thermal shield inspect required</span>
        </div>

        <div className="p-3 rounded-xl bg-[#07111F] border border-[#294155] space-y-1">
          <span className="text-[10px] text-[#9FB0BF] uppercase block">Assigned Regional Hub</span>
          <strong className="text-[#38BDF8] block">Dehradun AWS Regional Depot</strong>
          <span className="text-[11px] text-[#9FB0BF]">Distance: 24.5 km</span>
        </div>

        <div className="p-3 rounded-xl bg-[#07111F] border border-[#294155] space-y-1">
          <span className="text-[10px] text-[#9FB0BF] uppercase block">SLA Response Window</span>
          <strong className="text-amber-400 block">Within 24 Hours</strong>
          <span className="text-[11px] text-[#9FB0BF]">Priority: Urgent Level 1</span>
        </div>
      </div>
    </div>
  );
};
