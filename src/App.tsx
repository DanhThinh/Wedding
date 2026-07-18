import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeddingProvider } from './hooks/useWedding';
import { useWedding } from './hooks/weddingContext';
import Preloader from './components/Preloader';
import EnvelopeDialog from './components/EnvelopeDialog';
import FallingPetals from './components/FallingPetals';
import MusicToggle from './components/MusicToggle';
import Toast from './components/Toast';
import DevQAPanel from './components/DevQAPanel';
import { GuestbookModal } from './components/Modal';
import HomePage from './pages/HomePage';
import { trackEvent } from './lib/analytics';
import './styles/main.scss';

const RSVPPage = lazy(() => import('./pages/RSVPPage'));

function getEnvelopeOpened() {
  try {
    return sessionStorage.getItem('envelope-opened') === 'true';
  } catch {
    return false;
  }
}

function setEnvelopeOpenedFlag() {
  try {
    sessionStorage.setItem('envelope-opened', 'true');
  } catch {
    // Storage can be unavailable in restricted browser modes; opening should still work.
  }
}

function AppContent() {
  const [envelopeOpened, setEnvelopeOpened] = useState(getEnvelopeOpened);
  const [showPetals, setShowPetals] = useState(false);

  const { hasBackgroundMusic, startMusic } = useWedding();

  const handleEnvelopeOpen = () => {
    setEnvelopeOpenedFlag();
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
    <BrowserRouter>
      <Preloader />
      {!envelopeOpened && <EnvelopeDialog onOpen={handleEnvelopeOpen} />}

      {/* Cánh hoa rơi — chỉ hiển thị sau khi mở thiệp */}
      {showPetals && <FallingPetals burst count={12} />}

      {/* Cụm nút điều khiển nổi (nhạc + theme) — chỉ hiện sau khi mở thiệp */}
      {envelopeOpened && hasBackgroundMusic && (
        <div className="floating-controls">
          <MusicToggle />
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
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

function App() {
  return (
    <WeddingProvider>
      <AppContent />
    </WeddingProvider>
  );
}

export default App;
