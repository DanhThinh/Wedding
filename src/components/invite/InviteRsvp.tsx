import { inviteData } from '../../data/inviteData';
import { ChairGlyph } from './art';

interface InviteRsvpProps {
  onOpen: () => void;
}

/** Khối R.S.V.P nền trắng, nút vàng "Gửi thông tin" mở bảng xác nhận. */
export default function InviteRsvp({ onOpen }: InviteRsvpProps) {
  const { rsvp } = inviteData;

  return (
    <section className="invite-rsvp" id="rsvp">
      <p className="invite-rsvp__eyebrow" data-reveal="fade">{rsvp.eyebrow}</p>
      <h2 className="invite-rsvp__title" data-reveal="up">{rsvp.title}</h2>
      <p className="invite-rsvp__desc" data-reveal="up">{rsvp.description}</p>

      <button type="button" className="invite-btn" onClick={onOpen} data-reveal="up">
        <ChairGlyph />
        {rsvp.cta}
      </button>
    </section>
  );
}
