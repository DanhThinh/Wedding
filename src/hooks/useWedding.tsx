import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { weddingData } from '../data/weddingData';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ModalState {
  guestbook: boolean;
  rsvp: boolean;
  giftbox: boolean;
  calendar: boolean;
}

interface WeddingContextType {
  data: typeof weddingData;
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  modals: ModalState;
  openModal: (modal: keyof ModalState) => void;
  closeModal: (modal: keyof ModalState) => void;
  wishes: Array<{ name: string; message: string; date: string }>;
  addWish: (name: string, message: string) => void;
}

const WeddingContext = createContext<WeddingContextType | null>(null);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  });

  const [modals, setModals] = useState<ModalState>({
    guestbook: false,
    rsvp: false,
    giftbox: false,
    calendar: false,
  });

  const [wishes, setWishes] = useState<Array<{ name: string; message: string; date: string }>>(() => {
    const saved = localStorage.getItem('wedding-wishes');
    return saved ? JSON.parse(saved) : [
      { name: 'Minh Anh', message: 'Chúc hai bạn trăm năm hạnh phúc!', date: new Date().toISOString() },
      { name: 'Hoàng Dũng', message: 'Chúc mừng hạnh phúc! Sớm có thiên thần nhỏ nhé!', date: new Date().toISOString() },
    ];
  });

  useEffect(() => {
    localStorage.setItem('wedding-wishes', JSON.stringify(wishes));
  }, [wishes]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const openModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
    document.body.style.overflow = '';
  };

  const addWish = (name: string, message: string) => {
    const newWish = { name, message, date: new Date().toISOString() };
    setWishes((prev) => [newWish, ...prev]);
    showToast('Gửi lời chúc thành công!', 'success');
  };

  return (
    <WeddingContext.Provider
      value={{
        data: weddingData,
        toast,
        showToast,
        modals,
        openModal,
        closeModal,
        wishes,
        addWish,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
}
