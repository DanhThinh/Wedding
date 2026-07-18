import { useState, useEffect, useCallback, useRef } from 'react';
import type { Timestamp } from 'firebase/firestore';
import { getFirebaseClient, isFirebaseConfigured } from '../lib/firebase';

export interface Wish {
  id?: string;
  name: string;
  message: string;
  date: string;
}

const STORAGE_KEY = 'wedding-wishes';
const COLLECTION_NAME = 'wishes';

const DEFAULT_WISHES: Wish[] = [];

function isWish(value: unknown): value is Wish {
  if (!value || typeof value !== 'object') return false;
  const wish = value as Record<string, unknown>;
  return (
    typeof wish.name === 'string' &&
    typeof wish.message === 'string' &&
    typeof wish.date === 'string'
  );
}

function parseSavedWishes(raw: string | null) {
  if (!raw) return DEFAULT_WISHES;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      const validWishes = parsed.filter(isWish);
      return validWishes.length > 0 ? validWishes : DEFAULT_WISHES;
    }
  } catch (err) {
    console.error('[Guestbook] Dữ liệu localStorage không hợp lệ:', err);
  }
  return DEFAULT_WISHES;
}

/**
 * Hook quản lý guestbook với 2 chế độ:
 * 1. Firestore realtime (nếu Firebase đã config) — khách thấy lời chúc của nhau ngay lập tức
 * 2. localStorage fallback (nếu chưa config) — vẫn hoạt động, sync giữa các tab
 */
export function useGuestbook() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isRealtime, setIsRealtime] = useState(false);
  const [loading, setLoading] = useState(true);
  const modeRef = useRef<'loading' | 'firestore' | 'local'>('loading');

  const loadFromLocalStorage = useCallback(() => {
    try {
      setWishes(parseSavedWishes(localStorage.getItem(STORAGE_KEY)));
    } catch (err) {
      console.error('[Guestbook] Không thể đọc localStorage:', err);
      setWishes(DEFAULT_WISHES);
    }
    setLoading(false);
  }, []);

  const saveToLocalStorage = useCallback((name: string, message: string) => {
    const newWish: Wish = { name, message, date: new Date().toISOString() };
    try {
      const current = parseSavedWishes(localStorage.getItem(STORAGE_KEY));
      const updated = [newWish, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setWishes(updated);
      return true;
    } catch (err) {
      console.error('[Guestbook] Không thể lưu localStorage:', err);
      return false;
    }
  }, []);

  // ─── Chế độ 1: Firestore realtime ───
  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const start = async () => {
      if (isFirebaseConfigured) {
        const client = await getFirebaseClient();
        if (!active) return;
        if (client) {
          const { collection, onSnapshot, orderBy, query } = await import('firebase/firestore');
          if (!active) return;
          const q = query(collection(client.db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
          modeRef.current = 'firestore';
          setIsRealtime(true);
          unsubscribe = onSnapshot(
            q,
            snapshot => {
              const items: Wish[] = snapshot.docs.map(doc => {
                const data = doc.data();
                const createdAt = data.createdAt as Timestamp | null;
                return {
                  id: doc.id,
                  name: typeof data.name === 'string' ? data.name : '',
                  message: typeof data.message === 'string' ? data.message : '',
                  date: createdAt ? createdAt.toDate().toISOString() : new Date().toISOString(),
                };
              });
              setWishes(items);
              setLoading(false);
            },
            err => {
              console.error('[Guestbook] Lỗi realtime, fallback localStorage:', err);
              modeRef.current = 'local';
              setIsRealtime(false);
              loadFromLocalStorage();
            },
          );
          return;
        }
      }

      modeRef.current = 'local';
      setIsRealtime(false);
      loadFromLocalStorage();
    };

    void start();
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [loadFromLocalStorage]);

  // Sync localStorage giữa các tab (chỉ khi không dùng realtime)
  useEffect(() => {
    if (isRealtime) return;
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setWishes(parseSavedWishes(e.newValue));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [isRealtime]);

  // ─── Thêm lời chúc ───
  const addWish = useCallback(
    async (name: string, message: string): Promise<boolean> => {
      const trimmedName = name.trim();
      const trimmedMessage = message.trim();
      if (!trimmedName || !trimmedMessage) return false;

      if (modeRef.current !== 'local' && isFirebaseConfigured) {
        try {
          const client = await getFirebaseClient();
          if (!client) throw new Error('Firebase chưa sẵn sàng');
          const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
          await addDoc(collection(client.db, COLLECTION_NAME), {
            name: trimmedName,
            message: trimmedMessage,
            createdAt: serverTimestamp(),
          });
          // onSnapshot sẽ tự cập nhật danh sách
          return true;
        } catch (err) {
          console.error('[Guestbook] Lỗi Firestore, chuyển sang lưu cục bộ:', err);
          modeRef.current = 'local';
          setIsRealtime(false);
          return saveToLocalStorage(trimmedName, trimmedMessage);
        }
      }

      return saveToLocalStorage(trimmedName, trimmedMessage);
    },
    [saveToLocalStorage]
  );

  return { wishes, addWish, isRealtime, loading };
}
