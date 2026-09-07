import { lazy, useEffect, useState } from 'react';
import DeferredSection from '../components/DeferredSection';
import InviteCover from '../components/invite/InviteCover';
import InviteHero from '../components/invite/InviteHero';
import InviteGreeting from '../components/invite/InviteGreeting';
import InviteCountdown from '../components/invite/InviteCountdown';
import InviteStory from '../components/invite/InviteStory';
import InviteCouple from '../components/invite/InviteCouple';
import InviteCeremony from '../components/invite/InviteCeremony';
import InviteVenue from '../components/invite/InviteVenue';
import InvitePhotobooth from '../components/invite/InvitePhotobooth';
import InviteRsvp from '../components/invite/InviteRsvp';
import InviteGuestbook from '../components/invite/InviteGuestbook';
import InviteGift from '../components/invite/InviteGift';
import InviteDock from '../components/invite/InviteDock';
import InviteRsvpSheet from '../components/invite/InviteRsvpSheet';
import FallingPetals from '../components/FallingPetals';
import { useWedding } from '../hooks/weddingContext';
import { trackEvent } from '../lib/analytics';
import { getEnvelopeOpened, markEnvelopeOpened } from '../lib/inviteSession';

// Album kéo theo LightGallery (~20 kB gzip) mà lại nằm cuối trang — nạp trễ
// để lần mở thiệp đầu tiên trên 4G nhẹ nhất có thể.
const InviteAlbum = lazy(() => import('../components/invite/InviteAlbum'));

/**
 * Trang thiệp dựng theo video demo — cuộn một mạch từ bìa tới lời cảm ơn.
 * Thứ tự các khối bám đúng trình tự xuất hiện trong demo.
 */
export default function InvitePage() {
  const [opened, setOpened] = useState(getEnvelopeOpened);
  const [showPetals, setShowPetals] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const { hasBackgroundMusic, startMusic } = useWedding();

  const handleOpen = () => {
    markEnvelopeOpened();
    setOpened(true);
    setShowPetals(true);
    void trackEvent('envelope_open', { has_music: hasBackgroundMusic });
    // Cú chạm mở thiệp chính là user gesture cho phép autoplay.
    startMusic();
  };

  useEffect(() => {
    if (!showPetals) return;
    const timer = window.setTimeout(() => setShowPetals(false), 8000);
    return () => window.clearTimeout(timer);
  }, [showPetals]);

  return (
    <div className="invite">
      {!opened && <InviteCover onOpen={handleOpen} />}
      {showPetals && <FallingPetals burst count={12} shape="mix" />}

      <main id="main-content" tabIndex={-1} className="invite__scroll">
        <InviteHero />
        <InviteGreeting />
        <InviteCountdown />
        <InviteStory />
        <InviteCouple />
        <InviteCeremony />
        <InviteVenue />
        <InvitePhotobooth />
        <InviteRsvp onOpen={() => setRsvpOpen(true)} />
        <InviteGuestbook />
        <InviteGift />
        <DeferredSection id="album">
          <InviteAlbum />
        </DeferredSection>
      </main>

      {opened && <InviteDock onOpenRsvp={() => setRsvpOpen(true)} />}
      <InviteRsvpSheet open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </div>
  );
}
