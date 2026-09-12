import { spawnSync } from 'node:child_process';

const identifier = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function sqlLiteral(value) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replaceAll("'", "''")}'`;
}

export function runJsonQuery(sql, { env = process.env, run = spawnSync } = {}) {
  const schema = env.PGSCHEMA || 'public';
  if (!identifier.test(schema)) throw new Error('Ungültiges PGSCHEMA.');
  const result = run(env.PSQL_PATH || 'psql', [
    '-X', '-w', '-q', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-f', '-',
  ], {
    input: sql.replaceAll('__SCHEMA__', `"${schema}"`),
    encoding: 'utf8',
    windowsHide: true,
    timeout: 45000,
    maxBuffer: 32 * 1024 * 1024,
    env: {
      ...env,
      PGDATABASE: env.PGDATABASE || 'janny_central',
      PGCONNECT_TIMEOUT: '10',
      PGCLIENTENCODING: 'UTF8',
    },
  });
  if (result.error || result.status !== 0) {
    throw new Error('Datenbankzugriff fehlgeschlagen; keine Änderung bestätigt.');
  }
  const output = result.stdout.trim();
  const start = output.indexOf('{');
  const end = output.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('Datenbank lieferte kein JSON-Ergebnis.');
  try {
    return JSON.parse(output.slice(start, end + 1));
  } catch (error) {
    throw new Error('Datenbankantwort ist kein gültiges JSON.', { cause: error });
  }
}
