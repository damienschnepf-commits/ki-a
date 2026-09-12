import { createHash } from 'node:crypto';
import { createResponse } from './openai.mjs';

export const modelAdapters = Object.freeze(['openai', 'local-test']);

export function createLocalTestResponse({ context, userText }) {
  if (typeof userText !== 'string' || !userText.trim()) throw new TypeError('userText fehlt.');
  if (!context || typeof context !== 'object' || typeof context.stateVersion !== 'string') {
    throw new TypeError('Kontext fehlt.');
  }
  const fingerprint = createHash('sha256').update(JSON.stringify({
    stateVersion: context.stateVersion,
    history: context.history?.entries || [],
    userText: userText.trim(),
  })).digest('hex').slice(0, 24);
  return {
    text: `Lokale Testantwort: ${userText.trim()}`,
    responseId: `local-${fingerprint}`,
    model: 'local-deterministic-test',
  };
}

export function selectModelAdapter(name = 'openai') {
  if (name === 'openai') return createResponse;
  if (name === 'local-test') return createLocalTestResponse;
  throw new TypeError(`modelAdapter muss ${modelAdapters.join(' oder ')} sein.`);
}
