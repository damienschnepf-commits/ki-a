import { runJsonQuery, sqlLiteral } from './database.mjs';

const sessionTypes = new Set(['PC', 'VOICE', 'IPHONE']);

function requireText(name, value) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${name} fehlt.`);
  return value.trim();
}

export function bootstrapSql({ sessionCode, sessionType, deviceName }) {
  const code = sqlLiteral(requireText('sessionCode', sessionCode));
  const typeValue = requireText('sessionType', sessionType).toUpperCase();
  if (!sessionTypes.has(typeValue)) throw new TypeError('sessionType muss PC, IPHONE oder VOICE sein.');
  const type = sqlLiteral(typeValue);
  const device = sqlLiteral(requireText('deviceName', deviceName));
  return `BEGIN ISOLATION LEVEL REPEATABLE READ;
WITH current AS (
  SELECT state_version FROM __SCHEMA__.system_state ORDER BY id LIMIT 1 FOR SHARE
), registered AS (
  INSERT INTO __SCHEMA__.sessions
    (session_code, session_type, device_name, loaded_state_version, status, started_at, last_seen_at)
  SELECT ${code}, ${type}, ${device}, state_version, 'ACTIVE', now(), now() FROM current
  ON CONFLICT (session_code) DO UPDATE SET
    session_type = EXCLUDED.session_type,
    device_name = EXCLUDED.device_name,
    loaded_state_version = EXCLUDED.loaded_state_version,
    status = 'ACTIVE',
    last_seen_at = now()
  RETURNING id, session_code, session_type, device_name, loaded_state_version, status, started_at, last_seen_at
)
SELECT json_build_object(
  'stateVersion', (SELECT state_version FROM current),
  'executionAuthorized', (SELECT execution_authorized FROM __SCHEMA__.system_state ORDER BY id LIMIT 1),
  'session', (SELECT row_to_json(registered) FROM registered),
  'currentState', (SELECT COALESCE(json_agg(t), '[]'::json) FROM __SCHEMA__.export_current_state t),
  'openTasks', (SELECT COALESCE(json_agg(t), '[]'::json) FROM __SCHEMA__.export_open_tasks t),
  'decisions', (SELECT COALESCE(json_agg(t), '[]'::json) FROM __SCHEMA__.export_decisions t),
  'sessions', (SELECT COALESCE(json_agg(t), '[]'::json) FROM __SCHEMA__.export_sessions t),
  'approvedCommands', (
    SELECT COALESCE(json_agg(x), '[]'::json) FROM (
      SELECT a.approval_code, c.command_code, c.title, c.command_text
      FROM __SCHEMA__.approvals a
      JOIN __SCHEMA__.commands c ON c.id = a.command_id
      WHERE a.status = 'APPROVED' AND a.approved_at IS NOT NULL AND a.consumed_at IS NULL
      ORDER BY a.id
    ) x
  ),
  'conversationHistory', (
    SELECT COALESCE(json_agg(h ORDER BY h.created_at, h.id), '[]'::json)
    FROM (
      SELECT m.id, m.message_code, m.exchange_code, m.role, m.content,
             m.state_version, m.source, m.model, m.response_id, m.created_at
      FROM __SCHEMA__.conversation_messages m
      ORDER BY m.created_at DESC, m.id DESC
      LIMIT 40
    ) h
  )
);
COMMIT;`;
}

export function bootstrapSession(options, adapters = {}) {
  return (adapters.query || runJsonQuery)(bootstrapSql(options), adapters);
}

export function updateStateSql({ sessionCode, expectedVersion, currentPhase, currentGoal, nextStep, changeReason }) {
  requireText('sessionCode', sessionCode);
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 0) throw new TypeError('expectedVersion ist ungültig.');
  for (const [name, value] of Object.entries({ currentPhase, currentGoal, nextStep, changeReason })) requireText(name, value);
  return `BEGIN ISOLATION LEVEL SERIALIZABLE;
