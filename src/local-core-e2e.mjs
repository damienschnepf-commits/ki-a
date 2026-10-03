import { randomUUID } from 'node:crypto';
import { chat } from './chat.mjs';
import { bootstrapSession, updateCentralState } from './session-bootstrap.mjs';
import { buildConversationContext } from './conversation-context.mjs';
import { saveExchange } from './conversation-store.mjs';

function requireState(row, name) {
  if (typeof row?.[name] !== 'string' || !row[name].trim()) throw new Error(`Central State enthält ${name} nicht.`);
  return row[name];
}

function hasText(context, text) {
  return context.history.entries.some(entry => entry.content === text);
}

export async function runLocalCoreE2e({ suffix = randomUUID().slice(0, 8) } = {}) {
  const pc = `CMD007-PC-${suffix}`;
  const voice = `CMD007-VOICE-${suffix}`;
  const iphone = `CMD007-IPHONE-${suffix}`;
  const messageA = 'CMD-007 Gespräch A: Kontext über PC speichern.';
  const messageB = 'CMD-007 Gespräch B: Kontext über VOICE speichern.';

  const pcA = await chat({ sessionCode: pc, sessionType: 'PC', deviceName: 'CMD-007-PC', userText: messageA }, { modelAdapter: 'local-test' });

  const voiceContext = buildConversationContext(bootstrapSession({ sessionCode: voice, sessionType: 'VOICE', deviceName: 'CMD-007-VOICE' }));
  if (!hasText(voiceContext, messageA) || !hasText(voiceContext, pcA.text)) throw new Error('VOICE erhielt Gespräch A nicht aus PostgreSQL.');
  const voiceB = await chat({ sessionCode: voice, sessionType: 'VOICE', deviceName: 'CMD-007-VOICE', userText: messageB }, { modelAdapter: 'local-test' });

  const iphoneContext = buildConversationContext(bootstrapSession({ sessionCode: iphone, sessionType: 'IPHONE', deviceName: 'CMD-007-IPHONE' }));
  if (![messageA, pcA.text, messageB, voiceB.text].every(text => hasText(iphoneContext, text))) {
    throw new Error('IPHONE erhielt nicht die vollständige Gesprächsgeschichte A und B.');
  }
  if (!iphoneContext.decisions.length || iphoneContext.profile.id !== 'janny') throw new Error('Profil oder Entscheidungen fehlen im IPHONE-Kontext.');

  const expectedVersion = Number(iphoneContext.stateVersion);
  const state = iphoneContext.project;
  const advanced = updateCentralState({
    sessionCode: pc,
    expectedVersion,
    currentPhase: requireState(state, 'current_phase'),
    currentGoal: requireState(state, 'current_goal'),
    nextStep: requireState(state, 'next_step'),
    changeReason: 'CMD-007: stale Gesprächsschreibtest',
  });
  let staleBlocked = false;
  try {
    saveExchange({
      sessionCode: voice,
      stateVersion: expectedVersion,
      userText: 'CMD-007 STALE WRITE – darf nicht gespeichert werden.',
      assistantText: 'Nicht speichern.',
      model: 'local-deterministic-test',
      responseId: `local-stale-${suffix}`,
      exchangeCode: `CMD007-STALE-${suffix}`,
    });
  } catch (error) {
    staleBlocked = /Versions-|Sessionkonflikt/.test(error.message);
  }
  if (!staleBlocked) throw new Error('Veralteter Gesprächsschreibversuch wurde nicht blockiert.');

  const finalContext = buildConversationContext(bootstrapSession({ sessionCode: iphone, sessionType: 'IPHONE', deviceName: 'CMD-007-IPHONE' }));
  if (Number(finalContext.stateVersion) !== Number(advanced.state.state_version) ||
      finalContext.history.entries.some(entry => entry.exchange_code === `CMD007-STALE-${suffix}`)) {
    throw new Error('Stale Schreibversuch hat den gültigen Zustand verändert.');
  }
  return {
    adapter: 'local-test', externalApiCalled: false, stateVersionBefore: expectedVersion,
    stateVersionAfter: Number(finalContext.stateVersion), pcToVoice: true, voiceToIphone: true,
    profilePreserved: finalContext.profile.id === 'janny', decisionsPreserved: finalContext.decisions.length > 0,
    staleWriteBlocked: true, sessionCodes: { pc, voice, iphone },
  };
}

if (process.argv[1]?.endsWith('/local-core-e2e.mjs') || process.argv[1]?.endsWith('\\local-core-e2e.mjs')) {
  try { process.stdout.write(JSON.stringify(await runLocalCoreE2e(), null, 2) + '\n'); }
  catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
