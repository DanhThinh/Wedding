import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeddingProvider } from './hooks/useWedding';
import Toast from './components/Toast';
import DevQAPanel from './components/DevQAPanel';
import { GuestbookModal } from './components/Modal';
import InvitePage from './pages/InvitePage';
import { startRevealEngine } from './lib/reveal';
import { startPointerFx } from './lib/pointerFx';
import type { Guest } from './lib/guest';
import './styles/main.scss';

const RSVPPage = lazy(() => import('./pages/RSVPPage'));
const ClassicLayout = lazy(() => import('./pages/ClassicPage'));
const ManagePage = lazy(() => import('./pages/ManagePage'));

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

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
      <Suspense fallback={<div className="route-loading" role="status" aria-label="Đang tải trang" />}>
        <Routes>
          <Route path="/" element={<InvitePage />} />
          <Route path="/classic" element={<ClassicLayout />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/rsvp" element={<RSVPPage />} />
        </Routes>
      </Suspense>
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
