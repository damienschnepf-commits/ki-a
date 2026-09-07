import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createPlan } from "../src/jenny.mjs";

test("Auftrag bleibt Daten und wird Jenny zugeordnet", () => {
  const plan = createPlan("  README prüfen; echo example  ");
  assert.equal(plan.request, "README prüfen; echo example");
  assert.equal(plan.project, "KI-Janny");
  assert.equal(plan.owner, "KI-Engineering Jenny");
  assert.equal(plan.status, "planned");
  assert.deepEqual(plan.delegatedAgents, []);
});

test("Leere und ungültige Aufträge werden abgelehnt", () => {
  for (const input of ["", "  ", "\n", null, undefined, 42, {}]) {
    assert.throws(() => createPlan(input), TypeError);
  }
});

const cli = fileURLToPath(new URL("../src/cli.mjs", import.meta.url));
test("CLI liefert einen lesbaren JSON-Plan", () => {
  const result = spawnSync(process.execPath, [cli, "Übersicht prüfen"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  assert.equal(JSON.parse(result.stdout).request, "Übersicht prüfen");
});

test("CLI meldet fehlende, leere und zusätzliche Argumente", () => {
  for (const args of [[], ["  "], ["eins", "zwei"]]) {
    const result = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.ok(result.stderr.length > 0);
  }
});
