import { inviteData } from '../../data/inviteData';
import { setImageFallback } from '../../lib/imageFallback';

/** Màn "Save The Date": ảnh cưới toàn khung, tên và ngày viết tay bên dưới. */
export default function InviteHero() {
  const { hero } = inviteData;

  return (
    <section className="invite-hero" id="hero">
      <div className="invite-hero__frame" data-reveal="scale">
        <p className="invite-hero__script">{hero.script}</p>

        <div className="invite-hero__photo-wrap">
          <img
            src={hero.image}
            alt={`Ảnh cưới ${hero.names}`}
            className="invite-hero__photo"
            fetchPriority="high"
            onError={event => setImageFallback(event.currentTarget)}
          />
          <span className="invite-hero__studio">{hero.studio}</span>
        </div>

        <div className="invite-hero__caption">
          <h1 className="invite-hero__names">{hero.names}</h1>
          <div className="invite-hero__divider" aria-hidden="true" />
          <p className="invite-hero__date">{hero.dateDisplay}</p>
        </div>
      </div>
    </section>
  );
}
