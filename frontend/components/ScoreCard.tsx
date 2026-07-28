'use client';

import React from 'react';
import { Player, AyoBoard as AyoBoardModel } from '@/lib/api';
import { Crown, Target } from 'lucide-react';

interface ScoreCardProps {
  board: AyoBoardModel;
  currentTurn: Player;
  player1Name: string;
  player2Name: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  board,
  player1Name,
  player2Name,
}) => {
  const WINNING_TARGET = 25;

  const p1Captured = board.player1Captured;
  const p2Captured = board.player2Captured;

  const p1Leader = p1Captured > p2Captured;
  const p2Leader = p2Captured > p1Captured;

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Player 1 Score Card */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 ${
        p1Leader
          ? 'bg-wood-board/90 border-wood-gold shadow-lg shadow-wood-gold/10'
          : 'bg-wood-dark/70 border-wood-gold/15'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="font-bold text-sm text-amber-100">{player1Name}</h3>
            {p1Leader && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-wood-gold/20 text-wood-gold font-extrabold border border-wood-gold/30">
                <Crown className="w-3 h-3" /> Ọ̀TÁ
              </span>
            )}
          </div>
          <span className="text-2xl font-black text-wood-gold">{p1Captured}</span>
        </div>

        {/* Progress to 25 seeds */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-amber-200/60">
            <span>Captured Seeds</span>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3 text-wood-gold" /> {WINNING_TARGET} to win
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-wood-gold/20">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-wood-gold transition-all duration-500"
              style={{ width: `${Math.min((p1Captured / WINNING_TARGET) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Player 2 Score Card */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 ${
        p2Leader
          ? 'bg-wood-board/90 border-wood-gold shadow-lg shadow-wood-gold/10'
          : 'bg-wood-dark/70 border-wood-gold/15'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h3 className="font-bold text-sm text-amber-100">{player2Name}</h3>
            {p2Leader && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-wood-gold/20 text-wood-gold font-extrabold border border-wood-gold/30">
                <Crown className="w-3 h-3" /> Ọ̀TÁ
              </span>
            )}
          </div>
          <span className="text-2xl font-black text-wood-gold">{p2Captured}</span>
        </div>

        {/* Progress to 25 seeds */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-amber-200/60">
            <span>Captured Seeds</span>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3 text-wood-gold" /> {WINNING_TARGET} to win
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-wood-gold/20">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-wood-gold transition-all duration-500"
              style={{ width: `${Math.min((p2Captured / WINNING_TARGET) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
