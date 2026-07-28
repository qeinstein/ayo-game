'use client';

import React, { useState } from 'react';
import { GameMode } from '@/lib/api';
import { Users, Bot, ArrowRight } from 'lucide-react';

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

  const modes: { key: GameMode; icon: typeof Bot; title: string; sub: string }[] = [
    { key: 'VS_AI', icon: Bot, title: 'vs Ọ̀tá Bot', sub: 'Minimax AI opponent' },
    { key: 'PASS_AND_PLAY', icon: Users, title: 'Pass & Play', sub: 'Two players, one device' },
  ];

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="mb-8 text-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-wood-brass">Ọpọ́n Ayò</span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
          A quiet game of<br />foresight.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
          Sow, capture, and count your way to twenty-five seeds in the centuries-old Yoruba strategy classic.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 p-6 sm:p-7">
        <div className="space-y-2.5">
          <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {modes.map((m) => {
              const active = mode === m.key;
              const Icon = m.icon;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMode(m.key)}
                  className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
                    active
                      ? 'border-wood-brass/60 bg-wood-brass/10'
                      : 'border-line bg-panel2/30 hover:border-neutral-700'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-wood-brass' : 'text-neutral-500'}`} />
                  <div>
                    <span className="block text-[13px] font-medium text-neutral-100">{m.title}</span>
                    <span className="block text-[11px] text-neutral-500">{m.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
              Player 1 · South
            </label>
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="w-full rounded-xl border border-line bg-panel2/40 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-colors focus:border-wood-brass/60 focus:outline-none"
              placeholder="Player 1"
              required
            />
          </div>

          {mode === 'PASS_AND_PLAY' && (
            <div className="animate-fade-in">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                Player 2 · North
              </label>
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="w-full rounded-xl border border-line bg-panel2/40 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-colors focus:border-wood-brass/60 focus:outline-none"
                placeholder="Player 2"
                required
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-wood-brass px-6 py-3 text-sm font-semibold text-black shadow-glow transition-all hover:bg-wood-brassSoft active:scale-[0.99] disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
          ) : (
            <>
              Begin match
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
