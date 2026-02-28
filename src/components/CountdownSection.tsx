import { useWedding } from '../hooks/useWedding';
import { useCountdown } from '../hooks/useCountdown';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function CountdownSection() {
  const { data, openModal } = useWedding();
  const countdown = useCountdown(data.weddingDate);
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.3 });

  return (
    <section
      id="countdown"
      ref={ref}
      className="py-20 bg-gradient-to-b from-primary/10 to-white"
    >
      <div className="container-custom text-center">
        <h2 className="section-title">The Big Day!</h2>

        {/* Countdown Timer */}
        <div
          className={`flex justify-center gap-4 md:gap-8 mb-12 animate-on-scroll ${isVisible ? 'visible' : ''}`}
        >
          <div className="countdown-item bg-white rounded-xl shadow-lg">
            <div className="countdown-value">{countdown.days}</div>
            <div className="countdown-label">Ngày</div>
          </div>
          <div className="countdown-item bg-white rounded-xl shadow-lg">
            <div className="countdown-value">{countdown.hours}</div>
            <div className="countdown-label">Giờ</div>
          </div>
          <div className="countdown-item bg-white rounded-xl shadow-lg">
            <div className="countdown-value">{countdown.minutes}</div>
            <div className="countdown-label">Phút</div>
          </div>
          <div className="countdown-item bg-white rounded-xl shadow-lg">
            <div className="countdown-value">{countdown.seconds}</div>
            <div className="countdown-label">Giây</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.3s' }}
        >
          <button onClick={() => openModal('guestbook')} className="btn-primary">
            Gửi Lời Chúc
          </button>
          <a href="/rsvp" className="btn-primary">
            Xác nhận tham dự
          </a>
        </div>
      </div>
    </section>
  );
}
