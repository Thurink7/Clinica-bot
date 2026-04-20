import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateSlotsForDay, defaultClinicConfig } from '../src/utils/slots.js';

describe('slots', () => {
  it('gera slots em dia útil', () => {
    const cfg = defaultClinicConfig();
    const slots = generateSlotsForDay('2026-04-20', cfg);
    assert.ok(slots.includes('08:00'));
    assert.ok(slots.includes('17:30'));
  });

  it('domingo sem slots', () => {
    const cfg = defaultClinicConfig();
    const slots = generateSlotsForDay('2026-04-19', cfg);
    assert.strictEqual(slots.length, 0);
  });
});
