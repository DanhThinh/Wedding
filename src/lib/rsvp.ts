import { getFirebaseClient, isFirebaseConfigured } from './firebase';

export interface RsvpSubmission {
  name: string;
  phone: string;
  eventIds: number[];
  plusOnes: number;
}

export type RsvpErrors = Partial<Record<'name' | 'phone' | 'events', string>>;
export type RsvpSaveMode = 'firestore' | 'local';

const STORAGE_KEY = 'wedding-rsvps';

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

export function validateRsvp(input: RsvpSubmission): RsvpErrors {
  const errors: RsvpErrors = {};
  if (!input.name.trim()) errors.name = 'Vui lòng nhập tên';
  if (!input.phone) {
    errors.phone = 'Vui lòng nhập số điện thoại';
  } else if (!/^[0-9]{10,11}$/.test(input.phone)) {
    errors.phone = 'Số điện thoại cần có 10-11 chữ số';
  }
  if (input.eventIds.length === 0) errors.events = 'Vui lòng chọn ít nhất một sự kiện';
  return errors;
}

function saveRsvpLocally(input: RsvpSubmission) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) as unknown : [];
  const stored = Array.isArray(parsed) ? parsed : [];
  stored.push({ ...input, submittedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export async function saveRsvp(input: RsvpSubmission): Promise<RsvpSaveMode> {
  if (isFirebaseConfigured) {
    try {
      const client = await getFirebaseClient();
      if (client) {
        const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
        await addDoc(collection(client.db, 'rsvps'), {
          ...input,
          name: input.name.trim(),
          createdAt: serverTimestamp(),
        });
        return 'firestore';
      }
    } catch (err) {
      console.error('[RSVP] Không thể gửi lên Firestore, chuyển sang lưu cục bộ:', err);
    }
  }

  saveRsvpLocally(input);
  return 'local';
}
