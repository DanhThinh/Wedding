import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeddingProvider } from './hooks/useWedding';
import Preloader from './components/Preloader';
import EnvelopeDialog from './components/EnvelopeDialog';
import Toast from './components/Toast';
import DevQAPanel from './components/DevQAPanel';
import HomePage from './pages/HomePage';
import RSVPPage from './pages/RSVPPage';
import './styles/main.scss';

function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(
    () => sessionStorage.getItem('envelope-opened') === 'true'
  );

  const handleEnvelopeOpen = () => {
    sessionStorage.setItem('envelope-opened', 'true');
    setEnvelopeOpened(true);
  };

  return (
    <WeddingProvider>
      <BrowserRouter>
        <Preloader />
        {!envelopeOpened && <EnvelopeDialog onOpen={handleEnvelopeOpen} />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rsvp" element={<RSVPPage />} />
        </Routes>
        <Toast />
        {import.meta.env.DEV && <DevQAPanel />}
      </BrowserRouter>
    </WeddingProvider>
  );
}

export default App;
