import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Ayò Ọlọ́pọ́n — Yoruba Strategy, Reimagined',
  description:
    'A refined, full-stack implementation of Ayò Ọlọ́pọ́n — the Yoruba Game of the Intellectuals. Real-time 3D carved board, authentic count-and-capture rules, and a minimax AI opponent over a concurrent Spring Boot service.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink text-neutral-100 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
