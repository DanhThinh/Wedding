import { useWedding } from '../hooks/weddingContext';
import { setImageFallback } from '../lib/imageFallback';
import RevealTitle from './RevealTitle';

export default function StorySection() {
  const { data } = useWedding();

  return (
    <section id="story" className="section-cream story-section editorial-section">
      <div className="container-custom">
        <header className="section-heading">
          <span className="section-eyebrow" data-reveal="up">Our Journey</span>
          <RevealTitle text="Chuyện Chúng Mình" className="section-title" />
          <p className="section-subtitle" data-reveal="up">
            Ba chương nhỏ trong hành trình về chung một nhà
          </p>
        </header>

        <div className="story-editorial-list">
          {data.story.map((item, index) => (
            <article key={item.id} className="story-editorial-item">
              <div className="story-editorial-media">
                {/* Khung riêng để ảnh trôi theo cuộn mà số chương vẫn tràn ra ngoài. */}
                <div className="story-editorial-frame" data-reveal="mask">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    width={720}
                    height={540}
                    onError={event => setImageFallback(event.currentTarget)}
                  />
                </div>
                <span className="story-index" aria-hidden="true">0{index + 1}</span>
              </div>
              <div
                className="story-editorial-copy"
                data-reveal={index % 2 === 0 ? 'right' : 'left'}
              >
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
