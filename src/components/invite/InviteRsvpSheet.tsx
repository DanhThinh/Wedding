import { useEffect, useId, useRef } from 'react';
import { inviteData } from '../../data/inviteData';
import RsvpForm from '../RsvpForm';

interface InviteRsvpSheetProps { open: boolean; onClose: () => void; }

export default function InviteRsvpSheet({ open, onClose }: InviteRsvpSheetProps) {
  const { rsvp } = inviteData;
  const sheetRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const panel = sheetRef.current;
    if (!panel) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panel.focus();
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
      if (event.key === 'Escape') { event.preventDefault(); onCloseRef.current(); return; }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )).filter(element => !element.matches(':disabled') && !element.closest('[inert]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!first || !last) { event.preventDefault(); panel.focus(); }
      else if (!panel.contains(active) || active === panel) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      else if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      background.forEach((inert, element) => {
        if (inert === null) element.removeAttribute('inert'); else element.setAttribute('inert', inert);
      });
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [open]);

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
