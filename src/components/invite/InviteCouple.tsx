import { inviteData } from '../../data/inviteData';
import { setImageFallback } from '../../lib/imageFallback';
import { Signature } from './art';

/**
 * "Và hôm nay" + hai khối cô dâu / chú rể so le:
 * ảnh cô dâu bên trái – tên bên phải, rồi đảo lại cho chú rể.
 */
export default function InviteCouple() {
  const { today } = inviteData;

  return (
    <section className="invite-couple" id="couple">
      <h2 className="invite-couple__title script-title" data-reveal="up">{today.title}</h2>
      <p className="invite-couple__subtitle" data-reveal="up">{today.subtitle}</p>

      <div className="invite-couple__row is-bride" data-reveal="left">
        <figure className="invite-couple__photo">
          <img
            src={today.bride.image}
            alt={`Cô dâu ${today.bride.name}`}
            loading="lazy"
            decoding="async"
            onError={event => setImageFallback(event.currentTarget)}
          />
        </figure>
        <div className="invite-couple__meta">
          <p className="invite-couple__role">{today.bride.role}</p>
          <p className="invite-couple__name">{today.bride.name}</p>
          <Signature variant="a" className="invite-couple__sign" />
        </div>
      </div>

      <div className="invite-couple__row is-groom" data-reveal="right">
        <div className="invite-couple__meta">
          <p className="invite-couple__role">{today.groom.role}</p>
          <p className="invite-couple__name">{today.groom.name}</p>
          <Signature variant="b" className="invite-couple__sign" />
        </div>
        <figure className="invite-couple__photo">
          <img
            src={today.groom.image}
            alt={`Chú rể ${today.groom.name}`}
            loading="lazy"
            decoding="async"
            onError={event => setImageFallback(event.currentTarget)}
          />
        </figure>
      </div>
    </section>
  );
}
