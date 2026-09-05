import { inviteData } from '../../data/inviteData';
import { setImageFallback } from '../../lib/imageFallback';

/** Màn "Save The Date": ảnh cưới toàn khung, tên và ngày viết tay bên dưới. */
export default function InviteHero() {
  const { hero } = inviteData;

  return (
    <section className="invite-hero" id="hero">
      <p className="invite-hero__script" data-reveal="fade">{hero.script}</p>

      <div className="invite-hero__frame" data-reveal="scale">
        <img
          src={hero.image}
          alt={`Ảnh cưới ${hero.names}`}
          className="invite-hero__photo"
          fetchPriority="high"
          onError={event => setImageFallback(event.currentTarget)}
        />
        <span className="invite-hero__studio">{hero.studio}</span>
      </div>

      <h1 className="invite-hero__names" data-reveal="up">{hero.names}</h1>
      <p className="invite-hero__date" data-reveal="up">{hero.dateDisplay}</p>
    </section>
  );
}
