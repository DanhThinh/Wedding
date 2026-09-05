import { describe, expect, it } from 'vitest';
import { formatLunarLine, solarToLunar } from './lunar';

describe('solarToLunar', () => {
  it('đổi ngày cưới 11/01/2027 sang 04/12 âm lịch', () => {
    // Mùng 1 Tết Đinh Mùi rơi vào 06/02/2027, tháng Chạp năm đó đủ 30 ngày,
    // nên 11/01/2027 đúng là ngày 4 tháng Chạp.
    expect(solarToLunar(new Date(2027, 0, 11))).toEqual({
      day: 4, month: 12, year: 2026, leap: 0,
    });
  });

  it('nhận ra mùng 1 Tết', () => {
    const tet2027 = solarToLunar(new Date(2027, 1, 6));
    expect(tet2027.day).toBe(1);
    expect(tet2027.month).toBe(1);
    expect(tet2027.year).toBe(2027);
  });

  it('đánh dấu tháng nhuận', () => {
    // Năm 2025 nhuận tháng 6 âm lịch: 25/07/2025 = 01/06 nhuận.
    const leapDay = solarToLunar(new Date(2025, 6, 25));
    expect(leapDay.month).toBe(6);
    expect(leapDay.leap).toBe(1);
  });

  it('định dạng dòng chữ như trong thiệp', () => {
    expect(formatLunarLine(new Date(2027, 0, 11))).toBe('Tức ngày 04 tháng 12 âm lịch');
  });
});
