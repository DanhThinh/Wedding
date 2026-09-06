import { useWedding } from '../../hooks/weddingContext';
import { useCountdown } from '../../hooks/useCountdown';
import { getWeddingPhase } from '../../lib/weddingState';

const UNIT_LABELS = ['Ngày', 'Giờ', 'Phút', 'Giây'];

/** Đếm ngược đến giờ cưới — tự ẩn sau khi ngày cưới đã qua. */
export default function InviteCountdown() {
  const { data } = useWedding();
  const countdown = useCountdown(data.weddingDate);
  const phase = getWeddingPhase(data.weddingDate, new Date(countdown.now));
  const isExpired = countdown.days === 0 && countdown.hours === 0
    && countdown.minutes === 0 && countdown.seconds === 0;

  if (isExpired && phase === 'after') return null;

  const values = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds];

  return (
    <section className="invite-countdown" id="countdown">
      <p className="invite-countdown__eyebrow" data-reveal="fade">The Big Day</p>
      <h2 className="script-title is-gold" data-reveal="up">
        {isExpired ? 'Hôm Nay Là Ngày Cưới!' : 'Đếm Ngược Đến Ngày Cưới'}
      </h2>

      {!isExpired && (
        // Không gắn data-reveal ở đây: đây là số liệu sống (đếm từng giây), nếu
        // lỡ dừng cuộn đúng lúc phần tử vừa qua ngưỡng kích hoạt của reveal
        // engine (rootMargin -12% đáy khung nhìn) thì nó sẽ kẹt ở opacity:0
        // vĩnh viễn cho tới khi cuộn tiếp — không nên để số đếm ngược phụ
        // thuộc vào animation cuộn trang.
        <div className="invite-countdown__units">
          {values.map((value, index) => (
            <span className="invite-countdown__group" key={UNIT_LABELS[index]}>
              <span className="invite-countdown__unit">
                <span className="invite-countdown__value">{String(value).padStart(2, '0')}</span>
                <span className="invite-countdown__label">{UNIT_LABELS[index]}</span>
              </span>
              {index < values.length - 1 && (
                <span className="invite-countdown__sep" aria-hidden="true">:</span>
              )}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
