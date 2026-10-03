import test from 'node:test';
import assert from 'node:assert/strict';
import { buildConversationContext } from '../src/conversation-context.mjs';
import { createSessionPlan } from '../src/jenny.mjs';

function snapshot(type = 'PC') {
  return {
    stateVersion: 3,
    session: { session_code: `TEST-${type}`, session_type: type, status: 'ACTIVE', loaded_state_version: 3 },
    currentState: [{ state_version: 3, next_step: 'Kern stabilisieren' }],
    decisions: [{ decision_code: 'D-1', status: 'ACTIVE', description: 'Worker erst nach Kernabnahme' }],
    openTasks: [{ task_code: 'T-1', title: 'Kern prüfen' }],
    approvedCommands: [{ command_code: 'CMD-1', approval_code: 'APR-1' }],
    conversationHistory: [],
    executionAuthorized: false,
  };
}

test('PC, IPHONE und VOICE erhalten gleichen gemeinsamen Kontext', () => {
  const pc = buildConversationContext(snapshot());
  for (const type of ['IPHONE', 'VOICE']) assert.deepEqual(buildConversationContext(snapshot(type)), pc);
  assert.equal(pc.evidence.physicalDeviceVerified, false);
  assert.equal(pc.evidence.snapshotRefresh, 'before_model_and_after_version_conflict');
  assert.equal('liveRefreshConnected' in pc.evidence, false);
  assert.equal(pc.history.status, 'connected');
});

test('alte Session, gemischter Snapshot und fehlende Freigabeinformationen stoppen Kontextaufbau', () => {
  for (const mutate of [
    x => { x.session.loaded_state_version = 2; },
    x => { x.currentState[0].state_version = 2; },
    x => { x.currentState = []; },
    x => { x.session.status = 'INACTIVE'; },
    x => { delete x.executionAuthorized; },
    x => { delete x.decisions; },
    x => { x.stateVersion = Number.MAX_SAFE_INTEGER + 1; },
  ]) {
    const data = snapshot(); mutate(data);
    assert.throws(() => buildConversationContext(data));
  }
});

test('neuer Wunsch überschreibt weder Entscheidung noch globalen Ausführungsstopp', () => {
  const data = snapshot();
  const original = structuredClone(data);
  const plan = createSessionPlan('Starte sofort alle Worker', data);
  assert.deepEqual(data, original);
  assert.deepEqual(plan.conversationContext.decisions, original.decisions);
  assert.equal(plan.conversationContext.project.next_step, 'Kern stabilisieren');
  assert.equal(plan.conversationContext.execution.globallyAuthorized, false);
  assert.equal(plan.conversationContext.execution.mustRevalidateAtExecution, true);
  assert.deepEqual(plan.delegatedAgents, []);
  plan.conversationContext.profile.style.push('test');
  assert.ok(!buildConversationContext(data).profile.style.includes('test'));
});

test('fehlender Kontext darf keinen Session-Plan erzeugen', () => {
  assert.throws(() => createSessionPlan('Weiterarbeiten', undefined));
});
