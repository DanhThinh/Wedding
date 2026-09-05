import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWedding } from '../hooks/weddingContext';
import { gsap } from 'gsap';
import { getWeddingPhase } from '../lib/weddingState';
import { trackEvent } from '../lib/analytics';
import { prefersReducedMotion } from '../lib/reveal';

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

    const reduceMotion = prefersReducedMotion();

    if (outgoing) {
      gsap.killTweensOf(outgoing);
      if (reduceMotion) {
        gsap.set(outgoing, { opacity: 0, scale: 1 });
      } else {
        gsap.to(outgoing, { opacity: 0, scale: 1, duration: 1.2, ease: 'power2.inOut' });
      }
    }
    if (incoming) {
      gsap.killTweensOf(incoming);
      if (reduceMotion) {
        gsap.set(incoming, { opacity: 1, scale: 1 });
      } else {
        gsap.fromTo(
          incoming,
          { opacity: 0, scale: 1.02 },
          { opacity: 1, scale: 1.15, duration: 6, ease: 'none' },
        );
      }
    }
    setCurrent(next);
  }, [current]);

  // Auto-advance with crossfade
  useEffect(() => {
    if (total <= 1 || prefersReducedMotion()) return;
    const id = setInterval(() => {
      selectSlide((current + 1) % total);
    }, 5500);
    return () => clearInterval(id);
  }, [current, selectSlide, total]);

  // Initial Ken Burns on first slide
  useEffect(() => {
    if (slidesRef.current[0]) {
      const firstSlide = slidesRef.current[0];
      gsap.set(firstSlide, { opacity: 1, scale: prefersReducedMotion() ? 1 : 1.02 });
      if (prefersReducedMotion()) return;
      const tween = gsap.to(firstSlide, { scale: 1.12, duration: 6, ease: 'none' });
      return () => {
        tween?.kill();
      };
    }
  }, []);

  // Màn chào: tên cô dâu chú rể dựng lên từng chữ, phần còn lại theo sau.
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const reducedMotion = prefersReducedMotion();
    if (reducedMotion) {
      gsap.set(root.querySelectorAll('.hero-anim, .hero-names-part'), {
        opacity: 1, y: 0, rotateX: 0, filter: 'none',
      });
      return;
    }

    const timeline = gsap.timeline({ delay: 0.35 });

    timeline
      .fromTo(
        root.querySelectorAll('.hero-anim'),
        { opacity: 0, y: 40, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.16, ease: 'power3.out' },
      )
      // Tên lật dựng lên quanh trục ngang — điểm nhấn chính của màn mở đầu.
      .fromTo(
        root.querySelectorAll('.hero-names-part'),
        { opacity: 0, yPercent: 110, rotateX: -55 },
        {
          opacity: 1, yPercent: 0, rotateX: 0,
          duration: 1.4, stagger: 0.13, ease: 'expo.out',
        },
        0.5,
      );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <section id="hero" className="hero-section" aria-label="Hero" tabIndex={-1}>
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

        {/* Mỗi phần tên nằm trong một "khe" riêng để lật dựng lên từ sau mặt nạ. */}
        <h1 className="hero-names">
          <span className="hero-names-slot">
            <span className="hero-names-part">{data.groom.shortName}</span>
          </span>
          <span className="hero-names-slot hero-names-sep">
            <span className="hero-names-part">&amp;</span>
          </span>
          <span className="hero-names-slot">
            <span className="hero-names-part">{data.bride.shortName}</span>
          </span>
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
            <a
              href="#album"
              className="btn-light hero-cta-btn"
              onClick={() => {
                void trackEvent('hero_cta_click', {
                  target: 'album',
                  phase,
                });
              }}
            >
              Xem album kỷ niệm
            </a>
          ) : (
            <Link
              to="/rsvp"
              className="btn-light hero-cta-btn"
              onClick={() => {
                void trackEvent('hero_cta_click', {
                  target: 'rsvp',
                  phase,
                });
              }}
            >
              Xác nhận tham dự
            </Link>
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
              onClick={() => {
                void trackEvent('hero_slide_select', {
                  slide_index: i + 1,
                  slide_total: total,
                });
                selectSlide(i);
              }}
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
