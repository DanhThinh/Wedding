import { describe, expect, it } from 'vitest';
import { getWeddingPhase, hasGiftDetails } from './weddingState';

describe('wedding state', () => {
  const weddingDate = new Date('2026-01-11T18:00:00+07:00');

  it('detects each lifecycle phase by calendar day', () => {
    expect(getWeddingPhase(weddingDate, new Date('2026-01-10T23:59:00+07:00'))).toBe('before');
    expect(getWeddingPhase(weddingDate, new Date('2026-01-11T09:00:00+07:00'))).toBe('wedding-day');
    expect(getWeddingPhase(weddingDate, new Date('2026-01-12T00:01:00+07:00'))).toBe('after');
  });

  it('only enables gifts when complete payment data exists', () => {
    expect(hasGiftDetails({
      groom: { bank: { bankName: '', number: '', qrCode: '' } },
      bride: { bank: { bankName: '', number: '', qrCode: '' } },
    })).toBe(false);
  });
});
