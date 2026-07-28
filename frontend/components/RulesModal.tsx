'use client';

import React from 'react';
import { X, BookOpen, Crown, ShieldAlert, Zap, Repeat } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#141416] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 text-wood-brass border border-white/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
                Ayò Ọlọ́pọ́n — Rules &amp; Heritage
              </h2>
              <p className="text-xs text-wood-brass font-medium">Game of the Intellectual (Yoruba Tradition)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          
          {/* Equipment & Setup */}
          <section className="space-y-1.5">
            <h3 className="font-semibold text-wood-brass text-sm flex items-center gap-2">
              <Crown className="w-4 h-4" /> 1. Board &amp; Equipment
            </h3>
            <p>
              Played on a carved wooden board (<em className="text-neutral-100">Ọpọ́n Ayò</em>) with <strong>12 circular pits</strong> arranged in 2 parallel rows of 6.
              Each player owns the row of 6 pits directly facing them. A total of <strong>48 smooth seeds</strong> (<em className="text-neutral-100">Ọmọ Ayò</em>) are placed with exactly 4 seeds per pit at the start.
            </p>
          </section>

          {/* Sowing Rules */}
          <section className="space-y-1.5">
            <h3 className="font-semibold text-wood-brass text-sm flex items-center gap-2">
              <Repeat className="w-4 h-4" /> 2. Sowing &amp; Full-Lap Rule
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>On your turn, scoop all seeds from any non-empty pit on your own side.</li>
              <li>Drop 1 seed per pit moving <strong>counter-clockwise</strong> around the board.</li>
              <li><strong className="text-neutral-100">12+ Seed Lap Skip:</strong> If sowing 12 or more seeds (completing a full lap around the board), the starting pit is skipped during distribution.</li>
            </ul>
          </section>

          {/* Capturing Rules */}
          <section className="space-y-1.5">
            <h3 className="font-semibold text-wood-brass text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> 3. Capturing &amp; Chain Captures
            </h3>
            <p>
              A capture occurs when your <strong>last seed</strong> lands in an opponent&apos;s pit, bringing that pit&apos;s total to <strong>2 or 3 seeds</strong>.
              All seeds from that pit are captured. If the preceding pit in the opponent&apos;s row also contains 2 or 3 seeds, those are captured as well (chain capture).
            </p>
          </section>

          {/* Anti-Starvation & Grand Slam */}
          <section className="space-y-1.5 bg-black/40 p-4 rounded-2xl border border-rose-500/20">
            <h3 className="font-semibold text-rose-300 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> 4. Anti-Starvation &amp; Grand Slam Rules
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-rose-200/80">
              <li>
                <strong className="text-neutral-100">Feeding Rule:</strong> If your opponent has 0 seeds, you MUST play a move that delivers seeds to their side (if a rescue move exists).
              </li>
              <li>
                <strong className="text-neutral-100">Grand Slam Disallowance:</strong> A move that would capture ALL remaining seeds from the opponent&apos;s side is disallowed. Sowing completes normally, but no seeds are captured.
              </li>
            </ul>
          </section>

          {/* Victory */}
          <section className="space-y-1.5">
            <h3 className="font-semibold text-wood-brass text-sm flex items-center gap-2">
              <Crown className="w-4 h-4 text-wood-brass" /> 5. Victory &amp; Match Titles
            </h3>
            <p>
              The objective is to capture <strong>25 or more seeds</strong>.
              The victor earns the title of <strong className="text-emerald-400">Ọ̀tá (Champion)</strong>, while the defeated player becomes <strong className="text-rose-400">Òpe (Learner)</strong>.
            </p>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-wood-brass hover:bg-wood-brass/90 text-black font-semibold text-xs transition-all shadow-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
