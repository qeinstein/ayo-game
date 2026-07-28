'use client';

import React from 'react';
import { History, ShieldAlert } from 'lucide-react';

interface MoveHistoryProps {
  history: string[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-4 rounded-2xl border border-wood-gold/20 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-wood-gold uppercase tracking-wider">
        <History className="w-4 h-4 text-wood-gold" />
        <span>Match Play Log</span>
      </div>

      <div className="max-h-40 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-wood-gold/20">
        {history.length === 0 ? (
          <p className="text-xs text-amber-200/40 italic py-2 text-center">
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
                    ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200'
                    : hasCapture
                    ? 'bg-wood-gold/10 border border-wood-gold/30 text-amber-100 font-medium'
                    : 'bg-wood-dark/50 text-amber-200/70 border border-white/5'
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
