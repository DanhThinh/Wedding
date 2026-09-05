/**
 * Khai báo kiểu cho `guests.mjs` — script chạy bằng Node thuần nên viết bằng
 * JavaScript, nhưng `src/lib/guest.test.ts` import nó để kiểm tra script và app
 * sinh ra cùng một dạng link.
 */

export interface GuestCsvRow {
  /** Xưng hô: Anh / Chị / Gia đình… có thể là chuỗi rỗng. */
  title: string;
  name: string;
}

export function sanitize(value: string | null | undefined): string;
export function buildLink(baseUrl: string, name: string, title?: string): string;
export function parseCsvLine(line: string): string[];
export function parseGuestCsv(content: string): GuestCsvRow[];
