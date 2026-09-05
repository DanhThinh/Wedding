import { describe, expect, it } from 'vitest';
import { getWeddingPhase, hasGiftDetails } from './weddingState';

describe('wedding state', () => {
  const weddingDate = new Date('2026-01-11T18:00:00+07:00');

  it('detects each lifecycle phase by calendar day', () => {
    expect(getWeddingPhase(weddingDate, new Date('2026-01-10T23:59:00+07:00'))).toBe('before');
    expect(getWeddingPhase(weddingDate, new Date('2026-01-11T09:00:00+07:00'))).toBe('wedding-day');
    expect(getWeddingPhase(weddingDate, new Date('2026-01-12T00:01:00+07:00'))).toBe('after');
  });

  it('uses Vietnam day boundaries for overseas guests', () => {
    expect(getWeddingPhase(weddingDate, new Date('2026-01-10T16:59:59Z'))).toBe('before');
    expect(getWeddingPhase(weddingDate, new Date('2026-01-10T17:00:00Z'))).toBe('wedding-day');
    expect(getWeddingPhase(weddingDate, new Date('2026-01-11T17:00:00Z'))).toBe('after');
  });

  it('hides gifts until at least one account is usable', () => {
    expect(hasGiftDetails({
      groom: { bank: { bankName: '', number: '', qrCode: '' } },
      bride: { bank: { bankName: '', number: '', qrCode: '' } },
    })).toBe(false);

    // Thiếu số tài khoản thì khách không chuyển khoản được → vẫn ẩn.
    expect(hasGiftDetails({
      groom: { bank: { bankName: 'Vietcombank', number: '   ', qrCode: '' } },
      bride: { bank: { bankName: '', number: '', qrCode: '' } },
    })).toBe(false);
  });

  it('enables gifts from bank details alone, without a QR image', () => {
    expect(hasGiftDetails({
      groom: { bank: { bankName: '', number: '', qrCode: '' } },
      bride: { bank: { bankName: 'Techcombank', number: '19001234567', qrCode: '' } },
    })).toBe(true);
  });
});
