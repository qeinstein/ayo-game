'use client';

import React, { useState } from 'react';
import { GameMode } from '@/lib/api';
import { Users, Bot, Play } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (mode: GameMode, player1Name?: string, player2Name?: string) => void;
  isLoading: boolean;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, isLoading }) => {
  const [mode, setMode] = useState<GameMode>('VS_AI');
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame(mode, player1Name, player2Name);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#141416] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold tracking-wider text-wood-brass uppercase">
          Ọpọ́n Ayò Setup
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100">
          Start Your Ayò Match
        </h2>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto">
          Tactical foresight, quick arithmetic, and pattern recognition in the ancient Yoruba Game of Intellectuals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mode Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Game Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('VS_AI')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 ${
                mode === 'VS_AI'
                  ? 'bg-wood-brass/15 border-wood-brass/60 text-neutral-100 shadow-md'
                  : 'bg-white/5 border-white/5 text-neutral-400 hover:border-white/20'
              }`}
            >
              <Bot className="w-5 h-5 mb-1.5 text-wood-brass" />
              <span className="text-xs font-semibold">VS Ọ̀tá Bot</span>
              <span className="text-[10px] text-neutral-500">Single player AI</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('PASS_AND_PLAY')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 ${
                mode === 'PASS_AND_PLAY'
                  ? 'bg-wood-brass/15 border-wood-brass/60 text-neutral-100 shadow-md'
                  : 'bg-white/5 border-white/5 text-neutral-400 hover:border-white/20'
              }`}
            >
              <Users className="w-5 h-5 mb-1.5 text-wood-brass" />
              <span className="text-xs font-semibold">Pass &amp; Play</span>
              <span className="text-[10px] text-neutral-500">2 Players local</span>
            </button>
          </div>
        </div>

        {/* Player Names Input */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Player 1 (South / Bottom Row)
            </label>
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-wood-brass/60 transition-colors"
              placeholder="Player 1 Name"
              required
            />
          </div>

          {mode === 'PASS_AND_PLAY' && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Player 2 (North / Top Row)
              </label>
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-wood-brass/60 transition-colors"
                placeholder="Player 2 Name"
                required
              />
            </div>
          )}
        </div>

        {/* Start Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-2xl bg-wood-brass hover:bg-wood-brass/90 text-black font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Begin Ayò Match</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
