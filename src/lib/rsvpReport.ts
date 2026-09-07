export interface RsvpReportRow {
  id: string;
  source: 'rsvps' | 'attendances';
  name: string;
  phone: string;
  attending: boolean;
  eventIds: number[];
  plusOnes: number;
  message: string;
  updatedAt: string;
}

/** Accept only explicitly exported fields. Never retain edit capabilities in reports. */
export function parseRsvpReport(input: unknown): RsvpReportRow[] {
  const values = Array.isArray(input) ? input : (input as { rows?: unknown } | null)?.rows;
  if (!Array.isArray(values) || values.length > 10000) throw new Error('Tệp cần có danh sách rows, tối đa 10.000 xác nhận.');
  return values.map((value, index) => {
    if (!value || typeof value !== 'object') throw new Error(`Dòng ${index + 1} không hợp lệ.`);
    const row = value as Record<string, unknown>;
    if (typeof row.name !== 'string' || !row.name.trim() || row.name.length > 100
      || !['rsvps', 'attendances'].includes(String(row.source))
      || typeof row.attending !== 'boolean' || !Array.isArray(row.eventIds)
      || row.eventIds.some(id => !Number.isInteger(id) || ![1, 2, 3].includes(id))
      || new Set(row.eventIds).size !== row.eventIds.length
      || !Number.isInteger(row.plusOnes) || Number(row.plusOnes) < 0 || Number(row.plusOnes) > 10) {
      throw new Error(`Thông tin khách ở dòng ${index + 1} không hợp lệ.`);
    }
    return {
      id: typeof row.id === 'string' ? row.id : String(index + 1),
      source: row.source as RsvpReportRow['source'], name: row.name,
      phone: typeof row.phone === 'string' ? row.phone : '', attending: row.attending,
      eventIds: row.attending ? row.eventIds as number[] : [],
      plusOnes: row.attending ? row.plusOnes as number : 0,
      message: typeof row.message === 'string' ? row.message.slice(0, 500) : '',
      updatedAt: typeof row.updatedAt === 'string' ? row.updatedAt : '',
    };
  });
}

export function summarizeRsvps(rows: RsvpReportRow[], eventIds: number[]) {
  return {
    confirmations: rows.length,
    attending: rows.filter(row => row.attending).length,
    declined: rows.filter(row => !row.attending).length,
    people: rows.reduce((count, row) => count + (row.attending ? row.plusOnes + 1 : 0), 0),
    unassigned: rows.filter(row => row.attending && !row.eventIds.length).length,
    byEvent: eventIds.map(id => ({ id, people: rows.reduce((count, row) => count + (row.attending && row.eventIds.includes(id) ? row.plusOnes + 1 : 0), 0) })),
  };
}

function csvCell(value: unknown) {
  let text = String(value ?? '');
  // Prevent spreadsheet formulas from being executed when a guest controls a field.
  if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text) || /^0\d+$/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function rsvpReportCsv(rows: RsvpReportRow[], eventNames: Record<number, string> = {}) {
  return '\ufeff' + [
    ['Họ tên', 'Số điện thoại', 'Tham dự', 'Tiệc', 'Người đi cùng', 'Tổng người', 'Lời nhắn', 'Cập nhật', 'Nguồn', 'Mã xác nhận'],
    ...rows.map(row => [row.name, row.phone, row.attending ? 'Có' : 'Không',
      row.eventIds.map(id => eventNames[id] ?? `Tiệc ${id}`).join('; ') || (row.attending ? 'Chưa chọn tiệc' : ''),
      row.plusOnes, row.attending ? row.plusOnes + 1 : 0, row.message, row.updatedAt, row.source, row.id]),
  ].map(row => row.map(csvCell).join(',')).join('\r\n');
}
