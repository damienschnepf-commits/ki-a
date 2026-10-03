import test from 'node:test';
import assert from 'node:assert/strict';
import { createLocalTestResponse, selectModelAdapter } from '../src/model-adapter.mjs';

const context = { stateVersion: '4', history: { entries: [{ role: 'user', content: 'A', id: 1 }] } };

test('lokaler Adapter ist deterministisch und benötigt weder Key noch Netzwerk', () => {
  const first = createLocalTestResponse({ context, userText: 'Hallo' });
  const second = createLocalTestResponse({ context, userText: 'Hallo' });
  assert.deepEqual(first, second);
  assert.equal(first.model, 'local-deterministic-test');
  assert.match(first.responseId, /^local-[a-f0-9]{24}$/);
});

test('Adapterwahl bewahrt OpenAI und lehnt unbekannte Adapter ab', () => {
  assert.equal(selectModelAdapter('local-test'), createLocalTestResponse);
  assert.equal(typeof selectModelAdapter('openai'), 'function');
  assert.throws(() => selectModelAdapter('network-test'), /modelAdapter/);
});
