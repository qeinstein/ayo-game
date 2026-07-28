'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { GameSetup } from '@/components/GameSetup';
import { AyoBoard } from '@/components/AyoBoard';
import { ScoreCard } from '@/components/ScoreCard';
import { MoveHistory } from '@/components/MoveHistory';
import { RulesModal } from '@/components/RulesModal';
import { WinModal } from '@/components/WinModal';
import { createGame, makeMove, AyoGameSession, GameMode } from '@/lib/api';

export default function Home() {
  const [game, setGame] = useState<AyoGameSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handleStartGame = async (mode: GameMode, p1Name?: string, p2Name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await createGame(mode, p1Name, p2Name);
      setGame(session);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create game session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeMove = async (pitIndex: number) => {
    if (!game) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await makeMove(game.id, pitIndex);
      setGame((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          board: result.board,
          currentTurn: result.nextTurn,
          status: result.status,
          history: result.history,
        };
      });

      // Visual AI thinking state
      if (game.mode === 'VS_AI' && result.nextTurn === 'PLAYER_2' && result.status === 'IN_PROGRESS') {
        setIsAiThinking(true);
        setTimeout(() => setIsAiThinking(false), 600);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid move execution.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGame(null);
    setError(null);
  };

  const isGameOver = Boolean(
    game && (game.status === 'PLAYER_1_WON' || game.status === 'PLAYER_2_WON' || game.status === 'DRAW')
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar mode={game?.mode} onReset={handleReset} onOpenRules={() => setIsRulesOpen(true)} />

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-7 sm:px-6 sm:py-9">
        {error && (
          <div className="animate-fade-in rounded-2xl border border-clay/30 bg-clay/10 px-4 py-3 text-center text-xs font-medium text-clay sm:text-sm">
            {error}
          </div>
        )}

        {!game ? (
          <div className="flex min-h-[72vh] items-center justify-center">
            <GameSetup onStartGame={handleStartGame} isLoading={isLoading} />
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            <ScoreCard
              board={game.board}
              currentTurn={game.currentTurn}
              player1Name={game.player1Name}
              player2Name={game.player2Name}
            />
            <AyoBoard
              board={game.board}
              currentTurn={game.currentTurn}
              isAiThinking={isAiThinking}
              onMakeMove={handleMakeMove}
              player1Name={game.player1Name}
              player2Name={game.player2Name}
            />
            <MoveHistory history={game.history} />
          </div>
        )}
      </main>

      <footer className="border-t border-line/70 py-5">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 text-[11px] text-neutral-500 sm:flex-row">
          <span>Ayò Ọlọ́pọ́n — Yoruba count &amp; capture · © {new Date().getFullYear()}</span>
          <Link href="/about" className="transition-colors hover:text-wood-brass">
            How it&apos;s built →
          </Link>
        </div>
      </footer>

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      {game && isGameOver && <WinModal game={game} onPlayAgain={handleReset} />}
    </div>
  );
}
