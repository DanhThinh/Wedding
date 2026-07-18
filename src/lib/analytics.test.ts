import { describe, expect, it } from 'vitest';
import { sanitizeAnalyticsParams } from './analytics';

describe('analytics helpers', () => {
  it('drops common PII params before logging events', () => {
    expect(sanitizeAnalyticsParams({
      event_id: 1,
      mode: 'firestore',
      name: 'Nguyễn Văn An',
      phone: '0901234567',
      message: 'Chúc mừng hạnh phúc',
      venueAddress: '123 Example Street',
      plus_ones_count: 2,
      empty: undefined,
    })).toEqual({
      event_id: 1,
      mode: 'firestore',
      plus_ones_count: 2,
    });
  });
});
