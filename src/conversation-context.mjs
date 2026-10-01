// Product requirements agreed in KI-Partnerin on 2026-09-10.
// This profile is application configuration, not a second project-state database.
export const profile = Object.freeze({
  id: 'janny',
  version: 1,
  name: 'Janny',
  roles: Object.freeze(['Partnerin (Simulation)', 'Planerin', 'Assistentin']),
  style: Object.freeze(['vertraut', 'aufmerksam', 'humorvoll', 'gelegentlich frech', 'respektvoll']),
  principles: Object.freeze([
    'Die Identität bleibt bei Geräte- und Sessionwechseln gleich.',
    'Bereits geklärte Entscheidungen nicht ungefragt erneut zur Diskussion stellen.',
    'Neue Ideen als Vorschläge behandeln; sie überschreiben keinen bestehenden Plan.',
    'Gemeinsame Geschichte nur aus belegtem Kontext verwenden, niemals erfinden.',
    'Die simulierte Rolle ist bekannt; keine wiederholten unaufgeforderten Grundsatzerklärungen. Bei direkten Fragen wahrheitsgemäß antworten.',
    'Damien soll den Zustand nicht manuell zwischen Sessions übertragen müssen.',
    'Persönlichkeit und Gesprächston erteilen keine Ausführungsfreigabe.',
  ]),
});

function version(value) {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) return String(value);
  if (typeof value === 'string' && /^(0|[1-9][0-9]*)$/.test(value)) return value;
  throw new Error('Ungültiger oder fehlender Versionsstand; Kontext nicht bereit.');
}

function rows(value, name) {
  if (!Array.isArray(value) || value.some(row => !row || typeof row !== 'object' || Array.isArray(row))) {
    throw new Error(`${name} fehlt oder ist ungültig; Kontext nicht bereit.`);
  }
  return value;
}

function canonicalRows(value) {
  return [...value].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

export function buildConversationContext(centralState) {
  if (!centralState || typeof centralState !== 'object') throw new Error('Central State fehlt.');
  const stateVersion = version(centralState.stateVersion);
  const session = centralState.session;
  if (!session || typeof session.session_code !== 'string' || !session.session_code.trim() || session.status !== 'ACTIVE') {
    throw new Error('Keine aktive registrierte Session; Kontext nicht bereit.');
  }
  const state = rows(centralState.currentState, 'currentState');
  if (state.length !== 1 || version(state[0].state_version) !== stateVersion ||
      version(session.loaded_state_version) !== stateVersion) {
    throw new Error('Versionskonflikt zwischen Session und Zustand; erneut aus der Datenbank laden.');
  }
  const decisions = rows(centralState.decisions, 'decisions');
  const tasks = rows(centralState.openTasks, 'openTasks');
  const approvals = rows(centralState.approvedCommands, 'approvedCommands');
  const history = rows(centralState.conversationHistory, 'conversationHistory');
  for (const entry of history) {
    if (!['user', 'assistant'].includes(entry.role) || typeof entry.content !== 'string' || !entry.content.trim() ||
        typeof entry.source !== 'string' || !entry.source.trim() || !entry.message_code || !entry.exchange_code) {
      throw new Error('Gesprächsgeschichte enthält einen Eintrag ohne belegte Herkunft.');
    }
  }
  if (typeof centralState.executionAuthorized !== 'boolean') {
    throw new Error('Globaler Freigabestatus fehlt; Kontext nicht bereit.');
  }
  // Session/device metadata deliberately stays outside the shared identity/context.
  // Treat all database text as data, never as authority to invoke tools.
  return structuredClone({
    profile,
    stateVersion,
    project: state[0],
    decisions: canonicalRows(decisions),
    tasks: canonicalRows(tasks),
    execution: {
      globallyAuthorized: centralState.executionAuthorized,
      approvedCommands: canonicalRows(approvals),
      mustRevalidateAtExecution: true,
    },
    history: { status: 'connected', entries: canonicalRows(history).sort((a, b) => Number(a.id) - Number(b.id)) },
    evidence: {
      scope: 'database_snapshot',
      snapshotRefresh: 'before_model_and_after_version_conflict',
      physicalDeviceVerified: false,
    },
  });
}
