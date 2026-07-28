'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Player, AyoBoard as AyoBoardModel } from '@/lib/api';

const BoardCanvas = dynamic(() => import('./board/BoardCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-neutral-500">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-wood-brass/70 border-t-transparent" />
        <span className="text-xs tracking-wide">Carving the Ọpọ́n Ayò…</span>
      </div>
    </div>
  ),
});

interface AyoBoardProps {
  board: AyoBoardModel;
  currentTurn: Player;
  isAiThinking?: boolean;
  onMakeMove: (pitIndex: number) => void;
  player1Name: string;
  player2Name: string;
}

const TurnChip: React.FC<{ active: boolean; label: string; sub: string; dot: string }> = ({
  active, label, sub, dot,
}) => (
  <div
    className={`flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 transition-colors ${
      active ? 'border-wood-brass/40 bg-wood-brass/10' : 'border-line bg-panel2/40'
    }`}
  >
    <span className="relative flex h-2 w-2">
      {active && <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: dot }} />}
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: dot }} />
    </span>
    <div className="leading-tight">
      <span className="block text-[13px] font-medium text-neutral-100">{label}</span>
      <span className="block text-[10px] uppercase tracking-[0.16em] text-neutral-500">{sub}</span>
    </div>
    {active && (
      <span className="ml-1 rounded-full bg-wood-brass/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-wood-brass">
        Turn
      </span>
    )}
  </div>
);

export const AyoBoard: React.FC<AyoBoardProps> = ({
  board, currentTurn, isAiThinking, onMakeMove, player1Name, player2Name,
}) => {
  const isP1Turn = currentTurn === 'PLAYER_1';

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="card overflow-hidden p-2 sm:p-3">
        {/* North player */}
        <div className="flex items-center justify-between px-2 py-2">
          <TurnChip active={!isP1Turn} label={player2Name} sub="North" dot="#f5c563" />
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-600 sm:block">
            Ọpọ́n&nbsp;Ayò
          </span>
        </div>

        {/* 3D board */}
        <div className="relative h-[380px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#120c08] to-[#0b0806] sm:h-[460px] lg:h-[500px]">
          <BoardCanvas
            board={board}
            currentTurn={currentTurn}
            isAiThinking={isAiThinking}
            onMakeMove={onMakeMove}
          />
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.3em] text-neutral-600">
            Counter-clockwise&nbsp;↺&nbsp;· drag to admire
          </div>
        </div>

        {/* South player */}
        <div className="flex items-center justify-between px-2 py-2">
          <TurnChip active={isP1Turn} label={player1Name} sub="South" dot="#34d399" />
          {isAiThinking ? (
            <div className="flex items-center gap-2 text-xs font-medium text-wood-brass">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-wood-brass border-t-transparent" />
              <span>Ọ̀tá Bot is thinking…</span>
            </div>
          ) : (
            <span className="hidden text-[11px] text-neutral-500 sm:block">
              Tap a glowing pit on your row to sow
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
