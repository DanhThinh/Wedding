import { Link } from 'react-router-dom';
import { useWedding } from '../hooks/weddingContext';
import { setImageFallback } from '../lib/imageFallback';
import RsvpForm from '../components/RsvpForm';

export default function RSVPPage() {
  const { data } = useWedding();
  return (
    <div className="rsvp-page">
      <header className="rsvp-hero">
        <div className="rsvp-hero-media" aria-hidden="true">
          <img src={data.heroSlides[0]} alt="" onError={event => setImageFallback(event.currentTarget)} />
        </div>
        <div className="rsvp-hero-overlay" aria-hidden="true" />
        <div className="rsvp-hero-content">
          <Link to="/" className="rsvp-back-link">← Về thiệp cưới</Link>
          <p className="rsvp-eyebrow">Wedding RSVP</p>
          <h1 className="rsvp-title">Xác nhận tham dự</h1>
          <p className="rsvp-couple">{data.groom.shortName}<span>&amp;</span>{data.bride.shortName}</p>
          <p className="rsvp-date">{data.weddingDateDisplay}</p>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="rsvp-main">
        <section className="rsvp-card">
          <RsvpForm />
        </section>
      </main>
    </div>
  );
}
