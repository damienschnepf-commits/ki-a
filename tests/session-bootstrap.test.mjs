import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapSession, bootstrapSql, claimApprovedCommand, claimApprovedCommandSql, updateCentralState, updateStateSql } from '../src/session-bootstrap.mjs';

test('Bootstrap registriert PC und lädt Zustand plus nur offene Freigaben', () => {
  let sql;
  const result = bootstrapSession({ sessionCode: 'SESSION-PC-002', sessionType: 'PC', deviceName: 'Damien-PC' }, {
    query(value) { sql = value; return { stateVersion: 2, session: { session_code: 'SESSION-PC-002' }, approvedCommands: [{ approval_code: 'APR-001' }] }; },
  });
  assert.equal(result.stateVersion, 2);
  assert.match(sql, /ON CONFLICT \(session_code\) DO UPDATE/);
  assert.match(sql, /a\.status = 'APPROVED'/);
  assert.match(sql, /a\.consumed_at IS NULL/);
});

test('Bootstrap akzeptiert iPhone und Voice, aber keine unbekannten Typen', () => {
  assert.match(bootstrapSql({ sessionCode: 'IPHONE', sessionType: 'iphone', deviceName: 'Damien-iPhone' }), /'IPHONE'/);
  assert.match(bootstrapSql({ sessionCode: 'VOICE', sessionType: 'VOICE', deviceName: 'Damien-iPhone' }), /'VOICE'/);
  assert.throws(() => bootstrapSql({ sessionCode: 'X', sessionType: 'TABLET', deviceName: 'X' }), /sessionType/);
});

test('State-Update verwendet erwartete Version atomar', () => {
  const sql = updateStateSql({ sessionCode: 'PC', expectedVersion: 2, currentPhase: 'P', currentGoal: 'G', nextStep: 'N', changeReason: 'R' });
  assert.match(sql, /WHERE state_version = 2/);
  assert.match(sql, /BEGIN ISOLATION LEVEL SERIALIZABLE/);
  assert.match(sql, /state_version = state_version \+ 1/);
});

test('Veralteter Schreibversuch wird als Konflikt abgelehnt', () => {
  assert.throws(() => updateCentralState({ sessionCode: 'PC', expectedVersion: 1, currentPhase: 'P', currentGoal: 'G', nextStep: 'N', changeReason: 'R' }, {
    query() { return { updated: false, expectedVersion: 1, actualVersion: 2 }; },
  }), /Versionskonflikt.*Keine Änderung/);
});

test('Nur freigegebener und unverbrauchter Command wird atomar beansprucht', () => {
  const sql = claimApprovedCommandSql({ sessionCode: 'PC', commandCode: 'CMD-001' });
  assert.match(sql, /a\.status = 'APPROVED'/);
  assert.match(sql, /a\.consumed_at IS NULL/);
  assert.match(sql, /SET status = 'CONSUMED'/);
  assert.match(sql, /SET status = 'CLAIMED'/);
  assert.match(sql, /execution_authorized = true/);
  assert.deepEqual(claimApprovedCommand({ sessionCode: 'PC', commandCode: 'CMD-001' }, { query: () => ({ authorized: true, command: { command_code: 'CMD-001' } }) }), { command_code: 'CMD-001' });
  assert.throws(() => claimApprovedCommand({ sessionCode: 'PC', commandCode: 'CMD-002' }, { query: () => ({ authorized: false }) }), /nicht freigegeben/);
});
