#!/usr/bin/env node
/**
 * scripts/hooks/dual-adapter.mjs
 *
 * Motor Dual-Adapter de Hooks de Segurança e Governança.
 * Compatível simultaneamente com:
 *   1. Google Antigravity (.agents/hooks.json -> stdin.toolCall)
 *   2. Claude Code (.claude/settings.json -> stdin.tool_name / stdin.tool_input)
 *
 * Não depende de `jq` — usa apenas Node.js nativo.
 */

import fs from 'node:fs';
import { execSync } from 'node:child_process';

const ruleName = process.argv[2];

function readStdin() {
  try {
    const raw = fs.readFileSync(0, 'utf8').trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function normalizeInput(payload) {
  const isAntigravity = Boolean(payload && payload.toolCall);
  const rawToolName = isAntigravity ? payload.toolCall?.name || '' : payload?.tool_name || '';
  const args = isAntigravity ? payload.toolCall?.args || {} : payload?.tool_input || {};

  const filePath =
    args.Path ||
    args.file_path ||
    args.path ||
    args.SearchPath ||
    args.DirectoryPath ||
    '';

  const commandLine = args.CommandLine || args.command || '';

  return {
    isAntigravity,
    rawToolName,
    args,
    filePath: String(filePath),
    commandLine: String(commandLine),
  };
}

function respond(isAntigravity, decision, reason = '', additionalContext = '') {
  if (isAntigravity) {
    const out = { decision };
    if (reason || additionalContext) {
      out.reason = [reason, additionalContext].filter(Boolean).join(' | ');
    }
    process.stdout.write(JSON.stringify(out) + '\n');
    return;
  }

  // Formato nativo Claude Code PreToolUse
  const hookSpecificOutput = {
    hookEventName: 'PreToolUse',
    permissionDecision: decision === 'force_ask' ? 'ask' : decision,
  };
  if (reason) {
    hookSpecificOutput.permissionDecisionReason = reason;
  }
  if (additionalContext) {
    hookSpecificOutput.additionalContext = additionalContext;
  }
  process.stdout.write(JSON.stringify({ hookSpecificOutput }) + '\n');
}

function isSensitiveSecretPath(targetPath) {
  if (!targetPath) return false;
  const normalized = targetPath.replace(/\\/g, '/');
  const base = normalized.split('/').pop() || '';

  // Permite sempre arquivos de exemplo/template
  if (
    base === '.env.example' ||
    base === '.env.sample' ||
    base === '.env.template' ||
    normalized.endsWith('.env.example')
  ) {
    return false;
  }

  if (/^\.env(\..+)?$/.test(base)) return true;
  if (/\.(pem|key|p12|pfx)$/i.test(base)) return true;
  if (base === 'credentials.json' || base === 'service-account.json') return true;

  return false;
}

function checkBlockSecretsRead(ctx) {
  if (isSensitiveSecretPath(ctx.filePath)) {
    return respond(
      ctx.isAntigravity,
      'deny',
      `[Segurança] Leitura bloqueada: '${ctx.filePath}' contém credenciais sensíveis. Leia apenas '.env.example'.`
    );
  }

  // Checa se comando bash tenta dar cat/less/head/tail/grep em .env real
  if (ctx.commandLine) {
    const touchesEnv = /(?:^|\s|\/)\.env(?!\.example|\.sample|\.template)(?:\b|\s|$)/i.test(
      ctx.commandLine
    );
    const touchesKeys = /\b(credentials\.json|service-account\.json|\S+\.pem|\S+\.key)\b/i.test(
      ctx.commandLine
    );
    if (touchesEnv || touchesKeys) {
      return respond(
        ctx.isAntigravity,
        'deny',
        '[Segurança] Comando bloqueado por tentar acessar arquivo de segredo (.env / chave privada).'
      );
    }
  }

  return respond(ctx.isAntigravity, 'allow');
}

function checkBlockSecretsCommit(ctx) {
  if (!/\bgit\s+commit\b/.test(ctx.commandLine)) {
    return respond(ctx.isAntigravity, 'allow');
  }

  try {
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const file of stagedFiles) {
      if (isSensitiveSecretPath(file)) {
        return respond(
          ctx.isAntigravity,
          'deny',
          `[Segurança] Commit bloqueado: arquivo sensível '${file}' está no stage do Git.`
        );
      }
    }

    const stagedDiff = execSync('git diff --cached', { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
    // Credencial de dev local conhecida e proposital do template (docker-compose, .env.example,
    // fallbacks de connection string) — nunca é um segredo real, então não deve disparar o alerta.
    const KNOWN_SAFE_DEFAULTS = [/postgres(?:ql)?:\/\/postgres:postgres@(?:localhost|127\.0\.0\.1)/gi];
    const sanitizedDiff = KNOWN_SAFE_DEFAULTS.reduce(
      (text, pattern) => text.replace(pattern, ''),
      stagedDiff
    );
    const secretRegex =
      /(sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z-_]{35}|ghp_[0-9a-zA-Z]{36}|postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@)/;
    if (secretRegex.test(sanitizedDiff) && !stagedFiles.every((f) => f.endsWith('.env.example') || f.endsWith('.md'))) {
      return respond(
        ctx.isAntigravity,
        'deny',
        '[Segurança] Commit bloqueado: possível chave de API ou senha detectada no diff staged.'
      );
    }
  } catch {
    // Repositório ainda sem git init ou sem stage
  }

  return respond(ctx.isAntigravity, 'allow');
}

function checkProtectBranches(ctx) {
  if (!/\bgit\s+(commit|push|merge)\b/.test(ctx.commandLine)) {
    return respond(ctx.isAntigravity, 'allow');
  }

  try {
    const isAdmin = execSync('git config --get project.admin', { encoding: 'utf8' }).trim() === 'true';
    if (isAdmin) {
      return respond(ctx.isAntigravity, 'allow');
    }
  } catch {
    // project.admin não configurado
  }

  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    if (branch === 'main' || branch === 'master' || branch === 'develop') {
      return respond(
        ctx.isAntigravity,
        'deny',
        `[Governança Git] Operação bloqueada na branch protegida '${branch}'. Crie uma branch 'feature/<nome>' ou configure 'git config project.admin true'.`
      );
    }
  } catch {
    // Git ainda não inicializado
  }

  return respond(ctx.isAntigravity, 'allow');
}

function checkDangerousBashGuard(ctx) {
  const cmd = ctx.commandLine;
  if (!cmd) return respond(ctx.isAntigravity, 'allow');

  const hardBlockPatterns = [
    /\brm\s+-rf\s+\/(\s|$)/,
    /\brm\s+-rf\s+~(\s|\/|$)/,
    /\bgit\s+push\b.*(?:\s--force\b|\s-f\b)/,
    /\bDROP\s+DATABASE\b/i,
  ];

  for (const pattern of hardBlockPatterns) {
    if (pattern.test(cmd)) {
      return respond(
        ctx.isAntigravity,
        'deny',
        `[Segurança] Comando destrutivo bloqueado pelo guardrail: '${cmd}'.`
      );
    }
  }

  const askPatterns = [/\bgit\s+reset\s+--hard\b/, /\bDROP\s+TABLE\b/i, /\bTRUNCATE\s+TABLE\b/i];
  for (const pattern of askPatterns) {
    if (pattern.test(cmd)) {
      return respond(
        ctx.isAntigravity,
        'ask',
        `[Atenção] Comando potencialmente destrutivo detectado ('${cmd}'). Confirma a execução?`
      );
    }
  }

  return respond(ctx.isAntigravity, 'allow');
}

function checkContextReminder(ctx) {
  const p = ctx.filePath.replace(/\\/g, '/');
  if (!p) return respond(ctx.isAntigravity, 'allow');

  let reminder = '';
  if (p.includes('packages/shared/')) {
    reminder =
      'Lembrete de Camada (@mvp/shared): Siga .agents/rules/01-shared-contracts.md (Zero dependência de framework, exporte Schema Zod + tipo inferido, funções puras em domain/).';
  } else if (p.includes('apps/api/prisma') || p.includes('apps/api/src/common/prisma/')) {
    reminder =
      'Lembrete de Camada (Database Prisma): Siga .agents/rules/04-database-prisma.md (UUID PK, timestamps UTC, snake_case via @map, soft delete com deletedAt, índices explícitos e seeds idempotentes com upsert).';
  } else if (p.includes('apps/api/')) {
    reminder =
      'Lembrete de Camada (@mvp/api NestJS): Siga .agents/rules/02-backend-nestjs.md (Controller -> Service -> Repository, validação Zod via @mvp/shared e envelope de erro padronizado).';
  } else if (p.includes('apps/web/')) {
    reminder =
      'Lembrete de Camada (@mvp/web Next.js): Siga .agents/rules/03-frontend-nextjs.md (Zero fetch/regra no JSX, use View-Model hook e trate Loading/Empty/Error/Success).';
  }

  return respond(ctx.isAntigravity, 'allow', '', reminder);
}

function main() {
  const payload = readStdin();
  const ctx = normalizeInput(payload);

  switch (ruleName) {
    case 'block-secrets-read':
      return checkBlockSecretsRead(ctx);
    case 'block-secrets-commit':
      return checkBlockSecretsCommit(ctx);
    case 'protect-branches':
      return checkProtectBranches(ctx);
    case 'dangerous-bash-guard':
      return checkDangerousBashGuard(ctx);
    case 'context-reminder':
      return checkContextReminder(ctx);
    default:
      return respond(ctx.isAntigravity, 'allow');
  }
}

main();

