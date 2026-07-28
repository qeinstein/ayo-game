'use client';

import React, { useEffect } from 'react';
import { AyoGameSession } from '@/lib/api';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw } from 'lucide-react';

interface WinModalProps {
  game: AyoGameSession;
  onPlayAgain: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ game, onPlayAgain }) => {
  const isP1Won = game.status === 'PLAYER_1_WON';
  const isDraw = game.status === 'DRAW';

  const winnerName = isDraw ? 'Draw' : isP1Won ? game.player1Name : game.player2Name;
  const loserName = isP1Won ? game.player2Name : game.player1Name;

  useEffect(() => {
    if (!isDraw) {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#b45309', '#f59e0b', '#0d9488', '#d97706'],
      });
    }
  }, [isDraw]);

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-md">
      <div className="card w-full max-w-md animate-scale-in p-7 text-center sm:p-8">
        <div className="mx-auto mb-5 inline-flex rounded-2xl border border-wood-brass/30 bg-wood-brass/10 p-4 text-wood-brass">
          <Trophy className="h-8 w-8" />
        </div>

        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-wood-brass">
          {isDraw ? 'Match drawn' : 'Winner'}
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          {isDraw ? 'A dead heat' : `${winnerName} wins`}
        </h2>
        {!isDraw && (
          <p className="mt-2 text-sm text-slate-500">
            <span className="text-jade">{winnerName}</span> takes the match over{' '}
            <span className="text-slate-600">{loserName}</span>.
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-line">
          <div className="p-4">
            <span className="block text-[11px] uppercase tracking-wide text-slate-500">{game.player1Name}</span>
            <span className="mt-1 block text-3xl font-semibold tabular-nums text-slate-900">
              {game.board.player1Captured}
            </span>
            <span className="text-[10px] text-slate-400">seeds</span>
          </div>
          <div className="border-l border-line p-4">
            <span className="block text-[11px] uppercase tracking-wide text-slate-500">{game.player2Name}</span>
            <span className="mt-1 block text-3xl font-semibold tabular-nums text-slate-900">
              {game.board.player2Captured}
            </span>
            <span className="text-[10px] text-slate-400">seeds</span>
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-wood-brass px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-wood-brassHover active:scale-[0.99]"
        >
          <RefreshCw className="h-4 w-4" />
          Play again
        </button>
      </div>
    </div>
  );
};
