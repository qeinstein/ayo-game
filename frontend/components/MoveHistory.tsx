'use client';

import React from 'react';
import { History, ShieldAlert } from 'lucide-react';

interface MoveHistoryProps {
  history: string[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-[#141416] p-4 rounded-2xl border border-white/5 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-wood-brass uppercase tracking-wider">
        <History className="w-3.5 h-3.5 text-wood-brass" />
        <span>Match Play Log</span>
      </div>

      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-white/10">
        {history.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-2 text-center">
            No moves played yet. Select a pit on your row to sow seeds!
          </p>
        ) : (
          history.slice().reverse().map((log, index) => {
            const isGrandSlam = log.includes('Grand Slam disallowed');
            const hasCapture = log.includes('& captured');

            return (
              <div
                key={index}
                className={`flex items-start gap-2 p-2 rounded-xl text-xs ${
                  isGrandSlam
                    ? 'bg-rose-950/30 border border-rose-500/20 text-rose-300'
                    : hasCapture
                    ? 'bg-wood-brass/10 border border-wood-brass/20 text-neutral-200 font-medium'
                    : 'bg-black/30 text-neutral-400 border border-white/5'
                }`}
              >
                {isGrandSlam && <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />}
                <span className="leading-tight">{log}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
