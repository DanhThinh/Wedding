import { useEffect, useRef, useState } from 'react';
import { useWedding } from '../hooks/weddingContext';
import gsap from 'gsap';
import { getDateParts } from '../lib/date';

interface EnvelopeDialogProps {
  onOpen: () => void;
}

export default function EnvelopeDialog({ onOpen }: EnvelopeDialogProps) {
  const { data } = useWedding();
  const { year, month, day, weekday, hour, minute } = getDateParts(data.weddingDate);
  const [isHidden, setIsHidden] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, {
        xPercent: -50,
        y: 14,
        scale: 0.94,
        opacity: 0,
        visibility: 'hidden',
      });
      gsap.set(flapRef.current, { rotateX: 0, transformOrigin: '50% 0%' });
      gsap.set(sealRef.current, { xPercent: -50, yPercent: -50 });

      if (prefersReducedMotion) {
        gsap.set([copyRef.current, shellRef.current, openButtonRef.current, infoRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.set(copyRef.current, { opacity: 0, y: 22 });
      gsap.set(shellRef.current, { opacity: 0, y: 34, scale: 0.94 });
      gsap.set([openButtonRef.current, infoRef.current], { opacity: 0, y: 16 });

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .to(copyRef.current, { opacity: 1, y: 0, duration: 0.78 })
        .to(shellRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, '-=0.35')
        .to([openButtonRef.current, infoRef.current], { opacity: 1, y: 0, duration: 0.55 }, '-=0.35');

      gsap.to(sealRef.current, {
        scale: 1.055,
        duration: 1.55,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const openEnvelope = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIsOpening(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsHidden(true);
      onOpen();
      return;
    }

    gsap.killTweensOf([
      shellRef.current,
      cardRef.current,
      flapRef.current,
      sealRef.current,
      openButtonRef.current,
      infoRef.current,
      copyRef.current,
      containerRef.current,
      overlayRef.current,
    ]);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        setIsHidden(true);
        onOpen();
      },
    });

    tl
      .to([openButtonRef.current, infoRef.current], {
        opacity: 0,
        y: 10,
        duration: 0.28,
        ease: 'power2.out',
      }, 0)
      .to(shellRef.current, {
        y: 8,
        scale: 1.018,
        duration: 0.36,
        ease: 'power2.out',
      }, 0)
      .to(sealRef.current, {
        xPercent: -50,
        yPercent: -50,
        scale: 0.82,
        rotate: -8,
        duration: 0.12,
        ease: 'power2.in',
      }, 0.06)
      .to(sealRef.current, {
        xPercent: -50,
        yPercent: -50,
        scale: 1.48,
        rotate: 12,
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.34,
        ease: 'power3.out',
      }, 0.18)
      .to(flapRef.current, {
        rotateX: -178,
        y: -3,
        duration: 0.82,
        ease: 'power3.inOut',
      }, 0.22)
      .set(flapRef.current, { zIndex: 1 }, 0.76)
      .set(cardRef.current, {
        visibility: 'visible',
        opacity: 0,
        xPercent: -50,
        y: 14,
        scale: 0.94,
        zIndex: 3,
      }, 0.72)
      .to(cardRef.current, {
        opacity: 1,
        y: 4,
        scale: 0.98,
        duration: 0.52,
        ease: 'power3.out',
      }, 0.78)
      .to(cardRef.current, {
        xPercent: -50,
        y: -136,
        scale: 1.025,
        duration: 0.92,
        ease: 'expo.out',
      }, 1.08)
      .to(shellRef.current, {
        y: 30,
        scale: 0.985,
        duration: 0.78,
        ease: 'power2.inOut',
      }, 1.18)
      .to(copyRef.current, {
        opacity: 0,
        y: -14,
        duration: 0.42,
        ease: 'power2.inOut',
      }, 1.56)
      .to(containerRef.current, {
        opacity: 0,
        scale: 0.985,
        filter: 'blur(8px)',
        duration: 0.74,
        ease: 'power2.inOut',
      }, 2.03)
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.74,
        ease: 'power2.inOut',
      }, 2.03);
  };

  if (isHidden) return null;

  return (
    <div ref={overlayRef} className="envelope-overlay">
      <div ref={containerRef} className="envelope-container">
        <div ref={copyRef} className="envelope-copy">
          <p className="envelope-subtitle">TRÂN TRỌNG KÍNH MỜI</p>
          <h2 className="envelope-title">Thiệp Cưới</h2>
          <p className="envelope-hint">Chạm để mở thiệp</p>
        </div>

        <button
          type="button"
          ref={shellRef}
          className={`envelope-shell ${isOpening ? 'is-opening' : ''}`}
          onClick={openEnvelope}
          aria-label="Mở thiệp cưới"
        >
          <div ref={cardRef} className="letter-card">
            <div className="letter-card-border">
              <p className="letter-card-label">Wedding Invitation</p>
              <p className="letter-card-names">
                <span className="letter-card-person">{data.groom.shortName}</span>
                <span className="letter-card-ampersand">&amp;</span>
                <span className="letter-card-person">{data.bride.shortName}</span>
              </p>
              <div className="letter-card-divider" />
              <p className="letter-card-date">{data.weddingDateDisplay}</p>
            </div>
          </div>

          <div className="envelope-cast-shadow" aria-hidden="true" />
          <div className="envelope-back-panel" aria-hidden="true" />

          <div ref={flapRef} className="envelope-flap-panel" aria-hidden="true">
            <div className="envelope-flap-highlight" />
          </div>

          <div className="envelope-front-pocket" aria-hidden="true">
            <div className="envelope-pocket-left" />
            <div className="envelope-pocket-right" />
            <div className="envelope-pocket-bottom" />
            <div className="envelope-pocket-lip" />
          </div>

          <div ref={sealRef} className="envelope-seal" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </button>

        <button
          type="button"
          ref={openButtonRef}
          className="envelope-open-btn"
          onClick={openEnvelope}
        >
          Mở thiệp
        </button>

        <div ref={infoRef} className="envelope-info">
          <p className="info-text">HÔN LỄ CỦA CHÚNG TÔI</p>
          <div className="wedding-datetime">
            <div className="datetime-block">
              <span className="datetime-value">
                {hour}:{minute.toString().padStart(2, '0')}
              </span>
              <span className="datetime-label">GIỜ</span>
            </div>
            <div className="datetime-divider" />
            <div className="datetime-block">
              <span className="datetime-value">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][weekday]}
              </span>
              <span className="datetime-label">THỨ</span>
            </div>
            <div className="datetime-divider" />
            <div className="datetime-block">
              <span className="datetime-value">
                {day}/{month}/{year}
              </span>
              <span className="datetime-label">NGÀY</span>
            </div>
          </div>
        </div>
      </div>

      <div className="envelope-particles" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="particle" style={{ '--delay': `${i * 0.5}s` } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
