'use client';

import React from 'react';
import Link from 'next/link';
import { GameMode } from '@/lib/api';
import { BookOpen, RefreshCw, Users, Bot } from 'lucide-react';

interface NavbarProps {
  mode?: GameMode;
  onReset: () => void;
  onOpenRules: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mode, onReset, onOpenRules }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-wood-brass/30 bg-wood-brass/10 shadow-inner">
            <span className="text-base font-semibold text-wood-brass">à</span>
          </div>
          <div className="leading-tight">
            <h1 className="text-[15px] font-semibold tracking-tight text-neutral-100">Ayò Ọlọ́pọ́n</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Game of the Intellectuals</p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {mode && (
            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-panel2/50 px-3 py-1.5 text-[11px] font-medium text-neutral-300 sm:flex">
              {mode === 'VS_AI' ? <Bot className="h-3.5 w-3.5 text-wood-brass" /> : <Users className="h-3.5 w-3.5 text-wood-brass" />}
              {mode === 'VS_AI' ? 'vs Ọ̀tá Bot' : 'Pass & Play'}
            </span>
          )}

          <Link
            href="/about"
            className="hidden rounded-lg px-3 py-1.5 text-[12px] font-medium text-neutral-400 transition-colors hover:text-neutral-100 sm:block"
          >
            About
          </Link>

          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-panel2/50 px-3 py-1.5 text-[12px] font-medium text-neutral-300 transition-colors hover:border-line hover:text-neutral-100"
          >
            <BookOpen className="h-3.5 w-3.5 text-wood-brass" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {mode && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg bg-wood-brass px-3.5 py-1.5 text-[12px] font-semibold text-black shadow-glow transition-transform active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>New match</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
