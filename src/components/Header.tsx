import { useState, useEffect } from 'react';
import { useWedding } from '../hooks/useWedding';

const navLinks = [
  { label: 'Cặp Đôi', href: '#couple' },
  { label: 'Chuyện Tình', href: '#story' },
  { label: 'Đếm Ngược', href: '#countdown' },
  { label: 'Album', href: '#album' },
  { label: 'Sự Kiện', href: '#events' },
  { label: 'Lưu Bút', href: '#guestbook' },
  { label: 'Mừng Cưới', href: '#giftbox' },
];

export default function Header() {
  const { data } = useWedding();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : 'transparent'}`}>
      <div className="container-custom h-full grid items-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

        {/* Logo – left */}
        <a href="/" aria-label="Home" className="flex-shrink-0 justify-self-start">
          <div className="header-logo-pill">
            <span className="header-monogram">{data.groom.initial}{data.bride.initial}</span>
          </div>
        </a>

        {/* Center name – middle column */}
        <a
          href="#hero"
          onClick={e => { e.preventDefault(); handleNavClick('#hero'); }}
          className="header-center-name hidden sm:block justify-self-center px-4 text-center whitespace-nowrap"
        >
          {data.groom.shortName} &amp; {data.bride.shortName}
        </a>

        {/* Desktop nav – right */}
        <nav className="hidden lg:flex items-center gap-0.5 justify-self-end" aria-label="Main navigation">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
          <a href="/rsvp" className="nav-rsvp-btn ml-3">Xác nhận</a>
        </nav>

        {/* Mobile hamburger – right column on mobile */}
        <button
          className={`lg:hidden mobile-menu-btn justify-self-end ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
        >
          <span className="mobile-menu-line" />
          <span className="mobile-menu-line" />
          <span className="mobile-menu-line" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className="mobile-menu-drawer lg:hidden"
        style={{ maxHeight: menuOpen ? '500px' : '0', opacity: menuOpen ? 1 : 0 }}
      >
        <div className="container-custom py-3 flex flex-col gap-0.5">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
              className="mobile-nav-link"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/rsvp"
            className="mt-2 mx-2 mb-2 py-3 bg-primary text-white text-center text-sm font-semibold rounded-full hover:bg-primary-dark transition-all"
            style={{ color: 'white', background: 'var(--primary)' }}
          >
            Xác nhận tham dự ✦
          </a>
        </div>
      </div>
    </header>
  );
}
