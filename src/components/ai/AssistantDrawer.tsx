import React, { useState, useRef, useEffect } from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import { SuggestedPrompt } from './SuggestedPrompt';
import { 
  Sparkles, 
  X, 
  Send, 
  User, 
  ArrowRight 
} from 'lucide-react';

export const AssistantDrawer: React.FC = () => {
  const { 
    isAssistantDrawerOpen, 
    setIsAssistantDrawerOpen, 
    selectedStation, 
    copilotMessages, 
    sendCopilotMessage, 
    isCopilotTyping,
    setCurrentPage,
    acceptCorrectionAdvisory
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
    if (isAssistantDrawerOpen) {
      scrollToBottom();
    }
  }, [copilotMessages, isAssistantDrawerOpen, isCopilotTyping]);

  if (!isAssistantDrawerOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isCopilotTyping) return;
    sendCopilotMessage(inputVal);
    setInputVal('');
  };

  const handleActionClick = (action: any) => {
    if (action.actionType === 'NAVIGATE') {
      setCurrentPage(action.payload);
      setIsAssistantDrawerOpen(false);
    } else if (action.actionType === 'APPLY_CORRECTION') {
      acceptCorrectionAdvisory(action.payload);
    } else if (action.actionType === 'DISPATCH_TECH') {
      setCurrentPage('health');
      setIsAssistantDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAssistantDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#07111F] border-l border-[#294155] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-4 border-b border-[#294155] bg-[#0B1B2B]/95">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#38BDF8]/20 to-[#A78BFA]/20 border border-[#A78BFA]/40 text-[#A78BFA]">
                  <Sparkles size={18} className="animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F8FAFC] font-mono tracking-tight flex items-center gap-2">
                    SkyGuard AI Copilot
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                      Context-Aware
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#9FB0BF]">
                    Real-time meteorological explainability & root cause engine
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAssistantDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#9FB0BF] hover:text-[#F8FAFC] hover:bg-[#142C40] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Active Context Chip */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#07111F] border border-[#294155] text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse" />
                <span className="text-[#9FB0BF]">Inherited Context:</span>
                <strong className="text-white">{selectedStation.id} ({selectedStation.name})</strong>
              </div>
              <span className="text-[10px] text-[#38BDF8]">
                {selectedStation.currentReadings.temperature}°C
              </span>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
            {copilotMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="h-8 w-8 rounded-xl bg-[#102536] border border-[#294155] text-[#A78BFA] flex items-center justify-center shrink-0">
                    <Sparkles size={15} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 font-sans leading-relaxed shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-[#38BDF8] text-[#07111F] font-medium font-mono text-xs rounded-tr-sm'
                      : 'bg-[#0B1B2B] text-[#F8FAFC] border border-[#294155] rounded-tl-sm text-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.content}
                  </div>

                  {/* Evidence Snippet Badges */}
                  {msg.evidenceSnippets && msg.evidenceSnippets.length > 0 && (
                    <div className="pt-2 border-t border-[#294155] space-y-1.5 font-mono text-[11px]">
                      {msg.evidenceSnippets.map((snp, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 rounded bg-[#07111F] border border-[#142C40]">
                          <span className="text-[#9FB0BF]">{snp.pillar}: <strong className="text-white">{snp.detail}</strong></span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            snp.badge === 'FAIL' || snp.badge === 'CRITICAL' ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'
                          }`}>
                            {snp.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons inside chat */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(action)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#142C40] hover:bg-[#38BDF8]/20 border border-[#294155] hover:border-[#38BDF8] text-[#38BDF8] text-[11px] font-mono font-medium transition-colors"
                        >
                          <span>{action.label}</span>
                          <ArrowRight size={11} />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-[9px] text-[#9FB0BF] text-right font-mono">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="h-8 w-8 rounded-xl bg-[#38BDF8] text-[#07111F] flex items-center justify-center font-bold font-mono text-xs shrink-0">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {isCopilotTyping && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#A78BFA] p-3 rounded-xl bg-[#0B1B2B] border border-[#294155] w-fit">
                <Sparkles size={14} className="animate-spin" />
                <span>Evaluating 5-pillar spatial kriging & multivariate laws...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="p-3 border-t border-[#294155] bg-[#0B1B2B]/60 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9FB0BF] block">
              Context-Aware Suggested Inquiries
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {suggestedPromptsList.map((prompt, idx) => (
                <SuggestedPrompt
                  key={idx}
                  label={prompt}
                  onClick={() => sendCopilotMessage(prompt)}
                />
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-4 border-t border-[#294155] bg-[#0B1B2B] flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={`Ask AI about ${selectedStation.id} anomaly evidence...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#07111F] border border-[#294155] focus:border-[#38BDF8] text-xs font-mono text-white placeholder-[#9FB0BF] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isCopilotTyping}
              className="p-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] disabled:opacity-50 text-[#07111F] transition-all shadow-md active:scale-95 shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
