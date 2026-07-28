'use client';

import React, { useEffect } from 'react';
import { AyoGameSession } from '@/lib/api';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Sparkles, Award } from 'lucide-react';

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
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#10B981', '#F59E0B', '#FFFFFF'],
      });
    }
  }, [isDraw]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#1E0D05] border-2 border-wood-gold rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Crown Icon Header */}
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-wood-gold to-amber-600 shadow-xl shadow-wood-gold/20 text-black mx-auto animate-bounce-short">
          <Trophy className="w-10 h-10" />
        </div>

        {/* Champion Announcement */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wood-gold/20 text-wood-gold text-xs font-bold border border-wood-gold/30">
            <Sparkles className="w-3.5 h-3.5" /> Ọ̀TÁ (CHAMPION) ESTABLISHED
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
            {isDraw ? 'Match Draw!' : `${winnerName} Wins!`}
          </h2>
          {!isDraw && (
            <p className="text-xs text-amber-200/60">
              <strong className="text-emerald-400">{winnerName}</strong> is crowned <strong className="text-wood-gold">Ọ̀tá</strong>. <span className="text-rose-400">{loserName}</span> assumes the seat of <strong className="text-rose-400">Òpe</strong>.
            </p>
          )}
        </div>

        {/* Final Score Breakdown */}
        <div className="p-4 rounded-2xl bg-wood-dark/80 border border-wood-gold/20 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-200/50 block">
              {game.player1Name}
            </span>
            <span className="text-2xl font-black text-wood-gold">
              {game.board.player1Captured}
            </span>
            <span className="text-[10px] text-amber-200/40 block">seeds captured</span>
          </div>

          <div className="space-y-1 border-l border-wood-gold/10">
            <span className="text-[10px] uppercase font-bold text-amber-200/50 block">
              {game.player2Name}
            </span>
            <span className="text-2xl font-black text-wood-gold">
              {game.board.player2Captured}
            </span>
            <span className="text-[10px] text-amber-200/40 block">seeds captured</span>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-wood-gold via-amber-400 to-amber-500 hover:brightness-110 text-black font-bold text-sm shadow-xl shadow-wood-gold/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Rematch / Play Again</span>
        </button>

      </div>
    </div>
  );
};
