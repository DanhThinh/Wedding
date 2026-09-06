import { describe, expect, it, vi } from 'vitest';
import { normalizePhone, saveAttendance, saveRsvp, validateRsvp } from './rsvp';

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

describe('attendance persistence', () => {
  const submission = { name: '  Nguyễn Văn An  ', attending: true, message: '  Hẹn gặp nhé!  ' };

  it('appends and normalizes a successfully saved confirmation', async () => {
    localStorage.setItem('wedding-attendances', JSON.stringify([{ name: 'Earlier guest' }]));
    await expect(saveAttendance(submission)).resolves.toBe('local');
    const saved = JSON.parse(localStorage.getItem('wedding-attendances')!);
    expect(saved).toHaveLength(2);
    expect(saved[0].name).toBe('Earlier guest');
    expect(saved[1]).toMatchObject({ name: 'Nguyễn Văn An', attending: true, message: 'Hẹn gặp nhé!' });
  });

  it.each(['{broken', '{}'])('reports failure without overwriting invalid stored data: %s', async raw => {
    localStorage.setItem('wedding-attendances', raw);
    await expect(saveAttendance(submission)).rejects.toThrow();
    expect(localStorage.getItem('wedding-attendances')).toBe(raw);
  });

  it('rejects when the browser cannot persist the confirmation', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage full', 'QuotaExceededError');
    });
    await expect(saveAttendance(submission)).rejects.toThrow('Storage full');
    expect(localStorage.getItem('wedding-attendances')).toBeNull();
  });
});
