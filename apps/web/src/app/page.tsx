import Link from 'next/link';
import { CheckSquare, ArrowRight, ShieldCheck, Zap, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
          <Zap className="h-3.5 w-3.5" />
          Template Universal para MVPs com IA
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Construa seu MVP em Produção com Alta Engenharia
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">
          Arquitetura híbrida pronta para desenvolvimento com linguagem natural no Google Antigravity e no Claude Code.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/tasks">
            <Button size="lg" className="gap-2">
              Ver Feature Molde (Tarefas)
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <ShieldCheck className="h-8 w-8 text-emerald-400 mb-2" />
            <CardTitle>Contrato Único (@mvp/shared)</CardTitle>
            <CardDescription>
              Os mesmos Schemas Zod e regras puras de domínio compartilhadas entre Next.js e NestJS sem duplicar código.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Database className="h-8 w-8 text-blue-400 mb-2" />
            <CardTitle>PostgreSQL + Prisma ORM</CardTitle>
            <CardDescription>
              PostgreSQL local com Docker ou nuvem gratuita (Neon/Supabase) para múltiplos usuários em tempo real a custo zero.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CheckSquare className="h-8 w-8 text-purple-400 mb-2" />
            <CardTitle>Governança de Agentes</CardTitle>
            <CardDescription>
              10 skills operacionais, subagentes isolados, economia cirúrgica de tokens e guardrails de segurança.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

