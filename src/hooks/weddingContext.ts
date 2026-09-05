import { createContext, useContext } from 'react';
import type { weddingData } from '../data/weddingData';
import type { Guest } from '../lib/guest';
import type { GuestbookMode, GuestbookSaveMode, Wish } from './useGuestbook';

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ModalState {
  guestbook: boolean;
  rsvp: boolean;
  giftbox: boolean;
  calendar: boolean;
}

export interface WeddingContextType {
  data: typeof weddingData;
  /** Khách mời đọc từ `?guest=` trên URL; `null` khi mở bằng link dùng chung. */
  guest: Guest | null;
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  modals: ModalState;
  openModal: (modal: keyof ModalState) => void;
  closeModal: (modal: keyof ModalState) => void;
  wishes: Wish[];
  addWish: (name: string, message: string) => Promise<GuestbookSaveMode | false>;
  isRealtimeGuestbook: boolean;
  guestbookMode: GuestbookMode;
  guestbookLoading: boolean;
  isMusicPlaying: boolean;
  hasBackgroundMusic: boolean;
  toggleMusic: () => void;
  startMusic: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const WeddingContext = createContext<WeddingContextType | null>(null);

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
}
