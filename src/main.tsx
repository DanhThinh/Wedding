import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
