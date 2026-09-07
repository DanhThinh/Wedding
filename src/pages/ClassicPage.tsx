import { useEffect, useState } from 'react';
import { useWedding } from '../hooks/weddingContext';
import Preloader from '../components/Preloader';
import EnvelopeDialog from '../components/EnvelopeDialog';
import FallingPetals from '../components/FallingPetals';
import MusicToggle from '../components/MusicToggle';
import ThemeToggle from '../components/ThemeToggle';
import HomePage from './HomePage';
import { trackEvent } from '../lib/analytics';
import { getEnvelopeOpened, markEnvelopeOpened } from '../lib/inviteSession';

export default function ClassicPage() {
  const [opened, setOpened] = useState(getEnvelopeOpened);
  const [showPetals, setShowPetals] = useState(false);
  const { hasBackgroundMusic, startMusic } = useWedding();
  useEffect(() => {
    if (!showPetals) return;
    const timer = window.setTimeout(() => setShowPetals(false), 8000);
    return () => window.clearTimeout(timer);
  }, [showPetals]);
  const open = () => {
    markEnvelopeOpened(); setOpened(true); setShowPetals(true);
    void trackEvent('envelope_open', { has_music: hasBackgroundMusic });
    startMusic();
  };
  return <>
    <Preloader />
    {!opened && <EnvelopeDialog onOpen={open} />}
    {showPetals && <FallingPetals burst count={12} />}
    {opened && <div className="floating-controls">{hasBackgroundMusic && <MusicToggle />}<ThemeToggle /></div>}
    <HomePage />
  </>;
}
