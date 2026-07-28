'use client';

import React from 'react';
import { History, ShieldAlert, Sprout } from 'lucide-react';

interface MoveHistoryProps {
  history: string[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  return (
    <div className="mx-auto w-full max-w-4xl card p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
        <History className="h-3.5 w-3.5 text-wood-brass" />
        Play log
      </div>

      <div className="scroll-slim max-h-40 space-y-1.5 overflow-y-auto pr-1.5">
        {history.length === 0 ? (
          <p className="py-6 text-center text-xs italic text-neutral-600">
            No moves yet — choose a glowing pit on your row to sow.
          </p>
        ) : (
          history
            .slice()
            .reverse()
            .map((log, index) => {
              const isGrandSlam = log.includes('Grand Slam disallowed');
              const hasCapture = log.includes('& captured');

              return (
                <div
                  key={index}
                  className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
                    isGrandSlam
                      ? 'border border-clay/20 bg-clay/10 text-clay'
                      : hasCapture
                        ? 'border border-wood-brass/25 bg-wood-brass/10 text-neutral-100'
                        : 'border border-line/60 bg-panel2/30 text-neutral-400'
                  }`}
                >
                  {isGrandSlam ? (
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-clay" />
                  ) : hasCapture ? (
                    <Sprout className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wood-brass" />
                  ) : null}
                  <span className="leading-snug">{log}</span>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};
