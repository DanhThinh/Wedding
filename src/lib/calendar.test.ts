import { describe, expect, it } from 'vitest';
import {
  createGoogleCalendarUrl,
  createIcsContent,
  formatCalendarUtc,
  getCalendarRange,
} from './calendar';

const event = {
  name: 'Lễ Thành Hôn',
  date: '2025-01-11',
  time: '18:00',
  address: 'TP. Hồ Chí Minh',
  description: 'Tiệc cưới; thân mật',
};

describe('calendar helpers', () => {
  it('converts Vietnam time to a consistent UTC range', () => {
    const { start, end } = getCalendarRange(event);
    expect(formatCalendarUtc(start)).toBe('20250111T110000Z');
    expect(formatCalendarUtc(end)).toBe('20250111T140000Z');
  });

  it('builds a Google Calendar URL with matching UTC values', () => {
    const url = new URL(createGoogleCalendarUrl(event));
    expect(url.searchParams.get('dates')).toBe('20250111T110000Z/20250111T140000Z');
    expect(url.searchParams.get('ctz')).toBe('Asia/Ho_Chi_Minh');
  });

  it('creates a valid CRLF ICS payload and escapes text fields', () => {
    const ics = createIcsContent(event, new Date('2025-01-01T00:00:00Z'));
    expect(ics).toContain('DTSTART:20250111T110000Z\r\n');
    expect(ics).toContain('DTEND:20250111T140000Z\r\n');
    expect(ics).toContain('DESCRIPTION:Tiệc cưới\\; thân mật');
  });
});
