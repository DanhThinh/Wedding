import { Link } from 'react-router-dom';
import { useWedding } from '../hooks/weddingContext';
import { getWeddingPhase, hasGiftDetails } from '../lib/weddingState';

const sections = [
  { label: 'Câu chuyện', href: '#story' },
  { label: 'Album', href: '#album' },
  { label: 'Sự kiện', href: '#events' },
  { label: 'Lời chúc', href: '#guestbook' },
];

export default function Footer() {
  const { data } = useWedding();
  const phase = getWeddingPhase(data.weddingDate);
  const visibleSections = hasGiftDetails(data)
    ? [...sections, { label: 'Mừng cưới', href: '#giftbox' }]
    : sections;

  const scroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container-custom">

        {/* Main footer content */}
        <div className="text-center mb-10" data-reveal="up">
          {/* Ornament */}
          <div className="ornament" aria-hidden="true">
            <span className="ornament-icon" />
          </div>

          {/* Names */}
          <div className="footer-names">
            {data.groom.shortName}
            <span style={{ margin: '0 0.75rem', color: 'var(--primary)', fontStyle: 'normal' }}>&amp;</span>
            {data.bride.shortName}
          </div>

          <p className="footer-date">{data.weddingDateDisplay}</p>
        </div>

        {/* Nav links */}
        <nav
          className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-8"
          data-reveal="up"
          aria-label="Footer navigation"
        >
          {visibleSections.map(s => (
            <a
              key={s.href}
              href={s.href}
              onClick={e => scroll(e, s.href)}
              className="footer-nav-link"
            >
              {s.label}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <hr className="section-rule" style={{ margin: '0 auto 1.5rem' }} data-reveal="fade" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3" data-reveal="up">
          <p className="footer-credit">
            Được tạo với{' '}
            <span style={{ color: 'var(--primary)' }}>♥</span>{' '}
            cho ngày trọng đại của{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {data.groom.shortName} &amp; {data.bride.shortName}
            </span>
          </p>
          {phase !== 'after' && <Link
            to="/rsvp"
            className="footer-credit px-5 py-2 rounded-full font-semibold footer-rsvp-btn"
            style={{ background: 'var(--primary)', color: 'white', textDecoration: 'none' }}
          >
            Xác nhận tham dự ✦
          </Link>}
        </div>
      </div>
    </footer>
  );
}
