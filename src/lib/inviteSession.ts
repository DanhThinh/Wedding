/**
 * Trạng thái theo phiên của thiệp: đã mở bìa chưa, và đang mời ai.
 * Gom về một chỗ để App / InvitePage / WeddingProvider không mỗi nơi
 * tự đọc sessionStorage một kiểu.
 */
import { parseGuest, type Guest } from './guest';

const ENVELOPE_KEY = 'envelope-opened';
const GUEST_KEY = 'wedding-guest';

/* Storage có thể bị chặn (chế độ riêng tư) — mọi thao tác đều phải nuốt lỗi
   để thiệp vẫn dùng được, chỉ mất khả năng ghi nhớ giữa các lần tải trang. */
function readKey(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeKey(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Bỏ qua: chỉ mất phần ghi nhớ, luồng chính vẫn chạy.
  }
}

function removeKey(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Bỏ qua, như trên.
  }
}

export function getEnvelopeOpened(): boolean {
  return readKey(ENVELOPE_KEY) === 'true';
}

export function markEnvelopeOpened() {
  writeKey(ENVELOPE_KEY, 'true');
}

function parseStoredGuest(raw: string | null): Guest | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const guest = parsed as Record<string, unknown>;
    if (typeof guest.name !== 'string' || !guest.name) return null;
    return {
      name: guest.name,
      title: typeof guest.title === 'string' ? guest.title : '',
      label: typeof guest.label === 'string' ? guest.label : guest.name,
    };
  } catch {
    return null;
  }
}

/**
 * Xác định khách mời của phiên hiện tại.
 *
 * - Có `?guest=` trên URL thì lấy theo URL và nhớ lại, để khách bấm sang
 *   `/rsvp` rồi quay về vẫn giữ được tên dù query string đã mất.
 * - Mở link của một khách *khác* trong cùng phiên thì xoá cờ đã-mở-bìa,
 *   nếu không người thứ hai sẽ mất luôn màn bìa thiệp mang tên mình.
 */
export function resolveGuest(search: string): Guest | null {
  const stored = readKey(GUEST_KEY);
  const fromUrl = parseGuest(search);

  if (!fromUrl) return parseStoredGuest(stored);

  const serialized = JSON.stringify(fromUrl);
  if (serialized !== stored) {
    writeKey(GUEST_KEY, serialized);
    removeKey(ENVELOPE_KEY);
  }
  return fromUrl;
}
