import { bootstrapSession } from './session-bootstrap.mjs';
import { buildConversationContext } from './conversation-context.mjs';
import { saveExchange } from './conversation-store.mjs';
import { selectModelAdapter } from './model-adapter.mjs';

export async function chat({ sessionCode, sessionType, deviceName, userText }, adapters = {}) {
  if (typeof userText !== 'string' || !userText.trim()) throw new TypeError('Nachricht fehlt.');
  const centralState = (adapters.bootstrap || bootstrapSession)({ sessionCode, sessionType, deviceName }, adapters.db || {});
  const context = buildConversationContext(centralState);
  const respond = adapters.respond || selectModelAdapter(adapters.modelAdapter || 'openai');
  const answer = await respond({ context, userText: userText.trim(), ...(adapters.openai || {}) });
  const saved = (adapters.save || saveExchange)({
    sessionCode,
    stateVersion: Number(context.stateVersion),
    userText: userText.trim(),
    assistantText: answer.text,
    model: answer.model,
    responseId: answer.responseId,
  }, adapters.db || {});
  return { text: answer.text, stateVersion: context.stateVersion, exchangeCode: saved.exchangeCode };
}
