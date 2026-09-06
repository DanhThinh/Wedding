/**
 * Đổi ngày dương → ngày âm lịch Việt Nam (múi giờ +7).
 * Thuật toán chuẩn của Hồ Ngọc Đức (https://www.informatik.uni-leipzig.de/~duc/amlich/).
 * Dùng cho dòng "(Tức ngày ... tháng ... âm lịch)" ở phần Wedding Ceremony.
 */

import { getDateParts, VIETNAM_UTC_OFFSET_HOURS } from './date';

const PI = Math.PI;

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  /** 1 nếu là tháng nhuận */
  leap: number;
}

function jdFromDate(dd: number, mm: number, yy: number) {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  const gregorian =
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  if (gregorian < 2299161) {
    // Trước 15/10/1582 phải dùng lịch Julius.
    return dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return gregorian;
}

/** Ngày Julius của kỳ sóc (trăng non) thứ k tính từ 1/1/1900. */
function getNewMoonDay(k: number, timeZone: number) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;

  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  let c1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  c1 = c1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  c1 = c1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  c1 = c1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  c1 = c1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  c1 = c1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  c1 = c1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));

  const deltat =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;

  return Math.floor(jd1 + c1 - deltat + 0.5 + timeZone / 24);
}

/** Kinh độ mặt trời quy về khoảng [0, 11] (mỗi đơn vị 30°). */
function getSunLongitude(jdn: number, timeZone: number) {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = PI / 180;

  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;

  let dl = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  dl += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);

  let l = (L0 + dl) * dr;
  l -= PI * 2 * Math.floor(l / (PI * 2));
  return Math.floor((l / PI) * 6);
}

/** Ngày Julius bắt đầu tháng 11 âm lịch của năm dương yy. */
function getLunarMonth11(yy: number, timeZone: number) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  const nm = getNewMoonDay(k, timeZone);
  if (getSunLongitude(nm, timeZone) >= 9) {
    return getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/** Vị trí tháng nhuận so với tháng 11 âm lịch. */
function getLeapMonthOffset(a11: number, timeZone: number) {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let i = 1;
  let last = 0;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i += 1;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

export function solarToLunar(date: Date, timeZone = VIETNAM_UTC_OFFSET_HOURS): LunarDate {
  const { day, month, year } = getDateParts(date, timeZone);
  const dayNumber = jdFromDate(day, month, year);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);

  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, timeZone);

  let a11 = getLunarMonth11(year, timeZone);
  let b11 = a11;
  let lunarYear: number;

  if (a11 >= monthStart) {
    lunarYear = year;
    a11 = getLunarMonth11(year - 1, timeZone);
  } else {
    lunarYear = year + 1;
    b11 = getLunarMonth11(year + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) lunarLeap = 1;
    }
  }

  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap };
}

const pad2 = (value: number) => value.toString().padStart(2, '0');

/** "Tức ngày 04 tháng 12 âm lịch" — đúng định dạng trong bản demo. */
export function formatLunarLine(date: Date) {
  const lunar = solarToLunar(date);
  const leap = lunar.leap ? ' nhuận' : '';
  return `Tức ngày ${pad2(lunar.day)} tháng ${pad2(lunar.month)}${leap} âm lịch`;
}
