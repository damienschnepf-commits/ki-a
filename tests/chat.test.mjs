import test from 'node:test';
import assert from 'node:assert/strict';
import { chat } from '../src/chat.mjs';
import { createResponse } from '../src/openai.mjs';
import { ConversationConflictError, migrationSql, saveExchangeSql } from '../src/conversation-store.mjs';

function state() {
  return {
    stateVersion: 4,
    executionAuthorized: false,
    session: { session_code: 'S', status: 'ACTIVE', loaded_state_version: 4 },
    currentState: [{ state_version: 4, current_goal: 'Kern stabilisieren' }],
    decisions: [{ decision_code: 'D-1', description: 'Kern zuerst' }],
    openTasks: [], approvedCommands: [], conversationHistory: [
      { id: 1, message_code: 'M1', exchange_code: 'E1', role: 'user', content: 'Mein Testwort ist Eule.', source: 'JANNY_API' },
      { id: 2, message_code: 'M2', exchange_code: 'E1', role: 'assistant', content: 'Gemerkt.', source: 'JANNY_API' },
    ],
  };
}

test('Gespräch lädt Geschichte, ruft Modell und speichert Antwort mit Version', async () => {
  let received; let stored;
  const result = await chat({ sessionCode: 'S', sessionType: 'PC', deviceName: 'PC', userText: 'Was ist mein Testwort?' }, {
    bootstrap: () => state(),
    respond: async input => { received = input; return { text: 'Eule.', responseId: 'resp_test', model: 'test-model' }; },
    save: input => { stored = input; return { exchangeCode: 'E2' }; },
  });
  assert.equal(received.context.history.entries[0].content, 'Mein Testwort ist Eule.');
  assert.equal(stored.stateVersion, 4);
  assert.equal(stored.assistantText, 'Eule.');
  assert.deepEqual(result, { text: 'Eule.', stateVersion: '4', exchangeCode: 'E2' });
});

test('lokaler Testadapter ersetzt nur den externen Modellaufruf', async () => {
  let stored;
  const result = await chat({ sessionCode: 'S', sessionType: 'PC', deviceName: 'PC', userText: 'Ohne Netzwerk' }, {
    bootstrap: () => state(),
    modelAdapter: 'local-test',
    save: input => { stored = input; return { exchangeCode: 'E-local' }; },
  });
  assert.equal(result.text, 'Lokale Testantwort: Ohne Netzwerk');
  assert.equal(stored.model, 'local-deterministic-test');
  assert.equal(stored.stateVersion, 4);
});

test('Versionskonflikt lädt frischen Snapshot und verwirft die veraltete Modellantwort', async () => {
  const stale = state();
  const fresh = state();
  fresh.stateVersion = 5;
  fresh.session.loaded_state_version = 5;
  fresh.currentState[0].state_version = 5;
  fresh.currentState[0].current_goal = 'Aktualisiertes Ziel';
  const snapshots = [stale, stale, fresh, fresh];
  const seenGoals = [];
  let saved;

  const result = await chat({ sessionCode: 'S', sessionType: 'PC', deviceName: 'PC', userText: 'Weiter' }, {
    bootstrap: () => snapshots.shift() || fresh,
    respond: async ({ context }) => {
      seenGoals.push(context.project.current_goal);
      return { text: context.project.current_goal, responseId: `response-${seenGoals.length}`, model: 'test-model' };
    },
    save: input => {
      if (input.stateVersion === 4) throw new ConversationConflictError();
      saved = input;
      return { exchangeCode: 'E-fresh' };
    },
  });

  assert.deepEqual(seenGoals, ['Kern stabilisieren', 'Aktualisiertes Ziel']);
  assert.equal(saved.stateVersion, 5);
  assert.equal(saved.assistantText, 'Aktualisiertes Ziel');
  assert.deepEqual(result, { text: 'Aktualisiertes Ziel', stateVersion: '5', exchangeCode: 'E-fresh' });
});

test('geänderter Zustand wird vor dem Modellaufruf neu geladen', async () => {
  const stale = state();
  const fresh = state();
  fresh.stateVersion = 5;
  fresh.session.loaded_state_version = 5;
  fresh.currentState[0].state_version = 5;
  fresh.currentState[0].current_goal = 'Aktualisiertes Ziel';
  let bootstrapCount = 0;
  let responseCount = 0;
  let saved;

  const result = await chat({ sessionCode: 'S', sessionType: 'PC', deviceName: 'PC', userText: 'Weiter' }, {
    bootstrap: () => bootstrapCount++ === 0 ? stale : fresh,
    respond: async ({ context }) => {
      responseCount += 1;
      return { text: context.project.current_goal, responseId: 'response-current', model: 'test-model' };
    },
    save: input => { saved = input; return { exchangeCode: 'E-current' }; },
  });

  assert.equal(responseCount, 1);
  assert.equal(saved.stateVersion, 5);
  assert.equal(saved.assistantText, 'Aktualisiertes Ziel');
  assert.deepEqual(result, { text: 'Aktualisiertes Ziel', stateVersion: '5', exchangeCode: 'E-current' });
});

test('wiederholte Versionskonflikte beenden die Antwort nach drei Versuchen', async () => {
  let responseCount = 0;
  let saveCount = 0;
  await assert.rejects(chat({ sessionCode: 'S', sessionType: 'PC', deviceName: 'PC', userText: 'Weiter' }, {
    bootstrap: () => state(),
    respond: async () => {
      responseCount += 1;
      return { text: 'Antwort', responseId: 'r', model: 'test-model' };
    },
    save: () => {
      saveCount += 1;
      throw new ConversationConflictError();
    },
  }), ConversationConflictError);
  assert.equal(responseCount, 3);
  assert.equal(saveCount, 3);
});

test('API-Anfrage speichert extern keinen Verlauf und sendet belegte Geschichte', async () => {
  let body;
  const result = await createResponse({ context: (await import('../src/conversation-context.mjs')).buildConversationContext(state()), userText: 'Weiter', env: { OPENAI_API_KEY: 'test-key-value-long-enough', OPENAI_MODEL: 'test-model' }, request: async (_url, init) => {
    body = JSON.parse(init.body);
    return { ok: true, json: async () => ({ id: 'resp_1', output_text: 'Antwort' }) };
  }});
  assert.equal(body.store, false);
  assert.equal(body.input.at(-2).content, 'Gemerkt.');
  assert.equal(body.input.at(-1).content, 'Weiter');
  assert.equal(result.text, 'Antwort');
});

test('Speichern ist an aktive Session und unveränderte Version gebunden', () => {
  const sql = saveExchangeSql({ sessionCode: 'S', stateVersion: 4, userText: 'Hallo', assistantText: 'Hi', model: 'm', responseId: 'r', exchangeCode: 'E' });
  assert.match(sql, /state\.state_version = 4/);
  assert.match(sql, /s\.loaded_state_version = 4/);
  assert.match(sql, /BEGIN ISOLATION LEVEL SERIALIZABLE/);
  assert.match(sql, /'JANNY_API'/);
});

test('Gesprächsspeicher-Migration ist versioniert und idempotent aufgebaut', () => {
  const sql = migrationSql();
  assert.match(sql, /CREATE TABLE IF NOT EXISTS __SCHEMA__\.conversation_messages/);
  assert.match(sql, /002_conversation_messages/);
  assert.match(sql, /ON CONFLICT \(migration_code\) DO NOTHING/);
});
