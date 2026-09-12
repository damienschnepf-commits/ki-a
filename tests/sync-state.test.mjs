import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sync, render, query } from '../src/sync-state.mjs';
const data = { export_current_state: [{ text: 'Grüße <script> & **Text**\nZeile 2' }], export_open_tasks: [], export_decisions: [{ approved: true, detail: null }], export_sessions: [{ id: 2 }, { id: 1 }] };
test('read-only SQL and schema validation', () => {
  assert.match(query(), /REPEATABLE READ READ ONLY/);
  assert.throws(() => query('public"; DELETE'), /PGSCHEMA/);
});
test('all columns, Unicode, escaped Markdown, empty views and JSON types', () => {
  const output = render(data);
  assert.match(output['CURRENT_STATE.md'], /Grüße &lt;script&gt;/);
  assert.match(output['OPEN_TASKS.md'], /Keine Einträge/);
  assert.deepEqual(JSON.parse(output['SESSION_INDEX.json']), [{ id: 1 }, { id: 2 }]);
  assert.throws(() => render({ ...data, export_sessions: null }));
});
test('successful export is repeatable; database and invalid-data failures preserve files', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'janny-sync-test-'));
  try {
    const run = (command, args, options) => {
      assert.ok(args.includes('-w'));
      assert.equal(options.env.PGDATABASE, 'janny_central');
      return { status: 0, stdout: JSON.stringify(data) };
    };
    await sync({ env: {}, run, outputDir: dir });
    await sync({ env: {}, run, outputDir: dir });
    for (const [name, content] of Object.entries(render(data))) assert.equal(await readFile(join(dir, name), 'utf8'), content);
    await writeFile(join(dir, 'CURRENT_STATE.md'), 'existing');
    await assert.rejects(sync({ env: {}, run: () => ({ status: 1, stderr: 'secret' }), outputDir: dir }), e => !e.message.includes('secret'));
    await assert.rejects(sync({ env: {}, run: () => ({ status: 0, stdout: '{}' }), outputDir: dir }));
    assert.equal(await readFile(join(dir, 'CURRENT_STATE.md'), 'utf8'), 'existing');
  } finally { await rm(dir, { recursive: true, force: true }); }
});
