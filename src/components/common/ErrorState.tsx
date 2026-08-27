import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Module Ingestion Stream Error',
  message = 'Failed to fetch high-frequency telemetry burst. The TimescaleDB replica experienced an intermittent query timeout.',
  onRetry,
  isRetrying = false
}) => {
  return (
    <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 my-3 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/50 text-red-400 shrink-0">
          <AlertCircle size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-red-300 uppercase tracking-wider font-mono">
            {title}
          </h4>
          <p className="text-xs text-red-200/80 mt-1 leading-relaxed">
            {message}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/60 border border-red-500/40 text-xs font-mono font-medium text-red-200 transition-colors shrink-0 disabled:opacity-50"
          >
            <RefreshCw size={12} className={isRetrying ? 'animate-spin' : ''} />
            <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
