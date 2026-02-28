import { useState, useEffect, useRef } from 'react';
import { useWedding } from '../hooks/useWedding';
import { gsap } from 'gsap';

export default function HeroSection() {
  const { data } = useWedding();
  const [current, setCurrent] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const total = data.heroSlides.length;

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => setCurrent(p => (p + 1) % total), 5500);
    return () => clearInterval(id);
  }, [total]);

  // Subtle parallax on scroll
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      gsap.set(el, { y: y * 0.25 });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current.querySelectorAll('.hero-anim'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: 'power3.out', delay: 0.3 }
    );
  }, []);

  return (
    <section id="hero" className="hero-section" aria-label="Hero">
      {/* Slides */}
      {data.heroSlides.map((src, i) => (
        <div
          key={i}
          className={`hero-bg-slide ${i === current ? 'active' : 'inactive'}`}
          style={{ backgroundImage: `url(${src})` }}
          aria-hidden="true"
        />
      ))}

      {/* Overlay gradient */}
      <div className="hero-gradient" aria-hidden="true" />

      {/* Content */}
      <div className="hero-content" ref={contentRef}>
        <div className="hero-eyebrow hero-anim">Wedding Invitation</div>

        <div className="hero-script hero-anim">Save the Date</div>

        <h1 className="hero-names hero-anim">
          <span>{data.groom.shortName}</span>
          <span className="hero-names-sep">&amp;</span>
          <span>{data.bride.shortName}</span>
        </h1>

        {/* Thin ornament line */}
        <div className="hero-anim flex items-center gap-3 mb-3">
          <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.4)' }} />
          <span className="heart-icon" style={{ width: 18, height: 18 }} aria-hidden="true" />
          <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.4)' }} />
        </div>

        <p className="hero-date hero-anim">{data.weddingDateDisplay}</p>

        <div className="hero-cta hero-anim">
          <a href="/rsvp" className="btn-light" style={{ background: 'rgba(212,136,122,0.75)', borderColor: 'var(--primary)' }}>
            Xác nhận tham dự
          </a>
        </div>

        {/* Slide dots */}
        <div className="hero-dots hero-anim" role="tablist" aria-label="Slideshow indicators">
          {data.heroSlides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              className={`hero-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <span>Kéo xuống</span>
        <div className="hero-scroll-bar" />
      </div>
    </section>
  );
}
