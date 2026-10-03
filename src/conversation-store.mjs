import { randomUUID } from 'node:crypto';
import { runJsonQuery, sqlLiteral } from './database.mjs';

export class ConversationConflictError extends Error {
  constructor() {
    super('Gespräch wurde wegen eines Versions- oder Sessionkonflikts nicht gespeichert.');
    this.name = 'ConversationConflictError';
  }
}

function text(name, value, max = 50_000) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${name} fehlt.`);
  if (value.length > max) throw new TypeError(`${name} ist zu lang.`);
  return value.trim();
}

export function migrationSql() {
  return `BEGIN;
CREATE TABLE IF NOT EXISTS __SCHEMA__.schema_migrations (
  migration_code text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS __SCHEMA__.conversation_messages (
  id bigserial PRIMARY KEY,
  message_code text NOT NULL UNIQUE,
  exchange_code text NOT NULL,
  session_id bigint NOT NULL REFERENCES __SCHEMA__.sessions(id),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  state_version bigint NOT NULL,
  source text NOT NULL,
  model text,
  response_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS conversation_messages_created_idx
  ON __SCHEMA__.conversation_messages (created_at DESC, id DESC);
INSERT INTO __SCHEMA__.schema_migrations (migration_code)
VALUES ('002_conversation_messages')
ON CONFLICT (migration_code) DO NOTHING;
SELECT json_build_object('migrated', true, 'table', 'conversation_messages');
COMMIT;`;
}

export function migrateConversationStore(adapters = {}) {
  return (adapters.query || runJsonQuery)(migrationSql(), adapters);
}

export function saveExchangeSql({ sessionCode, stateVersion, userText, assistantText, model, responseId, exchangeCode = randomUUID() }) {
  const user = text('userText', userText);
  const assistant = text('assistantText', assistantText);
  const session = text('sessionCode', sessionCode, 500);
  const usedModel = text('model', model, 500);
  const response = text('responseId', responseId, 1000);
  if (!Number.isSafeInteger(stateVersion) || stateVersion < 0) throw new TypeError('stateVersion ist ungültig.');
  return `BEGIN ISOLATION LEVEL SERIALIZABLE;
WITH actor AS (
  SELECT s.id
  FROM __SCHEMA__.sessions s
  JOIN __SCHEMA__.system_state state ON state.state_version = ${stateVersion}
  WHERE s.session_code = ${sqlLiteral(session)}
    AND s.status = 'ACTIVE'
    AND s.loaded_state_version = ${stateVersion}
  FOR UPDATE OF s
), inserted_user AS (
  INSERT INTO __SCHEMA__.conversation_messages
    (message_code, exchange_code, session_id, role, content, state_version, source, created_at)
  SELECT ${sqlLiteral(`MSG-${exchangeCode}-U`)}, ${sqlLiteral(exchangeCode)}, id, 'user', ${sqlLiteral(user)}, ${stateVersion}, 'JANNY_API', now()
  FROM actor RETURNING id
), inserted_assistant AS (
  INSERT INTO __SCHEMA__.conversation_messages
    (message_code, exchange_code, session_id, role, content, state_version, source, model, response_id, created_at)
  SELECT ${sqlLiteral(`MSG-${exchangeCode}-A`)}, ${sqlLiteral(exchangeCode)}, id, 'assistant', ${sqlLiteral(assistant)}, ${stateVersion}, 'JANNY_API', ${sqlLiteral(usedModel)}, ${sqlLiteral(response)}, now()
  FROM actor WHERE EXISTS (SELECT 1 FROM inserted_user) RETURNING id
)
SELECT json_build_object(
  'saved', EXISTS (SELECT 1 FROM inserted_assistant),
  'exchangeCode', ${sqlLiteral(exchangeCode)},
  'stateVersion', ${stateVersion}
);
COMMIT;`;
}

export function saveExchange(exchange, adapters = {}) {
  const result = (adapters.query || runJsonQuery)(saveExchangeSql(exchange), adapters);
  if (!result.saved) throw new ConversationConflictError();
  return result;
}
