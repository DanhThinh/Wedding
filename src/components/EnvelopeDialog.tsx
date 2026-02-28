import { useEffect, useRef, useState } from 'react';
import { useWedding } from '../hooks/useWedding';
import gsap from 'gsap';

interface EnvelopeDialogProps {
  onOpen: () => void;
}

export default function EnvelopeDialog({ onOpen }: EnvelopeDialogProps) {
  const [isHidden, setIsHidden] = useState(false);
  const { data } = useWedding();
  
  // Refs for GSAP
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      
      // Initial states
      gsap.set([subtitleRef.current, titleRef.current, hintRef.current], { 
        opacity: 0, 
        y: 30 
      });
      gsap.set(envelopeRef.current, { 
        opacity: 0, 
        scale: 0.85, 
        y: 40 
      });
      gsap.set(infoRef.current, { 
        opacity: 0, 
        y: 20 
      });
      
      // Staggered text reveal
      tl.to(subtitleRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8 
      })
      .to(titleRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: 'power3.out'
      }, '-=0.4')
      .to(hintRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.6 
      }, '-=0.5')
      // Envelope entrance with dramatic scale
      .to(envelopeRef.current, { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 1.2,
        ease: 'power3.out'
      }, '-=0.3')
      // Info section
      .to(infoRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8 
      }, '-=0.6');

      // Wax seal subtle pulse (idle state)
      gsap.to(sealRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Hint text gentle float
      gsap.to(hintRef.current, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5
      });
    });

    return () => ctx.revert();
  }, []);

  const handleClick = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    // Boost card z-index when opening
    if (cardRef.current) {
      cardRef.current.style.zIndex = '20';
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        setIsHidden(true);
        onOpen();
      }
    });

    // Phase 1: Seal crack effect
    tl.to(sealRef.current, {
      scale: 1.3,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    })
    // Phase 2: Flap opens with 3D rotation
    .to(flapRef.current, {
      rotateX: 180,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    })
    // Phase 2.5: Move envelope down slightly
    .to(envelopeRef.current, {
      y: 50,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')
    // Phase 3: Card rises elegantly
    .to(cardRef.current, {
      y: -180,
      duration: 1.2,
      ease: 'power2.out'
    }, '-=0.8')
    // Pause for emotional moment
    .to({}, { duration: 0.5 })
    // Phase 4: Exit - everything fades with blur
    .to(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
      duration: 0.6,
      ease: 'power2.in'
    });
  };

  if (isHidden) return null;

  return (
    <div ref={overlayRef} className="envelope-overlay">
      <div ref={containerRef} className="envelope-container">
        <p ref={subtitleRef} className="envelope-subtitle">
          YOU ARE &nbsp; THE LOVE OF &nbsp; MY LIFE
        </p>
        <h1 ref={titleRef} className="envelope-title">Wedding Invitation</h1>
        <p ref={hintRef} className="envelope-hint">Chạm để mở thiệp</p>

        <div 
          ref={envelopeRef}
          className="envelope"
          onClick={handleClick}
        >
          {/* Card inside envelope */}
          <div ref={cardRef} className="envelope-card">
            <div className="card-inner">
              <div className="card-border">
                <p className="card-names">
                  {data.groom.shortName} <span className="heart">♥</span> {data.bride.shortName}
                </p>
                <div className="card-divider"></div>
                <p className="card-subtitle">TRÂN TRỌNG KÍNH MỜI</p>
              </div>
            </div>
          </div>

          {/* Envelope structure */}
          <div className="envelope-wrapper">
            <div ref={flapRef} className="envelope-flap-top"></div>
            <div className="envelope-fold-left"></div>
            <div className="envelope-fold-right"></div>
            <div className="envelope-fold-bottom">
              <div className="envelope-heart-small">♥</div>
            </div>
          </div>

          {/* Wax seal with glow */}
          <div ref={sealRef} className="wax-seal">
            <div className="seal-inner">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        </div>

        <div ref={infoRef} className="envelope-info">
          <p className="info-text">TRÂN TRỌNG KÍNH MỜI</p>
          <p className="info-subtext">ĐẾN THAM DỰ HÔN LỄ CỦA CHÚNG TÔI</p>
          
          <div className="wedding-datetime">
            <div className="datetime-block">
              <span className="datetime-value">
                {data.weddingDate.getHours()}:{data.weddingDate.getMinutes().toString().padStart(2, '0')}
              </span>
              <span className="datetime-label">GIỜ</span>
            </div>
            <div className="datetime-divider"></div>
            <div className="datetime-block">
              <span className="datetime-value">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][data.weddingDate.getDay()]}
              </span>
              <span className="datetime-label">THỨ</span>
            </div>
            <div className="datetime-divider"></div>
            <div className="datetime-block">
              <span className="datetime-value">
                {data.weddingDate.getDate()}/{(data.weddingDate.getMonth() + 1)}/{data.weddingDate.getFullYear()}
              </span>
              <span className="datetime-label">NGÀY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative particles */}
      <div className="envelope-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="particle" style={{ '--delay': `${i * 0.5}s` } as React.CSSProperties}></div>
        ))}
      </div>
    </div>
  );
}
