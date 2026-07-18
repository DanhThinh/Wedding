export interface CalendarEvent {
  name: string;
  date: string;
  time: string;
  address: string;
  description: string;
}

const VIETNAM_UTC_OFFSET_HOURS = 7;
const DEFAULT_DURATION_HOURS = 3;

function parseVietnamDate(date: string, time: string) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  if (![year, month, day, hour, minute].every(Number.isFinite)) {
    throw new Error('Ngày hoặc giờ sự kiện không hợp lệ');
  }

  return new Date(Date.UTC(
    year,
    month - 1,
    day,
    hour - VIETNAM_UTC_OFFSET_HOURS,
    minute,
  ));
}

export function formatCalendarUtc(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function getCalendarRange(event: CalendarEvent) {
  const start = parseVietnamDate(event.date, event.time);
  const end = new Date(start.getTime() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000);
  return { start, end };
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export function createIcsContent(event: CalendarEvent, now = new Date()) {
  const { start, end } = getCalendarRange(event);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Thinh Hang Wedding//VI',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${start.getTime()}-${event.name.replace(/\s+/g, '-')}@thinhhanwedding.vn`,
    `DTSTAMP:${formatCalendarUtc(now)}`,
    `DTSTART:${formatCalendarUtc(start)}`,
    `DTEND:${formatCalendarUtc(end)}`,
    `SUMMARY:${escapeIcsText(event.name)}`,
    `LOCATION:${escapeIcsText(event.address)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function createGoogleCalendarUrl(event: CalendarEvent) {
  const { start, end } = getCalendarRange(event);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${formatCalendarUtc(start)}/${formatCalendarUtc(end)}`,
    location: event.address,
    details: event.description,
    ctz: 'Asia/Ho_Chi_Minh',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcs(event: CalendarEvent) {
  const blob = new Blob([createIcsContent(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${event.name.replace(/\s+/g, '-')}.ics`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
