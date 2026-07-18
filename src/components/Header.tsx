import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWedding } from '../hooks/weddingContext';
import { getWeddingPhase, hasGiftDetails } from '../lib/weddingState';

const navLinks = [
  { label: 'Câu chuyện', href: '#story' },
  { label: 'Album', href: '#album' },
  { label: 'Sự kiện', href: '#events' },
  { label: 'Lời chúc', href: '#guestbook' },
];

export default function Header() {
  const { data } = useWedding();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const phase = getWeddingPhase(data.weddingDate);
  const showRsvp = phase !== 'after';
  const showGift = hasGiftDetails(data);
  const visibleLinks = showGift
    ? [...navLinks, { label: 'Mừng cưới', href: '#giftbox' }]
    : navLinks;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Scroll progress
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);

      // Update active section
      const sections = navLinks.map(link => link.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : 'transparent'}`}>
      {/* Progress bar */}
      <div className="header-progress-bar" style={{
        transform: `scaleX(${scrollProgress})`,
      }} />
      
      <div className="container-custom h-full grid items-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

        {/* Logo – left */}
        <Link to="/" aria-label="Home" className="flex-shrink-0 justify-self-start">
          <div className="header-logo-pill">
            <span className="header-monogram">{data.groom.initial}{data.bride.initial}</span>
            {/* Decorative ring */}
            <div className="header-logo-ring" />
          </div>
        </Link>

        {/* Center name – middle column */}
        <a
          href="#hero"
          onClick={e => { e.preventDefault(); handleNavClick('#hero'); }}
          className="header-center-name hidden sm:block justify-self-center px-4 text-center whitespace-nowrap"
        >
          {data.groom.shortName} <span className="header-amp">&amp;</span> {data.bride.shortName}
        </a>

        {/* Desktop nav – right */}
        <nav className="hidden lg:flex items-center gap-0.5 justify-self-end" aria-label="Main navigation">
          {visibleLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
              className={`nav-link ${activeSection === link.href.substring(1) ? 'active' : ''}`}
            >
              {link.label}
              {activeSection === link.href.substring(1) && (
                <span className="nav-link-indicator" />
              )}
            </a>
          ))}
          {showRsvp && <Link to="/rsvp" className="nav-rsvp-btn ml-3">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Xác nhận
          </Link>}
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
          {visibleLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
              className={`mobile-nav-link ${activeSection === link.href.substring(1) ? 'active' : ''}`}
            >
              <span className="mobile-nav-dot" />
              {link.label}
            </a>
          ))}
          {showRsvp && <Link
            to="/rsvp"
            className="mobile-rsvp-btn"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Xác nhận tham dự ✦
          </Link>}
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      {menuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
