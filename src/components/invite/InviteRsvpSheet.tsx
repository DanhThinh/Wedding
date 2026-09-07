import { useId } from 'react';
import { inviteData } from '../../data/inviteData';
import { useDialogA11y } from '../../hooks/useDialogA11y';
import RsvpForm from '../RsvpForm';

interface InviteRsvpSheetProps { open: boolean; onClose: () => void; }

export default function InviteRsvpSheet({ open, onClose }: InviteRsvpSheetProps) {
  const { rsvp } = inviteData;
  const sheetRef = useDialogA11y(open, onClose);
  const titleId = useId();

  if (!open) return null;
  return (
    <div className="invite-sheet" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={sheetRef} className="invite-sheet__panel" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <button type="button" className="invite-sheet__close" onClick={onClose} aria-label="Đóng">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <h2 id={titleId} className="invite-sheet__title">{rsvp.title}</h2>
        <p className="invite-sheet__desc">{rsvp.description}</p>
        <RsvpForm />
      </div>
    </div>
  );
}
