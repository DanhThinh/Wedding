import { useEffect, useId, useRef, useState } from 'react';
import { inviteData } from '../../data/inviteData';
import { useWedding } from '../../hooks/weddingContext';
import { saveAttendance, validateAttendance } from '../../lib/rsvp';
import { trackEvent } from '../../lib/analytics';
import { ChairGlyph } from './art';

interface InviteRsvpSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Bảng xác nhận tham dự trượt lên toàn màn hình, đúng như bước cuối của demo:
 * hai thẻ lựa chọn có nút radio, ô "Họ tên" gạch chân và ô lời nhắn.
 */
export default function InviteRsvpSheet({ open, onClose }: InviteRsvpSheetProps) {
  const { rsvp } = inviteData;
  const { showToast } = useWedding();
  const sheetRef = useRef<HTMLDivElement>(null);
  const fieldId = useId().replace(/:/g, '');

  const [attending, setAttending] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (attending === null) {
      setError('Vui lòng chọn một lựa chọn tham dự');
      return;
    }

    const errors = validateAttendance({ name, attending, message });
    if (errors.name) {
      setError(errors.name);
      return;
    }

    setError('');
    setIsSubmitting(true);
    const mode = await saveAttendance({ name, attending, message });
    setIsSubmitting(false);

    void trackEvent('rsvp_submit', { mode, attending: String(attending) });
    showToast(
      mode === 'firestore' ? 'Cảm ơn bạn đã xác nhận!' : 'Đã lưu xác nhận trên thiết bị này.',
      mode === 'firestore' ? 'success' : 'info',
    );

    setAttending(null);
    setName('');
    setMessage('');
    onClose();
  };

  return (
    <div className="invite-sheet" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div
        ref={sheetRef}
        className="invite-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`rsvp-title-${fieldId}`}
        tabIndex={-1}
      >
        <button type="button" className="invite-sheet__close" onClick={onClose} aria-label="Đóng">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2 id={`rsvp-title-${fieldId}`} className="invite-sheet__title">{rsvp.title}</h2>
        <p className="invite-sheet__desc">{rsvp.description}</p>

        <form onSubmit={handleSubmit}>
          <div className="invite-sheet__choices" role="radiogroup" aria-label="Bạn có tham dự được không?">
            {[
              { value: true, label: 'Tham dự được', crossed: false },
              { value: false, label: 'Không thể tham dự', crossed: true },
            ].map(choice => (
              <button
                type="button"
                key={String(choice.value)}
                role="radio"
                aria-checked={attending === choice.value}
                className={`invite-choice ${attending === choice.value ? 'is-active' : ''}`}
                onClick={() => { setAttending(choice.value); setError(''); }}
              >
                <span className="invite-choice__icon"><ChairGlyph crossed={choice.crossed} /></span>
                <span className="invite-choice__label">{choice.label}</span>
                <span className="invite-choice__radio" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="invite-field">
            <label className="invite-field__label" htmlFor={`rsvp-name-${fieldId}`}>Họ tên</label>
            <input
              id={`rsvp-name-${fieldId}`}
              className="invite-field__input"
              type="text"
              value={name}
              onChange={event => { setName(event.target.value); setError(''); }}
              placeholder="Nhập họ tên"
              autoComplete="name"
              maxLength={100}
            />
          </div>

          <div className="invite-field">
            <label className="sr-only" htmlFor={`rsvp-message-${fieldId}`}>Lời nhắn</label>
            <textarea
              id={`rsvp-message-${fieldId}`}
              className="invite-field__textarea"
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Gửi đến cô dâu chú rể"
              maxLength={500}
              rows={4}
            />
          </div>

          {error && <p className="invite-sheet__error" role="alert">{error}</p>}

          <button type="submit" className="invite-btn invite-sheet__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : rsvp.cta}
          </button>
        </form>
      </div>
    </div>
  );
}
