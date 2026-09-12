import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createPlan, createPlanFromCentralState, loadCentralState } from "../src/jenny.mjs";
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test("Auftrag bleibt Daten und wird Jenny zugeordnet", () => {
  const plan = createPlan("  README prüfen; echo example  ");
  assert.equal(plan.request, "README prüfen; echo example");
  assert.equal(plan.project, "KI-Janny");
  assert.equal(plan.owner, "KI-Engineering Jenny");
  assert.equal(plan.status, "planned");
  assert.deepEqual(plan.delegatedAgents, []);
});

test('Jenny lädt den aktuellen Zustand aus den bestehenden Exportdateien', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'janny-state-test-'));
  const names = ['CURRENT_STATE.md', 'OPEN_TASKS.md', 'DECISIONS.md', 'SESSION_INDEX.json'];
  try {
    const refresh = async ({ outputDir }) => {
      await Promise.all([
        writeFile(join(outputDir, names[0]), '# Current State\n'),
        writeFile(join(outputDir, names[1]), '# Open Tasks\n'),
        writeFile(join(outputDir, names[2]), '# Decisions\n'),
        writeFile(join(outputDir, names[3]), '[{"session_code":"PC"}]\n'),
      ]);
    };
    const state = await loadCentralState({ refresh, stateDir: dir });
    assert.equal(state.currentState, '# Current State\n');
    assert.deepEqual(state.sessions, [{ session_code: 'PC' }]);
    const plan = await createPlanFromCentralState('Stand prüfen', { refresh, stateDir: dir });
    assert.equal(plan.centralState.decisions, '# Decisions\n');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('Jenny erstellt bei fehlendem zentralen Zustand keinen Plan', async () => {
  await assert.rejects(createPlanFromCentralState('Stand prüfen', {
    refresh: async () => { throw new Error('database unavailable'); },
  }), /Zentralen Zustand/);
});

test("Leere und ungültige Aufträge werden abgelehnt", () => {
  for (const input of ["", "  ", "\n", null, undefined, 42, {}]) {
    assert.throws(() => createPlan(input), TypeError);
  }
});

const cli = fileURLToPath(new URL("../src/cli.mjs", import.meta.url));
test("CLI meldet bei nicht verfügbarem zentralen Zustand einen Fehler", () => {
  const result = spawnSync(process.execPath, [cli, "SESSION-TEST", "PC", "Test-PC", "Übersicht prüfen"], {
    encoding: "utf8",
    env: { ...process.env, PSQL_PATH: 'nicht-vorhandenes-psql' },
  });
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /Datenbankzugriff|Zentralen Zustand|SQL-Export/);
});

test("CLI meldet fehlende, leere und zusätzliche Argumente", () => {
  for (const args of [[], ["  "], ["eins", "zwei"]]) {
    const result = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.ok(result.stderr.length > 0);
  }
});
