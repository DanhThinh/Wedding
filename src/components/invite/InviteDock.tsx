import { inviteData } from '../../data/inviteData';
import { useWedding } from '../../hooks/weddingContext';
import { trackEvent } from '../../lib/analytics';
import { ChairGlyph, ChatGlyph } from './art';

interface InviteDockProps {
  onOpenRsvp: () => void;
}

/**
 * Bộ điều khiển nổi cố định của bản demo:
 *  · nút nhạc dạng viên thuốc ở góc trên phải
 *  · dòng chữ dọc "made with" bám mép phải
 *  · thanh dưới cùng: ô "Gửi lời chúc...", nút hộp quà, nút xác nhận tham dự
 */
export default function InviteDock({ onOpenRsvp }: InviteDockProps) {
  const { chrome } = inviteData;
  const { openModal, isMusicPlaying, hasBackgroundMusic, toggleMusic } = useWedding();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {hasBackgroundMusic && (
        <button
          type="button"
          className={`invite-music ${isMusicPlaying ? 'is-playing' : ''}`}
          onClick={() => {
            void trackEvent('music_toggle', { target_state: isMusicPlaying ? 'off' : 'on' });
            toggleMusic();
          }}
          aria-label={isMusicPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        >
          <span className="invite-music__bars" aria-hidden="true">
            <i /><i /><i />
          </span>
        </button>
      )}

      <p className="invite-watermark" aria-hidden="true">{chrome.watermark}</p>

      <div className="invite-dock">
        <button
          type="button"
          className="invite-dock__wish"
          onClick={() => openModal('guestbook')}
        >
          <span>{chrome.wishPlaceholder}</span>
          <ChatGlyph />
        </button>

        <div className="invite-dock__item">
          <button type="button" className="invite-dock__icon" onClick={() => scrollTo('gift')} aria-label="Hộp quà mừng">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
              <path d="M3 7h18v4H3z" />
              <path d="M12 7v14" />
              <path d="M12 7C9 7 7.5 3 9.8 3S12 5.5 12 7z" />
              <path d="M12 7c3 0 4.5-4 2.2-4S12 5.5 12 7z" />
            </svg>
          </button>
          <span className="invite-dock__caption" aria-hidden="true">Quà</span>
        </div>

        <div className="invite-dock__item">
          <button type="button" className="invite-dock__icon" onClick={onOpenRsvp} aria-label="Xác nhận tham dự">
            <ChairGlyph />
          </button>
          <span className="invite-dock__caption" aria-hidden="true">RSVP</span>
        </div>
      </div>
    </>
  );
}
