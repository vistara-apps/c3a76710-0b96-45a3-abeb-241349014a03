import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskFlow - Your daily tasks, clearer than ever',
  description: 'Master your workflow, on-chain. A mini-app for Farcaster users to manage their daily tasks and track project progress.',
  keywords: ['tasks', 'productivity', 'farcaster', 'base', 'blockchain'],
  authors: [{ name: 'TaskFlow Team' }],
  openGraph: {
    title: 'TaskFlow',
    description: 'Your daily tasks, clearer than ever. Master your workflow, on-chain.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
