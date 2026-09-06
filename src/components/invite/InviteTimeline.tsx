import { useId, useState } from 'react';
import type { WeddingData } from '../../data/weddingData';

type TimelineEvent = Pick<WeddingData['events'][number], 'name' | 'date' | 'timeline'>;

/** Mỗi thẻ tự quản lý trạng thái xổ xuống và lịch trình riêng của mình. */
export default function InviteTimeline({ event }: { event: TimelineEvent }) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  return (
    <div className="invite-timeline">
      <button
        type="button"
        className="invite-timeline__toggle"
        aria-expanded={expanded}
        aria-controls={contentId}
        aria-label={`${expanded ? 'Thu gọn' : 'Xem'} lịch trình ${event.name}`}
        onClick={() => setExpanded(value => !value)}
      >
        <span>{expanded ? 'Thu gọn lịch trình' : 'Xem lịch trình'}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={contentId} hidden={!expanded}>
        {expanded && (event.timeline.length > 0 ? (
          <ol className="invite-timeline__track" aria-label={`Lịch trình ${event.name}`}>
            {event.timeline.map(item => (
              <li key={item.id} className="invite-timeline__item">
                <time className="invite-timeline__time" dateTime={`${event.date}T${item.time}:00+07:00`}>
                  {item.time}
                </time>
                <span className="invite-timeline__label">{item.label}</span>
              </li>
            ))}
          </ol>
        ) : <p className="invite-timeline__empty">Lịch trình sẽ cập nhật</p>)}
      </div>
    </div>
  );
}
