import { useWedding } from '../hooks/weddingContext';
import { setImageFallback } from '../lib/imageFallback';
import RevealTitle from './RevealTitle';

export default function CoupleSection() {
  const { data } = useWedding();
  const people = [
    { ...data.groom, role: 'The Groom' },
    { ...data.bride, role: 'The Bride' },
  ];

  return (
    <section id="couple" className="section-white couple-section editorial-section">
      <div className="container-custom">
        <header className="section-heading">
          <span className="section-eyebrow" data-reveal="up">The Couple</span>
          <RevealTitle text="Hai Người, Một Nhà" className="section-title" />
          <p className="section-subtitle" data-reveal="up">
            Một hành trình dài được viết tiếp bằng lời hứa trọn đời
          </p>
        </header>

        <div className="couple-editorial-grid">
          {people.map((person, index) => (
            <article key={person.fullName} className="couple-editorial-profile">
              <div className="couple-editorial-media" data-reveal="mask">
                <img
                  src={person.image}
                  alt={person.fullName}
                  loading="lazy"
                  width={600}
                  height={760}
                  onError={event => setImageFallback(event.currentTarget)}
                />
              </div>
              {/* Chữ trôi vào từ phía ảnh để hai nửa "gặp nhau" ở giữa. */}
              <div
                className="couple-editorial-copy"
                data-reveal={index % 2 === 0 ? 'right' : 'left'}
              >
                <p>{person.role}</p>
                <h3>{person.fullName}</h3>
                <div className="profile-rule" aria-hidden="true" />
                <p className="profile-description">{person.description}</p>
              </div>
            </article>
          ))}
        </div>

        <blockquote className="couple-editorial-note" data-reveal="up">
          <span aria-hidden="true">“</span>
          <p>{data.intro.content}</p>
          <cite>{data.groom.shortName} &amp; {data.bride.shortName}</cite>
        </blockquote>
      </div>
    </section>
  );
}
