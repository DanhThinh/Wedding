import { describe, expect, it } from 'vitest';
import { getDateParts } from './date';

describe('Vietnam calendar fields', () => {
  it('keeps the ceremony at 11 AM on Monday, January 11', () => {
    expect(getDateParts(new Date('2027-01-11T11:00:00+07:00'))).toEqual({
      year: 2027, month: 1, day: 11, weekday: 1, hour: 11, minute: 0,
    });
  });

  it('handles the year boundary at Vietnam midnight', () => {
    expect(getDateParts(new Date('2026-12-31T17:30:00Z'))).toEqual({
      year: 2027, month: 1, day: 1, weekday: 5, hour: 0, minute: 30,
    });
  });
});
