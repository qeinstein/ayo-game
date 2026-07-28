'use client';

import React from 'react';
import { Player, AyoBoard as AyoBoardModel } from '@/lib/api';
import { Crown } from 'lucide-react';

interface ScoreCardProps {
  board: AyoBoardModel;
  currentTurn: Player;
  player1Name: string;
  player2Name: string;
}

const WINNING_TARGET = 25;

const Side: React.FC<{
  name: string;
  captured: number;
  leading: boolean;
  active: boolean;
  dot: string;
  barFrom: string;
  align: 'left' | 'right';
}> = ({ name, captured, leading, active, dot, barFrom, align }) => (
  <div
    className={`card p-4 transition-colors ${active ? 'border-wood-brass/40' : ''} ${
      align === 'right' ? 'text-right' : ''
    }`}
  >
    <div className={`mb-3 flex items-center gap-2 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
      <h3 className="text-sm font-medium text-slate-700">{name}</h3>
      {leading && (
        <span className="flex items-center gap-1 rounded-full bg-wood-brass/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-wood-brass">
          <Crown className="h-3 w-3" /> Lead
        </span>
      )}
    </div>

    <div className={`flex items-end gap-1.5 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      <span className="text-3xl font-semibold tabular-nums text-slate-900">{captured}</span>
      <span className="mb-1 text-[11px] text-slate-500">/ {WINNING_TARGET} seeds</span>
    </div>

    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${Math.min((captured / WINNING_TARGET) * 100, 100)}%`,
          background: `linear-gradient(90deg, ${barFrom}, #b45309)`,
        }}
      />
    </div>
  </div>
);

export const ScoreCard: React.FC<ScoreCardProps> = ({ board, currentTurn, player1Name, player2Name }) => {
  const p1 = board.player1Captured;
  const p2 = board.player2Captured;

  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-3">
      <Side
        name={player1Name}
        captured={p1}
        leading={p1 > p2}
        active={currentTurn === 'PLAYER_1'}
        dot="#0d9488"
        barFrom="#0d9488"
        align="left"
      />
      <Side
        name={player2Name}
        captured={p2}
        leading={p2 > p1}
        active={currentTurn === 'PLAYER_2'}
        dot="#d97706"
        barFrom="#d97706"
        align="right"
      />
    </div>
  );
};
