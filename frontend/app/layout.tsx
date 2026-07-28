import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ayò Ọlọ́pọ́n — Traditional Yoruba Mancala Strategy Game',
  description: 'An authentic implementation of Ayò Ọlọ́pọ́n, the Yoruba Game of the Intellectuals. Features 12 pits, anti-starvation feeding rules, grand slam protection, AI opponent, and Pass-and-Play modes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#120906] text-neutral-100 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
