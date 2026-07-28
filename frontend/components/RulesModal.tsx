'use client';

import React from 'react';
import { X, Crown, ShieldAlert, Zap, Repeat, BookOpen } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Section: React.FC<{ n: string; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  n, title, icon, children,
}) => (
  <section className="space-y-1.5">
    <h3 className="flex items-center gap-2 text-sm font-medium text-slate-900">
      <span className="text-wood-brass">{icon}</span>
      <span className="text-slate-500">{n}.</span> {title}
    </h3>
    <div className="pl-6 text-[13px] leading-relaxed text-slate-500">{children}</div>
  </section>
);

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="scroll-slim card max-h-[85vh] w-full max-w-2xl animate-scale-in overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between border-b border-line pb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-wood-brass/25 bg-wood-brass/10 p-2 text-wood-brass">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">How to play</h2>
              <p className="text-xs text-wood-brass">A count-and-capture strategy game</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-line bg-panel2/50 p-2 text-slate-500 transition-colors hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          <Section n="1" title="Board & seeds" icon={<Crown className="h-4 w-4" />}>
            Played on a carved wooden <em className="not-italic text-slate-700">board</em> — 12 pits in two rows of six.
            Each player owns the six pits facing them. All 48 seeds start with exactly four per pit.
          </Section>

          <Section n="2" title="Sowing & the full lap" icon={<Repeat className="h-4 w-4" />}>
            Scoop every seed from one of your pits and drop them one-by-one, counter-clockwise. Sowing 12 or more seeds
            completes a lap — the starting pit is skipped so no pit is over-filled.
          </Section>

          <Section n="3" title="Capturing" icon={<Zap className="h-4 w-4" />}>
            When your last seed lands in an opponent&apos;s pit and lifts it to 2 or 3 seeds, you capture it — and any
            unbroken run of preceding opponent pits that also hold 2 or 3 (a chain capture).
          </Section>

          <div className="rounded-2xl border border-clay/20 bg-clay/[0.06] p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-clay">
              <ShieldAlert className="h-4 w-4" /> 4. Fair-play safeguards
            </h3>
            <ul className="mt-2 space-y-2 pl-5 text-[13px] text-slate-500">
              <li className="list-disc">
                <span className="text-slate-700">Feeding:</span> if your opponent has no seeds, you must play a move
                that gives them some (when one exists).
              </li>
              <li className="list-disc">
                <span className="text-slate-700">Grand slam:</span> a move that would clear the opponent&apos;s entire
                side is sown, but captures nothing.
              </li>
            </ul>
          </div>

          <Section n="5" title="Victory" icon={<Crown className="h-4 w-4" />}>
            First to capture <span className="text-slate-700">25 seeds</span> wins the
            <span className="text-jade"> match</span>.
          </Section>
        </div>

        <div className="mt-6 flex justify-end border-t border-line pt-5">
          <button
            onClick={onClose}
            className="rounded-lg bg-wood-brass px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-wood-brassHover"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
