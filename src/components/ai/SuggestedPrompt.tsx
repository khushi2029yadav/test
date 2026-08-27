import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestedPromptProps {
  label: string;
  onClick: () => void;
}

export const SuggestedPrompt: React.FC<SuggestedPromptProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1B2B] hover:bg-[#142C40] border border-[#294155] hover:border-[#A78BFA]/60 text-xs font-mono text-[#A78BFA] hover:text-white transition-all text-left group active:scale-95 shadow-sm"
    >
      <Sparkles size={12} className="text-[#A78BFA] shrink-0 group-hover:rotate-12 transition-transform" />
      <span className="truncate">{label}</span>
    </button>
  );
};
