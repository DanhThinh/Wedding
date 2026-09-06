import { useId } from 'react';
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
 * "Wedding Ceremony": giờ – ngày – thứ, ngày âm lịch, dòng chữ vòng cung
 * "WELCOME TO OUR WEDDING", ảnh cưới cắt hình vòm và lịch tháng cưới chồng lên đáy ảnh.
 */
export default function InviteCeremony() {
  const { ceremony, weddingDate } = inviteData;
  const arcId = useId().replace(/:/g, '');
  const grid = buildMonthGrid(weddingDate);
  const weddingDay = getDateParts(weddingDate).day;

  return (
    <section className="invite-ceremony" id="ceremony">
      <h2 className="invite-ceremony__title script-title is-gold" data-reveal="up">{ceremony.title}</h2>
      <p className="invite-ceremony__line" data-reveal="up">{ceremony.line}</p>
      <p className="invite-ceremony__lunar" data-reveal="up">({formatLunarLine(weddingDate)})</p>

      <div className="invite-ceremony__stage" data-reveal="scale">
        <svg className="invite-ceremony__arc" viewBox="0 0 400 120" aria-hidden="true">
          <defs>
            {/* Cung thoải để chữ không bị dựng đứng ở hai đầu */}
            <path id={`arc-${arcId}`} d="M16 114 A 260 168 0 0 1 384 114" fill="none" />
          </defs>
          <text className="invite-ceremony__arc-text">
            <textPath href={`#arc-${arcId}`} startOffset="50%" textAnchor="middle">
              {ceremony.welcome}
            </textPath>
          </text>
        </svg>
        <span className="sr-only">{ceremony.welcome}</span>

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
