import test from 'node:test';
import assert from 'node:assert/strict';
import { chat } from '../src/chat.mjs';
import { createResponse } from '../src/openai.mjs';
import { saveExchangeSql } from '../src/conversation-store.mjs';

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
