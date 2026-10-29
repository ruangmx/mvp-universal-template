import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Layers, CheckSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MVP Universal Template',
  description: 'Template de MVP de Alta Performance com Next.js, NestJS e Prisma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
            <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white hover:opacity-80 transition">
                <Layers className="h-6 w-6 text-blue-500" />
                <span>MVP Template 2.0</span>
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium text-zinc-400">
                <Link href="/" className="hover:text-white transition">
                  Início
                </Link>
                <Link href="/tasks" className="flex items-center gap-1.5 hover:text-white transition">
                  <CheckSquare className="h-4 w-4 text-blue-400" />
                  <span>Tarefas (Molde)</span>
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
            Universal Agentic Monorepo • Antigravity + Claude Code
          </footer>
        </div>
      </body>
    </html>
  );
}

