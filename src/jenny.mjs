import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sync } from './sync-state.mjs';
import { buildConversationContext } from './conversation-context.mjs';
export { bootstrapSession, updateCentralState, claimApprovedCommand } from './session-bootstrap.mjs';

const stateFiles = ['CURRENT_STATE.md', 'OPEN_TASKS.md', 'DECISIONS.md', 'SESSION_INDEX.json'];

export async function loadCentralState({ refresh = sync, stateDir = process.cwd() } = {}) {
  try {
    await refresh({ outputDir: stateDir });
    const [currentState, openTasks, decisions, sessions] = await Promise.all(
      stateFiles.map(name => readFile(resolve(stateDir, name), 'utf8'))
    );
    return Object.freeze({
      currentState,
      openTasks,
      decisions,
      sessions: JSON.parse(sessions),
    });
  } catch (error) {
    throw new Error('Zentralen Zustand nicht lesbar; SQL-Export und Zustandsdateien prüfen.', { cause: error });
  }
}

export function createPlan(request, centralState) {
  if (typeof request !== "string" || request.trim().length === 0) {
    throw new TypeError("Bitte einen nicht leeren Engineering-Auftrag angeben.");
  }
  return {
    project: "KI-Janny",
    owner: "KI-Engineering Jenny",
    request: request.trim(),
    status: "planned",
    centralState,
    steps: [
      "Ziel und Abnahmekriterien klären",
      "Änderung im Projekt umsetzen",
      "Ergebnis prüfen und Projektstatus aktualisieren"
    ],
    delegatedAgents: []
  };
}

export async function createPlanFromCentralState(request, options) {
  return createPlan(request, await loadCentralState(options));
}

export function createSessionPlan(request, centralState) {
  const conversationContext = buildConversationContext(centralState);
  return { ...createPlan(request, centralState), conversationContext };
}
