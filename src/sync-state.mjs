import { spawnSync } from 'node:child_process';
import { mkdir, writeFile, rename, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const views = ['export_current_state', 'export_open_tasks', 'export_decisions', 'export_sessions'];
const files = ['CURRENT_STATE.md', 'OPEN_TASKS.md', 'DECISIONS.md', 'SESSION_INDEX.json'];
const titles = ['Current State', 'Open Tasks', 'Decisions'];

export function query(schema = 'public') {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(schema)) throw new Error('Ungültiges PGSCHEMA.');
  const fields = views.map(v => `'${v}', (SELECT COALESCE(json_agg(t), '[]'::json) FROM "${schema}"."${v}" t)`);
  return `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY; SET LOCAL statement_timeout = '30s'; SELECT json_build_object(${fields.join(', ')}); COMMIT;`;
}

export function render(data) {
  for (const view of views) {
    if (!Array.isArray(data[view]) || data[view].some(row => !row || typeof row !== 'object' || Array.isArray(row))) {
      throw new Error(`Ungültige Exportdaten: ${view}`);
    }
  }
  // Column names and values remain data; no commands or templates are evaluated.
  const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/([\\`*_{}\[\]()#+.!|~-])/g, '\\$1');
  const valueText = value => value === null ? 'null' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return Object.fromEntries(views.map((view, i) => {
    // Canonical row order keeps repeated exports stable without assuming view columns.
    const rows = [...data[view]].sort((a, b) => {
      const x = JSON.stringify(a), y = JSON.stringify(b);
      return x < y ? -1 : x > y ? 1 : 0;
    });
    if (i === 3) return [files[i], JSON.stringify(rows, null, 2) + '\n'];
    const body = rows.map((row, n) => `## Eintrag ${n + 1}\n\n` + Object.entries(row).map(([key, value]) => `- **${escape(key)}:** ${escape(valueText(value)).replace(/\r?\n/g, '\n  ')}`).join('\n')).join('\n\n');
    return [files[i], `# ${titles[i]}\n\nQuelle: ${view}\n\n${body || 'Keine Einträge.'}\n`];
  }));
}

export async function sync({ env = process.env, run = spawnSync, outputDir = resolve(dirname(fileURLToPath(import.meta.url)), '..') } = {}) {
  const sql = query(env.PGSCHEMA || 'public');
  const result = run(env.PSQL_PATH || 'psql', ['-X', '-w', '-q', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-f', '-'], {
    input: sql, encoding: 'utf8', windowsHide: true, timeout: 45000, maxBuffer: 32 * 1024 * 1024,
    env: { ...env, PGDATABASE: env.PGDATABASE || 'janny_central', PGCONNECT_TIMEOUT: '10', PGCLIENTENCODING: 'UTF8' },
  });
  if (result.error || result.status !== 0) {
    // Do not echo database diagnostics: they can contain connection details or data.
    throw new Error('Datenbankexport fehlgeschlagen. PSQL_PATH, PG-Verbindung und lokale Anmeldung prüfen; keine Zieldateien geändert.');
  }
  const rendered = render(JSON.parse(result.stdout));
  const staging = resolve(outputDir, `.janny-sync-${process.pid}-${Date.now()}`);
  await mkdir(staging);
  try {
    for (const [name, content] of Object.entries(rendered)) await writeFile(resolve(staging, name), content, { encoding: 'utf8', mode: 0o600 });
    for (const name of files) await rename(resolve(staging, name), resolve(outputDir, name));
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
  return files;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  sync().then(names => console.log(`Exportiert: ${names.join(', ')}`)).catch(() => {
    console.error('Sync fehlgeschlagen. Verbindung, Export-Views, Ausgabeformat und Dateirechte prüfen.');
    process.exitCode = 1;
  });
}
