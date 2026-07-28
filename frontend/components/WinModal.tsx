'use client';

import React, { useEffect } from 'react';
import { AyoGameSession } from '@/lib/api';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Sparkles } from 'lucide-react';

interface WinModalProps {
  game: AyoGameSession;
  onPlayAgain: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ game, onPlayAgain }) => {
  const isP1Won = game.status === 'PLAYER_1_WON';
  const isDraw = game.status === 'DRAW';

  const winnerName = isDraw
    ? 'Draw Match'
    : isP1Won
    ? game.player1Name
    : game.player2Name;

  const loserName = isP1Won ? game.player2Name : game.player1Name;

  useEffect(() => {
    if (!isDraw) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A880', '#10B981', '#F59E0B', '#E2E8F0'],
      });
    }
  }, [isDraw]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#141416] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Crown Icon Header */}
        <div className="inline-flex p-3.5 rounded-2xl bg-wood-brass/15 border border-wood-brass/30 text-wood-brass mx-auto">
          <Trophy className="w-8 h-8" />
        </div>

        {/* Champion Announcement */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-wood-brass text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Ọ̀TÁ (CHAMPION) ESTABLISHED
          </div>
          <h2 className="text-2xl font-bold text-neutral-100">
            {isDraw ? 'Match Draw!' : `${winnerName} Wins!`}
          </h2>
          {!isDraw && (
            <p className="text-xs text-neutral-400">
              <strong className="text-emerald-400 font-semibold">{winnerName}</strong> is crowned <strong className="text-wood-brass font-semibold">Ọ̀tá</strong>. <span className="text-neutral-400">{loserName}</span> becomes <strong className="text-rose-400 font-semibold">Òpe</strong>.
            </p>
          )}
        </div>

        {/* Final Score Breakdown */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
              {game.player1Name}
            </span>
            <span className="text-2xl font-bold text-neutral-100">
              {game.board.player1Captured}
            </span>
            <span className="text-[10px] text-neutral-500 block">seeds captured</span>
          </div>

          <div className="space-y-0.5 border-l border-white/5">
            <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
              {game.player2Name}
            </span>
            <span className="text-2xl font-bold text-neutral-100">
              {game.board.player2Captured}
            </span>
            <span className="text-[10px] text-neutral-500 block">seeds captured</span>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 px-6 rounded-2xl bg-wood-brass hover:bg-wood-brass/90 text-black font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Play Again</span>
        </button>

      </div>
    </div>
  );
};
