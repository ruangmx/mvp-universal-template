#!/usr/bin/env node
/**
 * scripts/sync-agents.mjs
 *
 * Sincroniza os subagentes definidos em `.agents/agents/*.md` (Fonte da Verdade)
 * para `.claude/agents/*.md`, traduzindo os nomes das tools e modelos do formato
 * Google Antigravity para o formato nativo do Claude Code.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = path.resolve(path.dirname(__filename), '..');
const SOURCE_DIR = path.join(ROOT_DIR, '.agents', 'agents');
const TARGET_DIR = path.join(ROOT_DIR, '.claude', 'agents');

const TOOL_MAP = {
  read_file: 'Read',
  view_file: 'Read',
  view_file_outline: 'Read',
  view_code_item: 'Read',
  grep_search: 'Grep',
  find_by_name: 'Glob',
  list_dir: 'LS',
  run_command: 'Bash',
  edit_file: 'Edit',
  write_file: 'Write',
};

const MODEL_MAP = {
  flash: 'haiku',
  flash_lite: 'haiku',
  inherit: 'sonnet',
  pro: 'opus',
};

function translateFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return content;

  const [, rawYaml, body] = match;
  const lines = rawYaml.split('\n');

  let name = '';
  let description = '';
  let model = 'sonnet';
  const claudeTools = new Set();

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('name:')) {
      name = trimmed.replace(/^name:\s*/, '').trim();
    } else if (trimmed.startsWith('description:')) {
      description = trimmed.replace(/^description:\s*/, '').trim();
    } else if (trimmed.startsWith('model:')) {
      const agyModel = trimmed.replace(/^model:\s*/, '').trim();
      model = MODEL_MAP[agyModel] || 'sonnet';
    } else if (trimmed.startsWith('tools:')) {
      const rawTools = trimmed
        .replace(/^tools:\s*\[/, '')
        .replace(/\]$/, '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      for (const tool of rawTools) {
        if (TOOL_MAP[tool]) {
          claudeTools.add(TOOL_MAP[tool]);
        }
      }
    }
  }

  const toolsLine = claudeTools.size > 0 ? `tools: ${Array.from(claudeTools).join(', ')}\n` : '';
  const headerComment = `<!-- ARQUIVO GERADO AUTOMATICAMENTE POR scripts/sync-agents.mjs -->\n<!-- Edite a fonte da verdade em .agents/agents/${name}.md -->\n`;

  return `---\nname: ${name}\ndescription: ${description}\n${toolsLine}model: ${model}\n---\n\n${headerComment}${body.trimStart()}`;
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`[sync-agents] Diretório fonte não encontrado: ${SOURCE_DIR}`);
    process.exit(1);
  }

  fs.mkdirSync(TARGET_DIR, { recursive: true });

  const files = fs.readdirSync(SOURCE_DIR).filter((file) => file.endsWith('.md'));
  let count = 0;

  for (const file of files) {
    const srcPath = path.join(SOURCE_DIR, file);
    const destPath = path.join(TARGET_DIR, file);
    const content = fs.readFileSync(srcPath, 'utf8');
    const translated = translateFrontmatter(content);
    fs.writeFileSync(destPath, translated, 'utf8');
    count += 1;
  }

  console.log(`[sync-agents] ✅ ${count} subagente(s) sincronizado(s) de .agents/agents/ para .claude/agents/`);
}

main();

