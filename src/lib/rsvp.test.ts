import { describe, expect, it } from 'vitest';
import { normalizePhone, saveRsvp, validateRsvp } from './rsvp';

describe('RSVP helpers', () => {
  it('normalizes and validates a complete submission', () => {
    const phone = normalizePhone('090 123-4567');
    expect(phone).toBe('0901234567');
    expect(validateRsvp({ name: 'Nguyễn Văn An', phone, eventIds: [1], plusOnes: 0 })).toEqual({});
  });

  it('reports required fields and invalid phone numbers', () => {
    expect(validateRsvp({ name: ' ', phone: '123', eventIds: [], plusOnes: 0 })).toEqual({
      name: 'Vui lòng nhập tên',
      phone: 'Số điện thoại cần có 10-11 chữ số',
      events: 'Vui lòng chọn ít nhất một sự kiện',
    });
  });

  it('uses explicit local fallback when Firebase is not configured', async () => {
    const mode = await saveRsvp({
      name: 'Nguyễn Văn An',
      phone: '0901234567',
      eventIds: [1, 3],
      plusOnes: 1,
    });
    const saved = JSON.parse(localStorage.getItem('wedding-rsvps') || '[]');

    expect(mode).toBe('local');
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ eventIds: [1, 3], plusOnes: 1 });
  });
});
