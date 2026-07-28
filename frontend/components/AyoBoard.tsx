'use client';

import React from 'react';
import { Player, AyoBoard as AyoBoardModel } from '@/lib/api';

interface AyoBoardProps {
  board: AyoBoardModel;
  currentTurn: Player;
  isAiThinking?: boolean;
  onMakeMove: (pitIndex: number) => void;
  player1Name: string;
  player2Name: string;
}

export const AyoBoard: React.FC<AyoBoardProps> = ({
  board,
  currentTurn,
  isAiThinking,
  onMakeMove,
  player1Name,
  player2Name,
}) => {
  const isP1Turn = currentTurn === 'PLAYER_1';

  // Top row: Player 2 pits (11 down to 6)
  const player2Pits = [11, 10, 9, 8, 7, 6];
  // Bottom row: Player 1 pits (0 to 5)
  const player1Pits = [0, 1, 2, 3, 4, 5];

  const renderPit = (pitIndex: number, owner: Player) => {
    const seedCount = board.pits[pitIndex];
    const isOwnerTurn = currentTurn === owner;
    const canClick = isOwnerTurn && seedCount > 0 && !isAiThinking;

    return (
      <button
        key={pitIndex}
        onClick={() => canClick && onMakeMove(pitIndex)}
        disabled={!canClick}
        className={`group relative flex flex-col items-center justify-center p-1.5 sm:p-2 transition-all duration-300 ${
          canClick
            ? 'cursor-pointer hover:scale-105 active:scale-95'
            : 'cursor-not-allowed opacity-90'
        }`}
      >
        {/* Carved 3D Pit Hole */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full pit-3d flex items-center justify-center relative overflow-hidden transition-all duration-300 border ${
            canClick
              ? 'border-wood-brass/40 group-hover:border-wood-brass group-hover:shadow-[0_0_20px_rgba(197,168,128,0.25)]'
              : 'border-wood-rim/40'
          }`}
        >
          {/* Realistic 3D Organic Seed Cluster */}
          <div className="relative w-full h-full p-2 flex flex-wrap items-center justify-center gap-0.5 sm:gap-1">
            {Array.from({ length: Math.min(seedCount, 8) }).map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-transform duration-300 ${
                  canClick ? 'seed-3d-active' : 'seed-3d-sphere'
                }`}
                style={{
                  transform: `translate(${(i % 3 - 1) * 3}px, ${Math.floor(i / 3 - 1) * 3}px) rotate(${i * 45}deg)`,
                }}
              />
            ))}
          </div>

          {/* Minimalist 3D Seed Count Badge */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-transparent transition-colors">
            <span
              className={`text-sm sm:text-base lg:text-lg font-extrabold tracking-wider ${
                seedCount > 0
                  ? canClick
                    ? 'text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                    : 'text-neutral-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                  : 'text-neutral-600/60'
              }`}
            >
              {seedCount}
            </span>
          </div>
        </div>

        {/* Minimal Pit Label */}
        <span className="mt-1 text-[10px] sm:text-xs font-medium text-neutral-400/60 group-hover:text-wood-brass transition-colors">
          Pit {pitIndex + 1}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Ọpọ́n Ayò Carved 3D Wood Board Container */}
      <div className="relative p-5 sm:p-8 rounded-[2.5rem] board-3d space-y-5">
        
        {/* Top Board Header */}
        <div className="flex items-center justify-between px-3">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              !isP1Turn
                ? 'bg-wood-brass/15 text-wood-brass border border-wood-brass/30'
                : 'text-neutral-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400/80" />
            <span>{player2Name} (North)</span>
            {!isP1Turn && <span className="text-[9px] font-bold uppercase tracking-wider text-wood-brass">TURN</span>}
          </div>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-400/50">
            ỌPỌ́N AYÒ
          </span>
        </div>

        {/* Pits Grid: 2 Parallel Rows of 6 Pits */}
        <div className="bg-[#120A06]/90 p-4 sm:p-6 rounded-3xl border border-white/5 space-y-4 sm:space-y-6 shadow-inner">
          {/* Player 2 Pits (11 to 6) */}
          <div className="grid grid-cols-6 gap-2 sm:gap-4 justify-items-center">
            {player2Pits.map((pit) => renderPit(pit, 'PLAYER_2'))}
          </div>

          {/* Center Divider Line */}
          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-white/5" />
            <span className="absolute bg-[#120A06] px-4 text-[9px] font-medium tracking-widest text-neutral-400/50 uppercase">
              Counter-Clockwise ↺
            </span>
          </div>

          {/* Player 1 Pits (0 to 5) */}
          <div className="grid grid-cols-6 gap-2 sm:gap-4 justify-items-center">
            {player1Pits.map((pit) => renderPit(pit, 'PLAYER_1'))}
          </div>
        </div>

        {/* Bottom Board Footer */}
        <div className="flex items-center justify-between px-3">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              isP1Turn
                ? 'bg-wood-brass/15 text-wood-brass border border-wood-brass/30'
                : 'text-neutral-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
            <span>{player1Name} (South)</span>
            {isP1Turn && <span className="text-[9px] font-bold uppercase tracking-wider text-wood-brass">YOUR TURN</span>}
          </div>

          {isAiThinking && (
            <div className="flex items-center gap-2 text-xs text-wood-brass animate-pulse">
              <div className="w-3 h-3 border-2 border-wood-brass border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium">Ọ̀tá Bot computing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
