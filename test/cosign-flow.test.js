import assert from 'node:assert/strict';
import test from 'node:test';
import { SimulatedMuSig2Card } from '../src/musig2/card-sim.js';
import { runCardCosignFlow } from '../src/musig2/cosign-flow.js';

test('local card cosign flow returns a valid aggregate MuSig2 signature', () => {
  const result = runCardCosignFlow({
    card: new SimulatedMuSig2Card(new Uint8Array(32).fill(0x51)),
    clientSecret: new Uint8Array(32).fill(0x21),
    message: 'nuri deterministic cosign flow test',
    sessionId: new Uint8Array(16).fill(0x33),
  });

  assert.equal(result.status, 'NURI_CARD_COSIGN_FLOW_OK');
  assert.equal(result.card_partial_verified, true);
  assert.equal(result.final_signature_verified, true);
  assert.equal(result.final_signature64.length, 128);
  assert.equal(result.aggregate_xonly32.length, 64);
  assert.equal(result.card_partial32.length, 64);
  assert.equal(result.client_partial32.length, 64);
  assert.equal(Object.hasOwn(result, 'client_secret'), false);
});
