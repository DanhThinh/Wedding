import { inviteData } from '../../data/inviteData';
import { formatLunarLine } from '../../lib/lunar';
import { getDateParts } from '../../lib/date';
import { setImageFallback } from '../../lib/imageFallback';
import { HeartSolid } from './art';

const WEEKDAY_HEAD = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/** Lưới ngày của tháng cưới, tuần bắt đầu từ Thứ 2 (chuẩn VN). */
function buildMonthGrid(date: Date) {
  const { year, month } = getDateParts(date);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  // 0 = CN → đẩy về cuối tuần.
  const leadingBlanks = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;

  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
}

/**
 * "Wedding Ceremony": giờ – ngày – thứ, ngày âm lịch, dòng chữ
 * "WELCOME TO OUR WEDDING" bo cong theo dáng vòm, ảnh cưới cắt hình vòm
 * và lịch tháng cưới chồng lên đáy ảnh.
 */
export default function InviteCeremony() {
  const { ceremony, weddingDate } = inviteData;
  const grid = buildMonthGrid(weddingDate);
  const weddingDay = getDateParts(weddingDate).day;

  return (
    <section className="invite-ceremony" id="ceremony">
      <h2 className="invite-ceremony__title script-title is-gold" data-reveal="up">{ceremony.title}</h2>
      <p className="invite-ceremony__line" data-reveal="up">{ceremony.line}</p>
      <p className="invite-ceremony__lunar" data-reveal="up">({formatLunarLine(weddingDate)})</p>

      <div className="invite-ceremony__stage" data-reveal="scale">
        {/* Chữ bo cong theo đúng dáng vòm của ảnh bên dưới — cung tròn vẽ
            bằng SVG textPath, dùng viewBox tỉ lệ nên co giãn cùng ảnh vòm
            thay vì phụ thuộc kích thước px cố định. */}
        <svg
          className="invite-ceremony__welcome"
          viewBox="0 0 320 90"
          role="img"
          aria-label={ceremony.welcome}
        >
          <path id="invite-ceremony-arc" d="M 4 82 Q 160 -50 316 82" fill="none" />
          <text className="invite-ceremony__welcome-text">
            <textPath href="#invite-ceremony-arc" startOffset="50%" textAnchor="middle">
              {ceremony.welcome}
            </textPath>
          </text>
        </svg>

        <figure className="invite-ceremony__arch">
          <img
            src={ceremony.image}
            alt="Ảnh cưới cô dâu chú rể"
            loading="lazy"
            decoding="async"
            onError={event => setImageFallback(event.currentTarget)}
          />

          <div className="invite-calendar" aria-hidden="true">
            <div className="invite-calendar__head">
              {WEEKDAY_HEAD.map(label => <span key={label}>{label}</span>)}
            </div>
            <div className="invite-calendar__grid">
              {grid.map((day, index) => (
                <span
                  key={day ?? `blank-${index}`}
                  className={day === weddingDay ? 'is-wedding' : undefined}
                >
                  {day ?? ''}
                  {day === weddingDay && <HeartSolid className="invite-calendar__heart" />}
                </span>
              ))}
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
