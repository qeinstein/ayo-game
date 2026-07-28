'use client';

import React from 'react';
import { GameMode } from '@/lib/api';
import { BookOpen, RefreshCw, Trophy, Users, Bot } from 'lucide-react';

interface NavbarProps {
  mode?: GameMode;
  onReset: () => void;
  onOpenRules: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mode, onReset, onOpenRules }) => {
  return (
    <header className="w-full bg-[#1A0F0A]/90 backdrop-blur-md border-b border-wood-gold/20 py-3.5 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand & Cultural Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wood-gold to-amber-700 flex items-center justify-center shadow-lg shadow-wood-gold/10 border border-wood-gold/30">
            <Trophy className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-wood-gold to-amber-400 bg-clip-text text-transparent">
              Ayò Ọlọ́pọ́n
            </h1>
            <p className="text-[10px] sm:text-xs text-amber-200/60 font-medium">
              Traditional Yoruba Mancala Strategy
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          {mode && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-wood-board border border-wood-gold/30 text-xs text-amber-200 font-medium">
              {mode === 'VS_AI' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-wood-gold" /> VS Ọ̀tá Bot
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 text-wood-gold" /> Pass & Play
                </>
              )}
            </div>
          )}

          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wood-board/80 hover:bg-wood-board border border-wood-gold/20 hover:border-wood-gold/40 text-xs font-medium text-amber-200 transition-all duration-200"
          >
            <BookOpen className="w-3.5 h-3.5 text-wood-gold" />
            <span className="hidden sm:inline">Rules &amp; History</span>
            <span className="sm:hidden">Rules</span>
          </button>

          {mode && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wood-gold hover:bg-amber-400 text-black text-xs font-semibold shadow-md transition-all duration-200 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Match</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
