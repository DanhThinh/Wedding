import { inviteData } from '../../data/inviteData';

/** "địa chỉ tổ chức" → tên trung tâm tiệc cưới + bản đồ Google nhúng. */
export default function InviteVenue() {
  const { venue, mapQuery } = inviteData;
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&hl=vi&z=15&output=embed`;
  const openSrc = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <section className="invite-venue" id="venue">
      <p className="invite-venue__eyebrow" data-reveal="fade">{venue.eyebrow}</p>
      <p className="invite-venue__kicker" data-reveal="up">{venue.kicker}</p>
      <h2 className="invite-venue__name script-title is-gold" data-reveal="up">{venue.name}</h2>

      <div className="invite-venue__map" data-reveal="scale">
        <iframe
          title={`Bản đồ tới ${venue.name}`}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <a className="invite-venue__link" href={openSrc} target="_blank" rel="noreferrer" data-reveal="up">
        {venue.address}
      </a>
    </section>
  );
}
