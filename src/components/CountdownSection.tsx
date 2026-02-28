import { useWedding } from '../hooks/useWedding';
import { useCountdown } from '../hooks/useCountdown';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function CountdownSection() {
  const { data, openModal } = useWedding();
  const countdown = useCountdown(data.weddingDate);
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.25 });

  const units = [
    { value: countdown.days,    label: 'Ngày' },
    { value: countdown.hours,   label: 'Giờ' },
    { value: countdown.minutes, label: 'Phút' },
    { value: countdown.seconds, label: 'Giây' },
  ];

  return (
    <section id="countdown" ref={ref} className="py-24 countdown-bg">
      <div className="container-custom text-center relative z-10">

        <div
          className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0s' }}
        >
          <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(212,136,122,0.8)', marginBottom: '0.75rem' }}>
            The Big Day
          </p>
          <h2 className="countdown-title">Đếm Ngược Đến Ngày Cưới</h2>
        </div>

        {/* Timer */}
        <div
          className={`flex justify-center items-end gap-2 md:gap-4 mb-10 animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.15s' }}
        >
          {units.map((u, i) => (
            <div key={i} className="flex items-end gap-2 md:gap-4">
              <div className="countdown-item">
                <div className="countdown-value">{u.value}</div>
                <div className="countdown-label">{u.label}</div>
              </div>
              {i < units.length - 1 && (
                <div className="countdown-sep" aria-hidden="true">:</div>
              )}
            </div>
          ))}
        </div>

        {/* Date */}
        <p
          className={`countdown-date-label mb-8 animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.25s' }}
        >
          {data.weddingDateDisplay}
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.35s' }}
        >
          <button
            onClick={() => openModal('guestbook')}
            className="btn-light"
            style={{ borderColor: 'rgba(212,136,122,0.6)', background: 'rgba(212,136,122,0.15)' }}
          >
            Gửi Lời Chúc
          </button>
          <a href="/rsvp" className="btn-light">
            Xác nhận tham dự
          </a>
        </div>
      </div>
    </section>
  );
}