WITH actor AS (
  SELECT id FROM __SCHEMA__.sessions
  WHERE session_code = ${sqlLiteral(sessionCode)} AND status = 'ACTIVE'
), changed AS (
  UPDATE __SCHEMA__.system_state
  SET state_version = state_version + 1,
      current_phase = ${sqlLiteral(currentPhase)},
      current_goal = ${sqlLiteral(currentGoal)},
      next_step = ${sqlLiteral(nextStep)},
      updated_at = now()
  WHERE state_version = ${expectedVersion} AND EXISTS (SELECT 1 FROM actor)
  RETURNING state_version, current_phase, current_goal, next_step, updated_at
), history AS (
  INSERT INTO __SCHEMA__.state_history
    (state_version, previous_version, changed_by_session, current_phase, current_goal, next_step, change_reason, created_at)
  SELECT c.state_version, ${expectedVersion}, a.id, c.current_phase, c.current_goal, c.next_step, ${sqlLiteral(changeReason)}, now()
  FROM changed c CROSS JOIN actor a
  RETURNING id
), touched AS (
  UPDATE __SCHEMA__.sessions SET loaded_state_version = (SELECT state_version FROM changed), last_seen_at = now()
  WHERE id = (SELECT id FROM actor) AND EXISTS (SELECT 1 FROM changed)
)
SELECT json_build_object(
  'updated', EXISTS (SELECT 1 FROM changed),
  'conflict', NOT EXISTS (SELECT 1 FROM changed),
  'expectedVersion', ${expectedVersion},
  'actualVersion', COALESCE((SELECT state_version FROM changed), (SELECT state_version FROM __SCHEMA__.system_state ORDER BY id LIMIT 1)),
  'state', (SELECT row_to_json(changed) FROM changed)
);
COMMIT;`;
}

export function updateCentralState(change, adapters = {}) {
  const result = (adapters.query || runJsonQuery)(updateStateSql(change), adapters);
  if (!result.updated) {
    throw new Error(`Versionskonflikt: erwartet ${result.expectedVersion}, aktuell ${result.actualVersion}. Keine Änderung gespeichert.`);
  }
  return result;
}

export function claimApprovedCommandSql({ sessionCode, commandCode }) {
  requireText('sessionCode', sessionCode);
  requireText('commandCode', commandCode);
  return `BEGIN ISOLATION LEVEL SERIALIZABLE;
WITH actor AS (
  SELECT id FROM __SCHEMA__.sessions WHERE session_code = ${sqlLiteral(sessionCode)} AND status = 'ACTIVE'
), eligible AS (
  SELECT a.id AS approval_id, a.approval_code, c.id AS command_id, c.command_code, c.title, c.command_text
  FROM __SCHEMA__.approvals a JOIN __SCHEMA__.commands c ON c.id = a.command_id
  WHERE c.command_code = ${sqlLiteral(commandCode)}
    AND a.status = 'APPROVED' AND a.approved_at IS NOT NULL AND a.consumed_at IS NULL
    AND EXISTS (SELECT 1 FROM actor)
    AND EXISTS (SELECT 1 FROM __SCHEMA__.system_state WHERE execution_authorized = true)
  FOR UPDATE OF a, c
), consumed AS (
  UPDATE __SCHEMA__.approvals a SET status = 'CONSUMED', consumed_at = now()
  FROM eligible e WHERE a.id = e.approval_id
  RETURNING e.*
), claimed AS (
  UPDATE __SCHEMA__.commands c SET status = 'CLAIMED', updated_at = now()
  FROM consumed x WHERE c.id = x.command_id
  RETURNING x.approval_code, c.command_code, c.title, c.command_text
)
SELECT json_build_object('authorized', EXISTS (SELECT 1 FROM claimed), 'command', (SELECT row_to_json(claimed) FROM claimed));
COMMIT;`;
}

export function claimApprovedCommand(request, adapters = {}) {
  const result = (adapters.query || runJsonQuery)(claimApprovedCommandSql(request), adapters);
  if (!result.authorized) throw new Error('Command nicht freigegeben, Freigabe bereits verbraucht oder Session nicht aktiv.');
  return result.command;
}
