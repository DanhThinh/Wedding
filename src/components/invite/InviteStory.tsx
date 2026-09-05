import { inviteData } from '../../data/inviteData';
import { setImageFallback } from '../../lib/imageFallback';
import { HeartSolid } from './art';

/**
 * "Our Love Story" — trục dọc chấm bi ở giữa, mỗi mốc có năm + tiêu đề tiếng Anh
 * bên một phía và ảnh bo mềm ở phía đối diện, so le xuống dưới.
 */
export default function InviteStory() {
  const { story } = inviteData;

  return (
    <section className="invite-story" id="story">
      <header className="invite-story__head">
        <h2 className="script-title" data-reveal="up">{story.title}</h2>
        <HeartSolid className="invite-story__head-heart" />
      </header>

      <ol className="invite-story__track" data-reveal-stagger="0.14">
        {story.milestones.map(milestone => (
          <li key={milestone.id} className={`invite-story__item is-${milestone.side}`}>
            <span className="invite-story__node" aria-hidden="true">
              <HeartSolid className="invite-story__node-heart" />
            </span>

            <div className="invite-story__copy" data-reveal={milestone.side === 'left' ? 'left' : 'right'}>
              <p className="invite-story__year">{milestone.year}</p>
              <h3 className="invite-story__title">{milestone.title}</h3>
              <p className="invite-story__text">{milestone.text}</p>
            </div>

            <div className="invite-story__media" data-reveal={milestone.side === 'left' ? 'right' : 'left'}>
              <img
                src={milestone.image}
                alt={milestone.title}
                loading="lazy"
                decoding="async"
                onError={event => setImageFallback(event.currentTarget)}
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
