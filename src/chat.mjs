import { bootstrapSession } from './session-bootstrap.mjs';
import { buildConversationContext } from './conversation-context.mjs';
import { ConversationConflictError, saveExchange } from './conversation-store.mjs';
import { selectModelAdapter } from './model-adapter.mjs';

export async function chat({ sessionCode, sessionType, deviceName, userText }, adapters = {}) {
  if (typeof userText !== 'string' || !userText.trim()) throw new TypeError('Nachricht fehlt.');
  const session = { sessionCode, sessionType, deviceName };
  const loadSnapshot = () => (adapters.bootstrap || bootstrapSession)(session, adapters.db || {});
  const respond = adapters.respond || selectModelAdapter(adapters.modelAdapter || 'openai');
  let centralState = loadSnapshot();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const candidate = buildConversationContext(centralState);
    const refreshedState = loadSnapshot();
    const context = buildConversationContext(refreshedState);
    if (candidate.stateVersion !== context.stateVersion) {
      centralState = refreshedState;
      continue;
    }
    const answer = await respond({ context, userText: userText.trim(), ...(adapters.openai || {}) });
    try {
      const saved = (adapters.save || saveExchange)({
        sessionCode,
        stateVersion: Number(context.stateVersion),
        userText: userText.trim(),
        assistantText: answer.text,
        model: answer.model,
        responseId: answer.responseId,
      }, adapters.db || {});
      return { text: answer.text, stateVersion: context.stateVersion, exchangeCode: saved.exchangeCode };
    } catch (error) {
      if (!(error instanceof ConversationConflictError) || attempt === 2) throw error;
      centralState = loadSnapshot();
    }
  }
  throw new Error('Gespräch konnte nach mehreren Zustandsänderungen nicht gespeichert werden.');
}
