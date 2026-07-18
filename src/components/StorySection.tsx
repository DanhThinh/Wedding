import { useWedding } from '../hooks/weddingContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { setImageFallback } from '../lib/imageFallback';

export default function StorySection() {
  const { data } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.05 });

  return (
    <section id="story" ref={ref} className="section-cream story-section editorial-section">
      <div className="container-custom">
        <header className={`section-heading animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="section-eyebrow">Our Journey</span>
          <h2 className="section-title">Chuyện Chúng Mình</h2>
          <p className="section-subtitle">Ba chương nhỏ trong hành trình về chung một nhà</p>
        </header>

        <div className="story-editorial-list">
          {data.story.map((item, index) => (
            <article
              key={item.id}
              className={`story-editorial-item animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.08 * index}s` }}
            >
              <div className="story-editorial-media">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  width={720}
                  height={540}
                  onError={event => setImageFallback(event.currentTarget)}
                />
                <span className="story-index" aria-hidden="true">0{index + 1}</span>
              </div>
              <div className="story-editorial-copy">
                <p className="story-date">{item.date}</p>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
