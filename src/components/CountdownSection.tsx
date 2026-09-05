import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWedding } from '../hooks/weddingContext';
import { useCountdown } from '../hooks/useCountdown';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ConfettiBurst from './ConfettiBurst';
import gsap from 'gsap';
import { getWeddingPhase } from '../lib/weddingState';
import { prefersReducedMotion } from '../lib/reveal';

function FlipNumber({ value, label }: { value: number; label: string }) {
  const numRef = useRef<HTMLDivElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value && numRef.current) {
      if (prefersReducedMotion()) {
        gsap.set(numRef.current, { y: 0, opacity: 1, scale: 1 });
      } else {
        gsap.fromTo(numRef.current,
          { y: -8, opacity: 0.4, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }
        );
      }
    }
    prevValue.current = value;
  }, [value]);

  return (
    <div className="countdown-item">
      <div className="countdown-value" ref={numRef}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="countdown-label">{label}</div>
    </div>
  );
}

export default function CountdownSection() {
  const { data, openModal } = useWedding();
  const countdown = useCountdown(data.weddingDate);
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.25 });

  const now = countdown.now;
  const phase = getWeddingPhase(data.weddingDate, new Date(now));

  // Phân biệt đúng "đã qua" và "hôm nay" để tránh copy sai sau ngày cưới.
  const isExpired = countdown.days === 0 && countdown.hours === 0
    && countdown.minutes === 0 && countdown.seconds === 0;
  const isWeddingDay = phase === 'wedding-day';
  const isPastWeddingDay = phase === 'after';

  // Confetti chỉ bùng nổ 1 lần khi section visible VÀ đã hết countdown
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTriggered = useRef(false);

  useEffect(() => {
    if (isExpired && isWeddingDay && isVisible && !confettiTriggered.current) {
      confettiTriggered.current = true;
      const startTimer = window.setTimeout(() => setShowConfetti(true), 0);
      const stopTimer = window.setTimeout(() => setShowConfetti(false), 3000);
      return () => {
        window.clearTimeout(startTimer);
        window.clearTimeout(stopTimer);
      };
    }
  }, [isExpired, isWeddingDay, isVisible]);

  const units = [
    { value: countdown.days,    label: 'Ngày' },
    { value: countdown.hours,   label: 'Giờ' },
    { value: countdown.minutes, label: 'Phút' },
    { value: countdown.seconds, label: 'Giây' },
  ];

  return (
    <section id="countdown" ref={ref} className="py-24 countdown-bg">
      {/* Confetti bùng nổ khi countdown về 0 */}
      <ConfettiBurst active={showConfetti} particleCount={80} duration={3000} />

      <div className="container-custom text-center relative z-10">

        <div data-reveal="up">
          <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(212,136,122,0.8)', marginBottom: '0.75rem' }}>
            The Big Day
          </p>
          <h2 className="countdown-title">
            {isExpired
              ? isWeddingDay
                ? 'Hôm Nay Là Ngày Cưới!'
                : 'Ngày Vui Đã Diễn Ra'
              : 'Đếm Ngược Đến Ngày Cưới'}
          </h2>
        </div>

        {/* Thông điệp khi countdown đã hết */}
        {isExpired ? (
          <div
            className="countdown-celebration"
            data-reveal="scale"
          >
            <div className="celebration-heart" aria-hidden="true">
              <svg viewBox="0 0 512 512" width="64" height="64" fill="var(--primary)">
                <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/>
              </svg>
            </div>
            <p className="celebration-message">
              Cảm ơn bạn đã đồng hành cùng chúng mình!
            </p>
            <p className="celebration-submessage">
              {isPastWeddingDay
                ? `${data.groom.shortName} & ${data.bride.shortName} đã chính thức về chung một nhà.`
                : `${data.groom.shortName} & ${data.bride.shortName} chính thức về chung một nhà.`}
            </p>
          </div>
        ) : (
          <>
            {/* Timer */}
            <div
              className="flex justify-center items-end gap-2 md:gap-4 mb-10"
              data-reveal="scale"
            >
              {units.map((u, i) => (
                <div key={i} className="flex items-end gap-2 md:gap-4">
                  <FlipNumber value={u.value} label={u.label} />
                  {i < units.length - 1 && (
                    <div className="countdown-sep" aria-hidden="true">:</div>
                  )}
                </div>
              ))}
            </div>

            {/* Date */}
            <p
              className="countdown-date-label mb-8"
              data-reveal="up"
            >
              {data.weddingDateDisplay}
            </p>
          </>
        )}

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row justify-center gap-4"
          data-reveal="up"
        >
          <button
            onClick={() => openModal('guestbook')}
            className="btn-light"
            style={{ borderColor: 'rgba(212,136,122,0.6)', background: 'rgba(212,136,122,0.15)' }}
          >
            Gửi Lời Chúc
          </button>
          {!isPastWeddingDay && (
            <Link to="/rsvp" className="btn-light">Xác nhận tham dự</Link>
          )}
        </div>
      </div>
    </section>
  );
}
