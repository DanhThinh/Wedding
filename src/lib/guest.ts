/**
 * Thiệp mời cá nhân hoá: tên khách nằm thẳng trong đường link, không cần
 * danh sách khách lưu ở đâu cả.
 *
 *   https://.../Wedding/?t=Anh&guest=Nguyễn%20Văn%20Quang
 *                        └ xưng hô ┘  └──── họ tên ────┘
 *
 * `scripts/guests.mjs` sinh link theo đúng hai tên tham số này — sửa ở đây thì
 * phải sửa cả bên đó (đã có test khoá lại ở `guest.test.ts`).
 */

/** Tham số họ tên — bắt buộc, không có thì coi như không phải link cá nhân hoá. */
export const GUEST_NAME_PARAM = 'guest';
/** Tham số xưng hô (Anh / Chị / Gia đình…) — không bắt buộc. */
export const GUEST_TITLE_PARAM = 't';

/** Tên đến từ URL nên ai cũng sửa được; chặn độ dài để không phá vỡ bố cục. */
export const GUEST_MAX_LENGTH = 60;

export interface Guest {
  /** Họ tên trần — dùng để điền sẵn các ô "Họ tên". */
  name: string;
  /** Xưng hô, có thể là chuỗi rỗng. */
  title: string;
  /** Chuỗi để hiển thị trên thiệp, ví dụ "Anh Nguyễn Văn Quang". */
  label: string;
}

/**
 * Bỏ ký tự điều khiển / zero-width, gom khoảng trắng và cắt bớt độ dài.
 * Cắt theo code point (không phải mã UTF-16) để không xé đôi ký tự có dấu.
 */
export function sanitizeGuestValue(value: string | null | undefined): string {
  if (!value) return '';
  const cleaned = value
    .replace(/[\p{Cc}\p{Cf}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return [...cleaned].slice(0, GUEST_MAX_LENGTH).join('').trim();
}

/**
 * Đọc khách mời từ query string.
 * Trả `null` khi không có `?guest=` — lúc đó thiệp chạy như bản dùng chung.
 */
export function parseGuest(search: string): Guest | null {
  const params = new URLSearchParams(search);
  const name = sanitizeGuestValue(params.get(GUEST_NAME_PARAM));
  if (!name) return null;

  const title = sanitizeGuestValue(params.get(GUEST_TITLE_PARAM));
  return { name, title, label: title ? `${title} ${name}` : name };
}

/** Ghép link mời cho một khách. Dùng chung bởi app và script sinh link. */
export function buildGuestUrl(baseUrl: string, name: string, title = ''): string {
  const cleanName = sanitizeGuestValue(name);
  if (!cleanName) throw new Error('Thiếu họ tên khách mời');

  const url = new URL(baseUrl);
  const cleanTitle = sanitizeGuestValue(title);
  if (cleanTitle) url.searchParams.set(GUEST_TITLE_PARAM, cleanTitle);
  url.searchParams.set(GUEST_NAME_PARAM, cleanName);
  return url.toString();
}
