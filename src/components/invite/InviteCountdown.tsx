import { useState } from 'react';
import { useWedding } from '../../hooks/weddingContext';
import { useCountdown } from '../../hooks/useCountdown';
import { getWeddingPhase } from '../../lib/weddingState';

const UNIT_LABELS = ['Ngày', 'Giờ', 'Phút', 'Giây'];

/**
 * Một chữ số trong khe cắt tràn: số cũ lăn lên khuất phía trên, số mới lăn lên
 * thế chỗ từ phía dưới. Phải giữ cả hai cùng lúc — nếu chỉ vẽ số mới thì trong
 * suốt thời gian nó còn nằm dưới mặt nạ, khe sẽ trống trơn và mắt đọc thành
 * "số bị nháy mất" chứ không phải một vòng lăn.
 */
function RollingDigit({ digit }: { digit: string }) {
  // Cập nhật state ngay trong lúc render là cách React khuyến nghị để lấy giá
  // trị trước đó của prop; nhánh `if` đảm bảo không lặp vô hạn.
  const [state, setState] = useState({ current: digit, previous: null as string | null });

  if (digit !== state.current) {
    setState({ current: digit, previous: state.current });
  }

  return (
    <span className="invite-countdown__digit-slot">
      {state.previous !== null && (
        <span
          className="invite-countdown__digit is-leaving"
          key={`out-${state.previous}-${state.current}`}
          aria-hidden="true"
        >
          {state.previous}
        </span>
      )}
      <span className="invite-countdown__digit" key={`in-${state.current}`}>
        {state.current}
      </span>
    </span>
  );
}

/** Số đếm ngược tách thành từng chữ số — chỉ chữ số thực sự đổi mới lăn. */
function RollingValue({ value }: { value: number }) {
  return (
    <span className="invite-countdown__value">
      {String(value).padStart(2, '0').split('').map((digit, index) => (
        <RollingDigit digit={digit} key={index} />
      ))}
    </span>
  );
}

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
                <RollingValue value={value} />
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
