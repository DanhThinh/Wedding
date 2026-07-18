import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { weddingData } from '../data/weddingData';
import { useGuestbook } from './useGuestbook';
import { WeddingContext } from './weddingContext';
import type { ModalState, ToastState } from './weddingContext';

/** Chỉ bật nút nhạc khi đã cấu hình asset thật. */
const BACKGROUND_MUSIC_SRC = import.meta.env.VITE_BACKGROUND_MUSIC_SRC?.trim() || '';

function getSavedTheme(): 'light' | 'dark' {
  return 'light';
}

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  });
  const toastTimerRef = useRef<number | null>(null);

  const [modals, setModals] = useState<ModalState>({
    guestbook: false,
    rsvp: false,
    giftbox: false,
    calendar: false,
  });

  // Guestbook (Firestore realtime hoặc localStorage fallback)
  const {
    wishes,
    addWish: addWishToStore,
    isRealtime: isRealtimeGuestbook,
    loading: guestbookLoading,
    mode: guestbookMode,
  } = useGuestbook();

  // ─── Background Music ────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    if (!BACKGROUND_MUSIC_SRC) return;
    const audio = new Audio(BACKGROUND_MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Sync state when audio ends unexpectedly
    const handlePause = () => setIsMusicPlaying(false);
    const handlePlay = () => setIsMusicPlaying(true);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  /** Bật nhạc (cần gọi từ user gesture, ví dụ khi mở thiệp) */
  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isMusicPlaying) return;
    // Fade in từ 0
    audio.volume = 0;
    audio.play().then(() => {
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol = Math.min(vol + 0.05, 0.35);
        audio.volume = vol;
        if (vol >= 0.35) clearInterval(fadeIn);
      }, 80);
    }).catch(() => {
      // Autoplay bị chặn — cần user gesture tiếp
    });
  }, [isMusicPlaying]);

  /** Toggle bật/tắt nhạc */
  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);
  // ─────────────────────────────────────────────────────────────

  // ─── Theme (Light / Dark) ────────────────────────────────────
  const [theme, setTheme] = useState<'light' | 'dark'>(getSavedTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('wedding-theme', theme);
    } catch {
      // Theme vẫn hoạt động trong phiên hiện tại nếu storage bị chặn.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);
  // ─────────────────────────────────────────────────────────────

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ show: true, message, type });
    toastTimerRef.current = window.setTimeout(() => {
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

  const addWish = async (name: string, message: string) => {
    const mode = await addWishToStore(name, message);
    if (mode === 'firestore') {
      showToast('Lời chúc đã được gửi realtime!', 'success');
    } else if (mode === 'local') {
      showToast('Đã lưu lời chúc trên thiết bị này.', 'info');
    } else {
      showToast('Gửi lời chúc thất bại, thử lại nhé!', 'error');
    }
    return mode;
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
        isRealtimeGuestbook,
        guestbookMode,
        guestbookLoading,
        isMusicPlaying,
        hasBackgroundMusic: Boolean(BACKGROUND_MUSIC_SRC),
        toggleMusic,
        startMusic,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}
