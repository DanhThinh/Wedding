import { describe, expect, it } from 'vitest';
import { parseRsvpReport, rsvpReportCsv, summarizeRsvps } from './rsvpReport';

const input = [
  { id: '1', source: 'rsvps', name: 'An', phone: '0901234567', attending: true, eventIds: [1, 3], plusOnes: 2, message: 'Chúc mừng', editToken: 'never-export' },
  { id: '2', source: 'attendances', name: 'Bình', attending: true, eventIds: [], plusOnes: 0 },
  { id: '3', source: 'rsvps', name: 'Chi', attending: false, eventIds: [], plusOnes: 0 },
];
describe('private RSVP reports', () => {
  it('counts people per party and flags legacy confirmations without a party', () => {
    expect(summarizeRsvps(parseRsvpReport(input), [1, 2, 3])).toEqual({
      confirmations: 3, attending: 2, declined: 1, people: 4, unassigned: 1,
      byEvent: [{ id: 1, people: 3 }, { id: 2, people: 0 }, { id: 3, people: 3 }],
    });
  });
  it('never exports edit capabilities and escapes spreadsheet formulas, commas and quotes', () => {
    const rows = parseRsvpReport([{ ...input[0], name: '=1+1', message: 'Hi, "An"\nChúc mừng!' }]);
    expect(JSON.stringify(rows)).not.toContain('never-export');
    const csv = rsvpReportCsv(rows);
    expect(csv).toContain('"\'=1+1"');
    expect(csv).toContain('"\'0901234567"');
    expect(csv).toContain('"Hi, ""An""\nChúc mừng!"');
    expect(csv).not.toContain('editToken');
  });
  it('rejects malformed imports instead of silently producing incorrect totals', () => {
    expect(() => parseRsvpReport({})).toThrow();
    expect(() => parseRsvpReport([{ ...input[0], plusOnes: -1 }])).toThrow();
    expect(() => parseRsvpReport([{ ...input[0], eventIds: [1, 1] }])).toThrow();
  });
});
