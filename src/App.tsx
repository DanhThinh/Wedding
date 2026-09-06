import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeddingProvider } from './hooks/useWedding';
import { useWedding } from './hooks/weddingContext';
import Preloader from './components/Preloader';
import EnvelopeDialog from './components/EnvelopeDialog';
import FallingPetals from './components/FallingPetals';
import MusicToggle from './components/MusicToggle';
import ThemeToggle from './components/ThemeToggle';
import Toast from './components/Toast';
import DevQAPanel from './components/DevQAPanel';
import { GuestbookModal } from './components/Modal';
import HomePage from './pages/HomePage';
import InvitePage from './pages/InvitePage';
import { trackEvent } from './lib/analytics';
import { startRevealEngine } from './lib/reveal';
import { startPointerFx } from './lib/pointerFx';
import { getEnvelopeOpened, markEnvelopeOpened } from './lib/inviteSession';
import type { Guest } from './lib/guest';
import './styles/main.scss';

const RSVPPage = lazy(() => import('./pages/RSVPPage'));

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

/**
 * Giao diện bản cũ (header + quick actions + phong bì 3D), giữ lại ở `/classic`.
 * Trang chủ `/` giờ dùng giao diện thiệp dựng theo video demo.
 */
function ClassicLayout() {
  const [envelopeOpened, setEnvelopeOpened] = useState(getEnvelopeOpened);
  const [showPetals, setShowPetals] = useState(false);

  const { hasBackgroundMusic, startMusic } = useWedding();

  const handleEnvelopeOpen = () => {
    markEnvelopeOpened();
    setEnvelopeOpened(true);
    setShowPetals(true);
    void trackEvent('envelope_open', {
      has_music: hasBackgroundMusic,
    });
    // Bật nhạc nền ngay khi mở thiệp (user gesture cho phép autoplay)
    startMusic();
  };

  useEffect(() => {
    if (!showPetals) return;
    const timer = window.setTimeout(() => setShowPetals(false), 8000);
    return () => window.clearTimeout(timer);
  }, [showPetals]);

  return (
    <>
      <Preloader />
      {!envelopeOpened && <EnvelopeDialog onOpen={handleEnvelopeOpen} />}

      {/* Cánh hoa rơi — chỉ hiển thị sau khi mở thiệp */}
      {showPetals && <FallingPetals burst count={12} />}

      {/* Cụm nút điều khiển nổi (nhạc + theme) — chỉ hiện sau khi mở thiệp.
          Nút nhạc phụ thuộc việc đã cấu hình file nhạc, nút theme thì luôn có. */}
      {envelopeOpened && (
        <div className="floating-controls">
          {hasBackgroundMusic && <MusicToggle />}
          <ThemeToggle />
        </div>
      )}

      <HomePage />
    </>
  );
}

function AppContent() {
  // Hai engine chuyển động dùng chung cho toàn trang (reveal khi cuộn + ánh sáng theo con trỏ).
  useEffect(() => {
    const stopReveal = startRevealEngine();
    const stopPointerFx = startPointerFx();
    return () => {
      stopReveal();
      stopPointerFx();
    };
  }, []);

  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<InvitePage />} />
        <Route path="/classic" element={<ClassicLayout />} />
        <Route
          path="/rsvp"
          element={(
            <Suspense fallback={<div className="route-loading" role="status" aria-label="Đang tải trang" />}>
              <RSVPPage />
            </Suspense>
          )}
        />
      </Routes>
      <GuestbookModal />
      <Toast />
      {import.meta.env.DEV && <DevQAPanel />}
    </BrowserRouter>
  );
}

function App({ guest }: { guest: Guest | null }) {
  return (
    <WeddingProvider guest={guest}>
      <AppContent />
    </WeddingProvider>
  );
}

export default App;
