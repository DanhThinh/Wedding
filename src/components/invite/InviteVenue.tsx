import { useId } from 'react';
import InviteTimeline from './InviteTimeline';
import { inviteData } from '../../data/inviteData';
import { getVenueMapQuery, hasMappableAddress } from '../../lib/venue';

/** Ba địa điểm dùng chung dữ liệu RSVP, với liên kết chỉ đường riêng. */
export default function InviteVenue() {
  const { venue } = inviteData;
  const sectionId = useId();

  return (
    <section className="invite-venue" id="venue" aria-labelledby={`${sectionId}-title`}>
      <h2 id={`${sectionId}-title`} className="script-title is-gold" data-reveal="up">{venue.title}</h2>
      <p className="invite-venue__note" data-reveal="fade">Thời gian theo giờ Việt Nam</p>

      <div className="invite-venue__list">
        {venue.events.map(event => {
          const canShowDirections = hasMappableAddress(event.address);
          const cardId = `${sectionId}-event-${event.id}`;
          const mapQuery = getVenueMapQuery(event);
          const directionsSrc = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
          // date là ngày tại VN (YYYY-MM-DD), không chuyển qua múi giờ thiết bị.
          const displayDate = event.date.split('-').reverse().join('/');

          return (
            <article key={event.id} className="invite-venue__card" aria-labelledby={`${cardId}-title`} data-reveal="up">
              <h3 id={`${cardId}-title`} className="invite-venue__name">{event.name}</h3>
              <time className="invite-venue__date" dateTime={`${event.date}T${event.time}:00+07:00`}>
                {event.timeDisplay} · {displayDate}
              </time>
              <p className="invite-venue__location">{event.location}</p>
              <p className="invite-venue__address">{canShowDirections ? event.address : 'Địa chỉ sẽ cập nhật'}</p>

              {canShowDirections && (
                <div className="invite-venue__actions">
                  <a
                    className="invite-venue__action invite-venue__action--primary"
                    href={directionsSrc}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Chỉ đường đến ${event.name}`}
                  >
                    Chỉ đường
                  </a>
                </div>
              )}
              <InviteTimeline event={event} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
