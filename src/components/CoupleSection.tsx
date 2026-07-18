import { useWedding } from '../hooks/weddingContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { setImageFallback } from '../lib/imageFallback';

export default function CoupleSection() {
  const { data } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.08 });
  const people = [
    { ...data.groom, role: 'The Groom' },
    { ...data.bride, role: 'The Bride' },
  ];

  return (
    <section id="couple" ref={ref} className="section-white couple-section editorial-section">
      <div className="container-custom">
        <header className={`section-heading animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="section-eyebrow">The Couple</span>
          <h2 className="section-title">Hai Người, Một Nhà</h2>
          <p className="section-subtitle">Một hành trình dài được viết tiếp bằng lời hứa trọn đời</p>
        </header>

        <div className="couple-editorial-grid">
          {people.map((person, index) => (
            <article
              key={person.fullName}
              className={`couple-editorial-profile animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.1 + index * 0.08}s` }}
            >
              <div className="couple-editorial-media">
                <img
                  src={person.image}
                  alt={person.fullName}
                  loading="lazy"
                  width={600}
                  height={760}
                  onError={event => setImageFallback(event.currentTarget)}
                />
              </div>
              <div className="couple-editorial-copy">
                <p>{person.role}</p>
                <h3>{person.fullName}</h3>
                <div className="profile-rule" aria-hidden="true" />
                <p className="profile-description">{person.description}</p>
              </div>
            </article>
          ))}
        </div>

        <blockquote className={`couple-editorial-note animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span aria-hidden="true">“</span>
          <p>{data.intro.content}</p>
          <cite>{data.groom.shortName} &amp; {data.bride.shortName}</cite>
        </blockquote>
      </div>
    </section>
  );
}
