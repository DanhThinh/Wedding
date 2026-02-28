import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeddingProvider } from './hooks/useWedding';
import Preloader from './components/Preloader';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import RSVPPage from './pages/RSVPPage';
import './styles/main.scss';

function App() {
  return (
    <WeddingProvider>
      <BrowserRouter>
        <Preloader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rsvp" element={<RSVPPage />} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </WeddingProvider>
  );
}

export default App;
