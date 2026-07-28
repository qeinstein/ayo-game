'use client';

import React, { useState } from 'react';
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
    <div className="min-h-screen flex flex-col bg-wood-pattern">
      {/* Top Navbar */}
      <Navbar
        mode={game?.mode}
        onReset={handleReset}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs sm:text-sm text-center font-medium shadow-lg animate-fade-in">
            {error}
          </div>
        )}

        {!game ? (
          <div className="flex items-center justify-center min-h-[70vh]">
            <GameSetup onStartGame={handleStartGame} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Scorecard Component */}
            <ScoreCard
              board={game.board}
              currentTurn={game.currentTurn}
              player1Name={game.player1Name}
              player2Name={game.player2Name}
            />

            {/* Interactive Ọpọ́n Ayò Board */}
            <AyoBoard
              board={game.board}
              currentTurn={game.currentTurn}
              isAiThinking={isAiThinking}
              onMakeMove={handleMakeMove}
              player1Name={game.player1Name}
              player2Name={game.player2Name}
            />

            {/* Move Play History Log */}
            <MoveHistory history={game.history} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-amber-200/40 border-t border-wood-gold/10 bg-[#120703]">
        Ayò Ọlọ́pọ́n — Traditional Yoruba Mancala Game &copy; {new Date().getFullYear()}
      </footer>

      {/* Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      {game && isGameOver && <WinModal game={game} onPlayAgain={handleReset} />}
    </div>
  );
}
