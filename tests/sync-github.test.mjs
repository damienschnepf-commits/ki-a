import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { syncGithub, files } from '../src/sync-github.mjs';

test('database failure prevents any GitHub operation', async () => {
  await assert.rejects(syncGithub({ exportState: async () => { throw new Error('offline'); }, run: () => assert.fail('Git must not run') }));
});

for (const changed of [false, true]) test(`only the four exports are staged; changed=${changed}`, async () => {
  const calls = [];
  const result = await syncGithub({
    exportState: async ({ outputDir }) => {
      await mkdir(join(outputDir, 'repo'));
      for (const name of files) await writeFile(join(outputDir, name), 'test');
    },
    run: (_, args) => {
      calls.push(args);
      return { status: 0, stdout: args.includes('diff') ? (changed ? files.join('\n') : '') : args.includes('rev-parse') ? 'abc123' : '' };
    },
  });
  assert.equal(result.changed, changed);
  assert.deepEqual(calls.find(args => args.includes('add')).slice(3), ['--', ...files]);
  assert.equal(calls.some(args => args.includes('push')), changed);
  assert.ok(calls.every(args => !args.includes('--force')));
});

test('push rejection is reported as failure without leaking Git diagnostics', async () => {
  await assert.rejects(syncGithub({
    exportState: async ({ outputDir }) => {
      await mkdir(join(outputDir, 'repo'));
      for (const name of files) await writeFile(join(outputDir, name), 'test');
    },
    run: (_, args) => args.includes('push') ? { status: 1, stderr: 'secret' } : { status: 0, stdout: 'changed' },
  }), error => !error.message.includes('secret'));
});
