import { useWedding } from '../hooks/useWedding';

const sections = [
  { label: 'Cặp Đôi', href: '#couple' },
  { label: 'Chuyện Tình', href: '#story' },
  { label: 'Đếm Ngược', href: '#countdown' },
  { label: 'Album', href: '#album' },
  { label: 'Sự Kiện', href: '#events' },
  { label: 'Sổ Lưu Bút', href: '#guestbook' },
  { label: 'Mừng Cưới', href: '#giftbox' },
];

export default function Footer() {
  const { data } = useWedding();

  const scroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container-custom">

        {/* Main footer content */}
        <div className="text-center mb-10">
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
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-8" aria-label="Footer navigation">
          {sections.map(s => (
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
        <div style={{ height: 1, background: 'var(--border)', margin: '0 0 1.5rem' }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="footer-credit">
            Được tạo với{' '}
            <span style={{ color: 'var(--primary)' }}>♥</span>{' '}
            cho ngày trọng đại của{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {data.groom.shortName} &amp; {data.bride.shortName}
            </span>
          </p>
          <a
            href="/rsvp"
            className="footer-credit px-5 py-2 rounded-full font-semibold"
            style={{ background: 'var(--primary)', color: 'white', textDecoration: 'none' }}
          >
            Xác nhận tham dự ✦
          </a>
        </div>
      </div>
    </footer>
  );
}
