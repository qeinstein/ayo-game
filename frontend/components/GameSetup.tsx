'use client';

import React, { useState } from 'react';
import { GameMode } from '@/lib/api';
import { Users, Bot, Play, Sparkles } from 'lucide-react';

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
    <div className="w-full max-w-lg mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-wood-gold/30 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wood-gold/10 border border-wood-gold/20 text-xs font-semibold text-wood-gold">
          <Sparkles className="w-3.5 h-3.5" /> Ọpọ́n Ayò Match Setup
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-100">
          Begin Your Ayò Match
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/60 max-w-sm mx-auto">
          Test your tactical foresight, quick arithmetic, and pattern recognition in the ancient Yoruba Game of the Intellectuals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-wood-gold/90">
            Select Game Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('VS_AI')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 ${
                mode === 'VS_AI'
                  ? 'bg-wood-gold/20 border-wood-gold text-amber-100 shadow-lg shadow-wood-gold/10'
                  : 'bg-wood-dark/60 border-wood-gold/10 text-amber-200/50 hover:border-wood-gold/30'
              }`}
            >
              <Bot className="w-6 h-6 mb-1.5 text-wood-gold" />
              <span className="text-sm font-semibold">VS Ọ̀tá Bot</span>
              <span className="text-[10px] text-amber-200/50">Play against AI</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('PASS_AND_PLAY')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 ${
                mode === 'PASS_AND_PLAY'
                  ? 'bg-wood-gold/20 border-wood-gold text-amber-100 shadow-lg shadow-wood-gold/10'
                  : 'bg-wood-dark/60 border-wood-gold/10 text-amber-200/50 hover:border-wood-gold/30'
              }`}
            >
              <Users className="w-6 h-6 mb-1.5 text-wood-gold" />
              <span className="text-sm font-semibold">Pass &amp; Play</span>
              <span className="text-[10px] text-amber-200/50">2 Players on 1 device</span>
            </button>
          </div>
        </div>

        {/* Player Names Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-amber-200/80 mb-1.5">
              Player 1 (South / Bottom Row)
            </label>
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-wood-dark/80 border border-wood-gold/20 text-amber-100 placeholder-amber-200/30 text-sm focus:outline-none focus:border-wood-gold transition-colors"
              placeholder="Enter Player 1 Name"
              required
            />
          </div>

          {mode === 'PASS_AND_PLAY' && (
            <div>
              <label className="block text-xs font-medium text-amber-200/80 mb-1.5">
                Player 2 (North / Top Row)
              </label>
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-wood-dark/80 border border-wood-gold/20 text-amber-100 placeholder-amber-200/30 text-sm focus:outline-none focus:border-wood-gold transition-colors"
                placeholder="Enter Player 2 Name"
                required
              />
            </div>
          )}
        </div>

        {/* Start Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-wood-gold via-amber-400 to-amber-500 hover:brightness-110 text-black font-bold text-sm shadow-xl shadow-wood-gold/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Play className="w-4 h-4 fill-black" />
              <span>Start Ayò Match</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
