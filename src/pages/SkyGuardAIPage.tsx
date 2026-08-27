import React, { useState, useRef, useEffect } from 'react';
import { useSkyGuard } from '../context/SkyGuardContext';
import { SuggestedPrompt } from '../components/ai/SuggestedPrompt';
import { 
  Sparkles, 
  Send, 
  User, 
  ArrowRight 
} from 'lucide-react';

export const SkyGuardAIPage: React.FC = () => {
  const { 
    selectedStation, 
    copilotMessages, 
    sendCopilotMessage, 
    isCopilotTyping,
    setCurrentPage,
    acceptCorrectionAdvisory,
    stations,
    setSelectedStationId 
  } = useSkyGuard();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPromptsList = [
    'Why was this station flagged?',
    'Is this genuine weather or sensor fault?',
    'What evidence supports this?',
    'How healthy is this sensor?',
    'What should I do?',
    'Show recent anomalies.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [copilotMessages, isCopilotTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isCopilotTyping) return;
    sendCopilotMessage(inputVal);
    setInputVal('');
  };

  const handleActionClick = (action: any) => {
    if (action.actionType === 'NAVIGATE') {
      setCurrentPage(action.payload);
    } else if (action.actionType === 'APPLY_CORRECTION') {
      acceptCorrectionAdvisory(action.payload);
    } else if (action.actionType === 'DISPATCH_TECH') {
      setCurrentPage('health');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto select-none h-[calc(100vh-64px)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#294155]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#38BDF8]/20 to-[#A78BFA]/20 border border-[#A78BFA]/40 text-[#A78BFA]">
            <Sparkles size={22} className="animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#F8FAFC] font-mono tracking-tight">
                SkyGuard AI Intelligence Copilot
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                Ground-Truth Explainability
              </span>
            </div>
            <p className="text-xs text-[#9FB0BF]">
              Reasoning engine cross-referencing WMO rules, spatial Kriging neighbors, and neural autoencoders
            </p>
          </div>
        </div>

        {/* Inherited Station Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#9FB0BF]">Focused Node:</span>
          <select
            value={selectedStation.id}
            onChange={e => setSelectedStationId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B1B2B] border border-[#294155] text-white focus:border-[#38BDF8] outline-none"
          >
            {stations.map(s => (
              <option key={s.id} value={s.id}>
                {s.id} • {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-2xl border border-[#294155] bg-[#0B1B2B]/70 shadow-inner">
        {copilotMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="h-9 w-9 rounded-xl bg-[#102536] border border-[#294155] text-[#A78BFA] flex items-center justify-center shrink-0 shadow-md">
                <Sparkles size={16} />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-4 space-y-3 font-sans shadow-xl ${
                msg.sender === 'user'
                  ? 'bg-[#38BDF8] text-[#07111F] font-mono font-medium text-xs rounded-tr-sm'
                  : 'bg-[#07111F] text-[#F8FAFC] border border-[#294155] rounded-tl-sm text-xs'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed">
                {msg.content}
              </div>

              {/* Evidence Snippet Badges */}
              {msg.evidenceSnippets && msg.evidenceSnippets.length > 0 && (
                <div className="pt-2 border-t border-[#142C40] space-y-1.5 font-mono text-[11px]">
                  {msg.evidenceSnippets.map((snp, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#0B1B2B] border border-[#294155]">
                      <span className="text-[#9FB0BF]">{snp.pillar}: <strong className="text-white">{snp.detail}</strong></span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        snp.badge === 'FAIL' || snp.badge === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {snp.badge}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionClick(action)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142C40] hover:bg-[#38BDF8]/20 border border-[#294155] hover:border-[#38BDF8] text-[#38BDF8] text-xs font-mono font-bold transition-colors"
                    >
                      <span>{action.label}</span>
                      <ArrowRight size={12} />
                    </button>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-[#9FB0BF] text-right font-mono">
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="h-9 w-9 rounded-xl bg-[#38BDF8] text-[#07111F] flex items-center justify-center font-bold font-mono text-xs shrink-0 shadow-md">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {isCopilotTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#A78BFA] p-3 rounded-xl bg-[#07111F] border border-[#294155] w-fit">
            <Sparkles size={14} className="animate-spin" />
            <span>Consulting spatial Kriging variograms & thermodynamic laws...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Bar */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9FB0BF] block">
          Suggested Meteorological Inquiries
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedPromptsList.map((prompt, idx) => (
            <SuggestedPrompt
              key={idx}
              label={prompt}
              onClick={() => sendCopilotMessage(prompt)}
            />
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 rounded-2xl bg-[#0B1B2B] border border-[#294155] flex items-center gap-3 shadow-xl">
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder={`Ask AI about ${selectedStation.id} anomaly evidence or genuine heatwave consensus...`}
          className="flex-1 px-4 py-3 rounded-xl bg-[#07111F] border border-[#294155] focus:border-[#38BDF8] text-xs font-mono text-white placeholder-[#9FB0BF] outline-none"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isCopilotTyping}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] disabled:opacity-50 text-[#07111F] text-xs font-mono font-bold transition-all shadow-md active:scale-95"
        >
          <span>Send Inquiry</span>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
