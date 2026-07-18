import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWedding } from '../hooks/weddingContext';
import { gsap } from 'gsap';
import { getWeddingPhase } from '../lib/weddingState';

export default function HeroSection() {
  const { data } = useWedding();
  const [current, setCurrent] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLImageElement | null)[]>([]);
  const total = data.heroSlides.length;
  const phase = getWeddingPhase(data.weddingDate);

  const selectSlide = useCallback((next: number) => {
    if (next === current) return;
    const outgoing = slidesRef.current[current];
    const incoming = slidesRef.current[next];

    if (outgoing) {
      gsap.killTweensOf(outgoing);
      gsap.to(outgoing, { opacity: 0, scale: 1, duration: 1.2, ease: 'power2.inOut' });
    }
    if (incoming) {
      gsap.killTweensOf(incoming);
      gsap.fromTo(
        incoming,
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1.15, duration: 6, ease: 'none' },
      );
    }
    setCurrent(next);
  }, [current]);

  // Auto-advance with crossfade
  useEffect(() => {
    const id = setInterval(() => {
      selectSlide((current + 1) % total);
    }, 5500);
    return () => clearInterval(id);
  }, [current, selectSlide, total]);

  // Initial Ken Burns on first slide
  useEffect(() => {
    if (slidesRef.current[0]) {
      gsap.set(slidesRef.current[0], { opacity: 1, scale: 1.02 });
      gsap.to(slidesRef.current[0], { scale: 1.12, duration: 6, ease: 'none' });
    }
  }, []);

  // Entrance animation - staggered with more personality
  useEffect(() => {
    if (!contentRef.current) return;
    const elements = contentRef.current.querySelectorAll('.hero-anim');
    gsap.fromTo(
      elements,
      { opacity: 0, y: 40, filter: 'blur(4px)' },
      { 
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1.2, stagger: 0.2, 
        ease: 'power3.out', delay: 0.4 
      }
    );
  }, []);

  return (
    <section id="hero" className="hero-section" aria-label="Hero">
      {/* Slides */}
      {data.heroSlides.map((src, i) => (
        <img
          key={i}
          ref={el => { slidesRef.current[i] = el; }}
          className={`hero-bg-slide ${i === current ? 'active' : 'inactive'}`}
          src={src}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          fetchPriority={i === 0 ? 'high' : 'auto'}
          decoding={i === 0 ? 'sync' : 'async'}
          aria-hidden="true"
        />
      ))}

      {/* Overlay gradient */}
      <div className="hero-gradient" aria-hidden="true" />

      {/* Vignette */}
      <div className="hero-vignette" aria-hidden="true" />

      {/* Content */}
      <div className="hero-content" ref={contentRef}>
        <div className="hero-eyebrow hero-anim">
          {phase === 'after' ? 'Wedding Memories' : 'Wedding Invitation'}
        </div>

        <div className="hero-script hero-anim">
          {phase === 'after' ? 'Our Story Continues' : 'Save the Date'}
        </div>

        <h1 className="hero-names hero-anim">
          <span>{data.groom.shortName}</span>
          <span className="hero-names-sep">&amp;</span>
          <span>{data.bride.shortName}</span>
        </h1>

        {/* Thin ornament line */}
        <div className="hero-anim flex items-center gap-3 mb-3">
          <div className="hero-line-left" />
          <span className="heart-icon" style={{ width: 18, height: 18 }} aria-hidden="true" />
          <div className="hero-line-right" />
        </div>

        <p className="hero-date hero-anim">{data.weddingDateDisplay}</p>

        <div className="hero-cta hero-anim">
          {phase === 'after' ? (
            <a href="#album" className="btn-light hero-cta-btn">Xem album kỷ niệm</a>
          ) : (
            <Link to="/rsvp" className="btn-light hero-cta-btn">Xác nhận tham dự</Link>
          )}
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
              onClick={() => selectSlide(i)}
            />
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <div className="hero-scroll-bar" />
      </div>
    </section>
  );
}
