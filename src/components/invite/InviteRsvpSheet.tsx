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
  const { showToast, guest } = useWedding();
  const sheetRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const fieldId = useId().replace(/:/g, '');

  const [attending, setAttending] = useState<boolean | null>(null);
  // Link cá nhân hoá đã biết tên khách — điền sẵn, khách vẫn sửa được.
  const [name, setName] = useState(guest?.name ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const panel = sheetRef.current;
    if (!panel) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panel.focus();

    // Disable the background without making an ancestor of the dialog inert.
    const background = new Map<Element, string | null>();
    let branch = panel.parentElement;
    while (branch && branch !== document.body) {
      for (const sibling of branch.parentElement?.children ?? []) {
        if (sibling === branch) continue;
        background.set(sibling, sibling.getAttribute('inert'));
        sibling.setAttribute('inert', '');
      }
      branch = branch.parentElement;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!first || !last) {
        event.preventDefault();
        panel.focus();
      } else if (!panel.contains(active) || active === panel) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      background.forEach((inert, element) => {
        if (inert === null) element.removeAttribute('inert');
        else element.setAttribute('inert', inert);
      });
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
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
    try {
      const mode = await saveAttendance({ name, attending, message });
      void trackEvent('rsvp_submit', { mode, attending: String(attending) });
      showToast(
        mode === 'firestore' ? 'Cảm ơn bạn đã xác nhận!' : 'Đã lưu xác nhận trên thiết bị này.',
        mode === 'firestore' ? 'success' : 'info',
      );

      setAttending(null);
      setName(guest?.name ?? '');
      setMessage('');
      onClose();
    } catch {
      setError('Không thể lưu xác nhận. Thông tin của bạn vẫn được giữ lại, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
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
