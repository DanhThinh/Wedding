import { inviteData } from '../../data/inviteData';
import { TimelineGlyph } from './art';

/**
 * "TimeLine" — hàng viên thuốc chứa giờ ở trên, đường kẻ ngang nối các vòng tròn
 * icon, chú thích việc + địa điểm ở dưới. Cuộn ngang được trên máy hẹp.
 */
export default function InviteTimeline() {
  const { timeline } = inviteData;

  return (
    <section className="invite-timeline" id="timeline">
      <h2 className="script-title" data-reveal="up">{timeline.title}</h2>

      <div className="invite-timeline__scroller">
        <ol className="invite-timeline__track" data-reveal-stagger="0.1">
          {timeline.items.map(item => (
            <li key={item.id} className="invite-timeline__item" data-reveal="up">
              <span className="invite-timeline__time">{item.time}</span>
              <span className="invite-timeline__dot">
                <TimelineGlyph name={item.icon} className="invite-timeline__glyph" />
              </span>
              <span className="invite-timeline__label">{item.label}</span>
              <span className="invite-timeline__place">{item.place}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
