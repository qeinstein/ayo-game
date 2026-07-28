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
    <header className="w-full bg-[#121215]/80 backdrop-blur-xl border-b border-white/5 py-3.5 px-4 sm:px-8 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand & Cultural Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-wood-board/80 border border-wood-brass/30 flex items-center justify-center shadow-md">
            <Trophy className="w-4 h-4 text-wood-brass" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-100">
              Ayò Ọlọ́pọ́n
            </h1>
            <p className="text-[10px] text-neutral-400 font-medium">
              Yoruba Count &amp; Capture Strategy
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {mode && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 font-medium">
              {mode === 'VS_AI' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-wood-brass" /> VS Ọ̀tá Bot
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 text-wood-brass" /> Pass &amp; Play
                </>
              )}
            </div>
          )}

          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 transition-all duration-200"
          >
            <BookOpen className="w-3.5 h-3.5 text-wood-brass" />
            <span className="hidden sm:inline">Rules &amp; History</span>
            <span className="sm:hidden">Rules</span>
          </button>

          {mode && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-wood-brass/90 hover:bg-wood-brass text-black text-xs font-semibold shadow-md transition-all duration-200 active:scale-95"
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
