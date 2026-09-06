export const VIETNAM_UTC_OFFSET_HOURS = 7;

/** Calendar fields at a fixed UTC offset, independent of the visitor's timezone. */
export function getDateParts(date: Date, utcOffsetHours = VIETNAM_UTC_OFFSET_HOURS) {
  const shifted = new Date(date.getTime() + utcOffsetHours * 60 * 60 * 1000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
  };
}
