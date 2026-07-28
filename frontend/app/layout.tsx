import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Ayo — Mancala Strategy Game',
  description:
    'A clean, full-stack implementation of Ayo, the classic count-and-capture (Mancala) strategy game. Real-time 3D board, authentic rules, and a minimax AI opponent over a concurrent Spring Boot service.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink text-slate-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
