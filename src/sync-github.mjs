import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sync } from './sync-state.mjs';

export const files = ['CURRENT_STATE.md', 'OPEN_TASKS.md', 'DECISIONS.md', 'SESSION_INDEX.json'];
const remote = 'https://github.com/damienschnepf-commits/Shared-files-with-Jenny.git';

// Export first: a failed database read must never publish stale local files.
export async function syncGithub({ exportState = sync, run = spawnSync } = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'janny-github-'));
  const checkout = join(dir, 'repo');
  const git = args => {
    const result = run('git', args, { cwd: dir, encoding: 'utf8', windowsHide: true,
      timeout: 60000, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
    if (result.error || result.status !== 0) throw new Error('GitHub-Sync fehlgeschlagen; Git-Zugang, Netzwerk und main prüfen.');
    return result.stdout.trim();
  };
  try {
    await exportState({ outputDir: dir });
    const contents = await Promise.all(files.map(name => readFile(join(dir, name), 'utf8')));
    git(['clone', '--quiet', '--depth', '1', '--branch', 'main', '--single-branch', remote, checkout]);
    for (let i = 0; i < files.length; i++) await writeFile(join(checkout, files[i]), contents[i], 'utf8');
    git(['-C', checkout, 'add', '--', ...files]);
    if (!git(['-C', checkout, 'diff', '--cached', '--name-only'])) return { changed: false, commit: git(['-C', checkout, 'rev-parse', 'HEAD']) };
    git(['-C', checkout, 'commit', '--quiet', '-m', 'Sync janny_central exports']);
    const commit = git(['-C', checkout, 'rev-parse', 'HEAD']);
    // No force: concurrent remote updates are rejected instead of overwritten.
    git(['-C', checkout, 'push', '--quiet', 'origin', 'HEAD:main']);
    return { changed: true, commit };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncGithub().then(result => console.log(`${result.changed ? 'Übertragen' : 'Unverändert'}: ${result.commit}`))
    .catch(() => { console.error('SQL→Dateien→GitHub fehlgeschlagen. Lokale Anmeldung, Netzwerk und Export-Views prüfen.'); process.exitCode = 1; });
}
