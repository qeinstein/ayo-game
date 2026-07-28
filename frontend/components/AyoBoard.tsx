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

  // Top row: Player 2 pits (6 to 11, displayed 11 down to 6 for standard board orientation)
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
        className={`group relative flex flex-col items-center justify-center p-2 rounded-full aspect-square transition-all duration-300 ${
          canClick
            ? 'cursor-pointer hover:scale-105 active:scale-95 hover:ring-2 hover:ring-wood-gold'
            : 'cursor-not-allowed opacity-90'
        }`}
      >
        {/* Carved Pit Recess */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full pit-inset bg-gradient-to-b from-[#0F0704] to-[#251208] flex items-center justify-center relative overflow-hidden border ${
            canClick
              ? 'border-wood-gold/40 group-hover:border-wood-gold group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]'
              : 'border-wood-rim/40'
          }`}
        >
          {/* Visual Seed Cluster */}
          <div className="relative w-full h-full p-2 flex flex-wrap items-center justify-center gap-1">
            {Array.from({ length: Math.min(seedCount, 8) }).map((_, i) => (
              <span
                key={i}
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-amber-100 via-neutral-300 to-neutral-500 seed-shadow transform transition-transform duration-300 group-hover:rotate-12"
                style={{
                  transform: `translate(${(i % 3 - 1) * 3}px, ${Math.floor(i / 3 - 1) * 3}px)`,
                }}
              />
            ))}
          </div>

          {/* Seed Count Badge */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
            <span
              className={`text-sm sm:text-base lg:text-lg font-black tracking-wider shadow-sm ${
                seedCount > 0 ? 'text-amber-100' : 'text-neutral-600'
              }`}
            >
              {seedCount}
            </span>
          </div>
        </div>

        {/* Pit Number Label */}
        <span className="mt-1 text-[10px] sm:text-xs font-semibold text-amber-200/50 group-hover:text-wood-gold transition-colors">
          Pit {pitIndex + 1}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Ọpọ́n Ayò Main Carved Wooden Board */}
      <div className="relative p-4 sm:p-8 rounded-[2.5rem] bg-gradient-to-b from-[#2E180D] via-[#1E0D05] to-[#120703] border-4 border-wood-rim/60 shadow-2xl shadow-black/80 space-y-6">
        
        {/* Board Top Header: Player 2 Label & Active Turn Banner */}
        <div className="flex items-center justify-between px-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            !isP1Turn ? 'bg-wood-gold/20 text-wood-gold border border-wood-gold/30 animate-pulse-slow' : 'text-amber-200/50'
          }`}>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{player2Name} (North)</span>
            {!isP1Turn && <span className="text-[10px] text-wood-gold font-bold">TURN</span>}
          </div>
          <span className="text-[10px] tracking-widest uppercase font-bold text-wood-gold/40">ỌPỌ́N AYÒ</span>
        </div>

        {/* Pits Grid: 2 Parallel Rows of 6 Pits */}
        <div className="bg-[#170A04]/90 p-4 sm:p-6 rounded-3xl border border-wood-gold/15 space-y-4 sm:space-y-6">
          {/* Top Row: Player 2 (Pits 11 to 6) */}
          <div className="grid grid-cols-6 gap-2 sm:gap-4 justify-items-center">
            {player2Pits.map((pit) => renderPit(pit, 'PLAYER_2'))}
          </div>

          {/* Center Divider with Cultural Wood Texture Motif */}
          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-dashed border-wood-gold/20" />
            <span className="absolute bg-[#170A04] px-4 text-[10px] font-medium tracking-widest text-wood-gold/60 uppercase">
              Counter-Clockwise Sowing ↺
            </span>
          </div>

          {/* Bottom Row: Player 1 (Pits 0 to 5) */}
          <div className="grid grid-cols-6 gap-2 sm:gap-4 justify-items-center">
            {player1Pits.map((pit) => renderPit(pit, 'PLAYER_1'))}
          </div>
        </div>

        {/* Board Bottom Footer: Player 1 Label & Active Turn Banner */}
        <div className="flex items-center justify-between px-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            isP1Turn ? 'bg-wood-gold/20 text-wood-gold border border-wood-gold/30 animate-pulse-slow' : 'text-amber-200/50'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{player1Name} (South)</span>
            {isP1Turn && <span className="text-[10px] text-wood-gold font-bold">YOUR TURN</span>}
          </div>

          {isAiThinking && (
            <div className="flex items-center gap-2 text-xs text-wood-gold animate-pulse">
              <div className="w-3 h-3 border-2 border-wood-gold border-t-transparent rounded-full animate-spin" />
              <span>Ọ̀tá Bot thinking...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
