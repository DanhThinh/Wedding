import { weddingData } from '../data/weddingData';
import { getFirebaseClient, isFirebaseConfigured } from './firebase';

export interface RsvpSubmission {
  name: string;
  phone: string;
  attending: boolean | null;
  eventIds: number[];
  plusOnes: number;
  message: string;
}

export type RsvpErrors = Partial<Record<keyof RsvpSubmission, string>>;
export type DeliveryReason = 'offline' | 'timeout' | 'unavailable' | 'rejected';
export interface RsvpDraft {
  id: string;
  editToken: string;
  revision: number;
  status: 'draft' | 'pending' | 'sent';
  input: RsvpSubmission;
}

export const RSVP_CHANGED_EVENT = 'wedding-rsvp-changed';
export const RSVP_TIMEOUT_MS = 8000;
const STORAGE_PREFIX = 'wedding-rsvp-v2:';
const inFlight = new Map<string, { revision: number; promise: Promise<DeliveryResult> }>();
export type DeliveryResult = { mode: 'firestore' } | { mode: 'pending'; reason: DeliveryReason };

export const normalizePhone = (phone: string) => phone.replace(/\D/g, '');
export const rsvpStorageKey = (guestName = '') => `${STORAGE_PREFIX}${encodeURIComponent(guestName.trim()) || 'general'}`;

export function validateRsvp(input: RsvpSubmission): RsvpErrors {
  const errors: RsvpErrors = {};
  if (!input.name.trim()) errors.name = 'Vui lòng nhập họ tên';
  else if (input.name.trim().length > 100) errors.name = 'Họ tên không được vượt quá 100 ký tự';
  if (input.attending === null) errors.attending = 'Vui lòng chọn một lựa chọn tham dự';
  if (input.phone.trim() && !/^[0-9]{10,11}$/.test(normalizePhone(input.phone))) errors.phone = 'Số điện thoại cần có 10–11 chữ số';
  const allowedIds = weddingData.events.map(event => event.id);
  if (input.attending && input.eventIds.length === 0) errors.eventIds = 'Vui lòng chọn ít nhất một tiệc';
  else if (input.eventIds.some(id => !allowedIds.includes(id)) || new Set(input.eventIds).size !== input.eventIds.length) errors.eventIds = 'Danh sách tiệc không hợp lệ';
  if (!Number.isInteger(input.plusOnes) || input.plusOnes < 0 || input.plusOnes > 10) errors.plusOnes = 'Số người đi cùng phải từ 0 đến 10';
  if (input.message.trim().length > 500) errors.message = 'Lời nhắn không được vượt quá 500 ký tự';
  return errors;
}

function randomHex(bytes: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function createRsvpDraft(guestName = ''): RsvpDraft {
  return {
    id: randomHex(16), editToken: randomHex(32), revision: 0, status: 'draft',
    input: { name: guestName, phone: '', attending: null, eventIds: [], plusOnes: 0, message: '' },
  };
}

function isDraft(value: unknown): value is RsvpDraft {
  if (!value || typeof value !== 'object') return false;
  const draft = value as RsvpDraft;
  const input = draft.input;
  return typeof draft.id === 'string' && /^[a-f0-9]{32}$/.test(draft.id)
    && typeof draft.editToken === 'string' && /^[a-f0-9]{64}$/.test(draft.editToken)
    && Number.isInteger(draft.revision) && draft.revision >= 0
    && ['draft', 'pending', 'sent'].includes(draft.status)
    && Boolean(input) && typeof input.name === 'string' && typeof input.phone === 'string'
    && (input.attending === null || typeof input.attending === 'boolean')
    && Array.isArray(input.eventIds) && input.eventIds.every(id => Number.isInteger(id))
    && typeof input.plusOnes === 'number' && typeof input.message === 'string';
}

export function readRsvpDraft(key: string): RsvpDraft | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!isDraft(parsed)) throw new Error('Bản nháp đã lưu không hợp lệ');
  return parsed;
}

export function persistRsvpDraft(key: string, draft: RsvpDraft) {
  // Do not silently overwrite a damaged draft.
  readRsvpDraft(key);
  localStorage.setItem(key, JSON.stringify(draft));
}

function markDelivered(key: string, draft: RsvpDraft) {
  try {
    const current = readRsvpDraft(key);
    // A late acknowledgement must never mark a newer edit as delivered.
    if (current?.id !== draft.id || current.revision !== draft.revision
      || JSON.stringify(current.input) !== JSON.stringify(draft.input)) return;
    const delivered: RsvpDraft = { ...current, status: 'sent' };
    localStorage.setItem(key, JSON.stringify(delivered));
    window.dispatchEvent(new CustomEvent(RSVP_CHANGED_EVENT, { detail: { key, draft: delivered } }));
  } catch {
    // A retry still uses the same document ID if storage became unavailable.
  }
}

export async function withDeadline<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<T>(resolve => {
      timer = setTimeout(() => resolve(fallback), timeoutMs);
    })]);
  } finally { clearTimeout(timer); }
}

/** One document per confirmation. A private 256-bit capability authorizes edits.
 * Rules deny guest reads; the capability stays on this device, never in links or analytics.
 */
export async function saveRsvp(draft: RsvpDraft, key: string): Promise<DeliveryResult> {
  if (Object.keys(validateRsvp(draft.input)).length) throw new Error('Thông tin xác nhận không hợp lệ');
  persistRsvpDraft(key, { ...draft, status: 'pending' });
  if (!isFirebaseConfigured) return { mode: 'pending', reason: 'unavailable' };
  if (navigator.onLine === false) return { mode: 'pending', reason: 'offline' };

  let active = inFlight.get(draft.id);
  if (!active || active.revision !== draft.revision) {
    const promise = (async (): Promise<DeliveryResult> => {
      try {
        const client = await getFirebaseClient();
        if (!client) return { mode: 'pending', reason: 'unavailable' };
        const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
        const { input } = draft;
        await setDoc(doc(client.db, 'rsvps', draft.id), {
          schemaVersion: 2,
          name: input.name.trim(), phone: normalizePhone(input.phone), attending: input.attending,
          eventIds: input.attending ? [...input.eventIds].sort((a, b) => a - b) : [],
          plusOnes: input.attending ? input.plusOnes : 0,
          message: input.message.trim(), editToken: draft.editToken, updatedAt: serverTimestamp(),
        });
        markDelivered(key, draft);
        return { mode: 'firestore' };
      } catch { return { mode: 'pending', reason: 'rejected' }; }
    })();
    active = { revision: draft.revision, promise };
    inFlight.set(draft.id, active);
    void promise.finally(() => {
      if (inFlight.get(draft.id)?.promise === promise) inFlight.delete(draft.id);
    });
  }
  return withDeadline<DeliveryResult>(active.promise, RSVP_TIMEOUT_MS, { mode: 'pending', reason: 'timeout' });
}
