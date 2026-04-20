import { describe, it } from 'node:test';
import assert from 'node:assert';
import { combineLocal } from '../src/utils/datetime.js';

describe('consulta datetime', () => {
  it('combineLocal monta data correta', () => {
    const d = combineLocal('2026-05-01', '14:30');
    assert.strictEqual(d.getFullYear(), 2026);
    assert.strictEqual(d.getMonth(), 4);
    assert.strictEqual(d.getDate(), 1);
    assert.strictEqual(d.getHours(), 14);
    assert.strictEqual(d.getMinutes(), 30);
  });
});
