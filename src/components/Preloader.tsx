import { useEffect, useRef, useState } from 'react';
import { useWedding } from '../hooks/weddingContext';
import gsap from 'gsap';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const { data } = useWedding();
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Exit animation
          const exitTl = gsap.timeline({
            onComplete: () => setHidden(true),
          });
          exitTl
            .to(progressRef.current, { opacity: 0, y: 10, duration: 0.3 })
            .to(heartRef.current, {
              scale: 1.3,
              opacity: 0,
              duration: 0.5,
              ease: 'back.in(2)',
            }, '-=0.1')
            .to(titleRef.current, { opacity: 0, y: -15, duration: 0.3 }, '-=0.3')
            .to(ringsRef.current, { opacity: 0, scale: 1.5, duration: 0.4 }, '-=0.4')
            .to(containerRef.current, {
              opacity: 0,
              scale: 1.05,
              duration: 0.5,
              ease: 'power2.in',
            }, '-=0.2');
        },
      });

      // Entrance
      gsap.set([heartRef.current, titleRef.current, progressRef.current], { opacity: 0 });
      gsap.set(heartRef.current, { scale: 0.5 });
      gsap.set(ringsRef.current, { opacity: 0, scale: 0.6 });

      tl.to(heartRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)',
      })
      .to(ringsRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4')
      .to(titleRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
      .to(progressRef.current, {
        opacity: 1,
        duration: 0.4,
      }, '-=0.2')
      // Hold for a moment
      .to({}, { duration: 1.2 });
    });

    return () => ctx.revert();
  }, []);

  if (hidden) return null;

  return (
    <div ref={containerRef} className="preloader">
      {/* Animated rings */}
      <div ref={ringsRef} className="preloader-rings" aria-hidden="true">
        <div className="preloader-ring ring-1" />
        <div className="preloader-ring ring-2" />
        <div className="preloader-ring ring-3" />
      </div>

      <div ref={heartRef} className="loading-heart">
        <svg viewBox="0 0 512 512" width="80" height="80">
          <path
            d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
          />
        </svg>
      </div>

      <div ref={titleRef} className="preloader-title">
        <span className="preloader-initial">{data.groom.initial}</span>
        <span className="preloader-amp">&amp;</span>
        <span className="preloader-initial">{data.bride.initial}</span>
      </div>

      <div ref={progressRef} className="preloader-progress">
        <div className="preloader-progress-bar" />
      </div>
    </div>
  );
}
