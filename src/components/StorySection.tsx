import { useWedding } from '../hooks/useWedding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function StorySection() {
  const { data } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.05 });

  return (
    <section id="story" ref={ref} className="py-24 section-cream">
      <div className="container-custom">

        <div className="text-center mb-14">
          <span className="section-eyebrow">Our Journey</span>
          <h2 className="section-title">Chuyện Chúng Mình</h2>
        </div>

        <div className="timeline-wrapper">
          {/* Vertical spine */}
          <div className="timeline-spine" aria-hidden="true" />

          {data.story.map((item, index) => {
            const isLeft = index % 2 === 0;

            const card = (
              <div className="timeline-card">
                <img
                  src={item.image}
                  alt={item.title}
                  className="timeline-card-img"
                  loading="lazy"
                  width={420}
                  height={315}
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/420x315/F5EBE9/D4887A?text=Story+${item.id}`;
                  }}
                />
                <div className="timeline-card-body">
                  <span className="timeline-date-badge">{item.date}</span>
                  {item.label && (
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {item.label}
                    </p>
                  )}
                  <h4 className="timeline-title">{item.title}</h4>
                  <p className="timeline-text">{item.content}</p>
                </div>
              </div>
            );

            return (
              <div
                key={item.id}
                className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${0.2 + index * 0.15}s` }}
              >
                {/* Desktop alternating layout */}
                <div className="timeline-item hidden md:grid">
                  <div className={isLeft ? 'timeline-left' : 'timeline-empty'}>
                    {isLeft && card}
                  </div>
                  <div className="timeline-dot-col">
                    <div className="timeline-dot" />
                  </div>
                  <div className={!isLeft ? 'timeline-right' : 'timeline-empty'}>
                    {!isLeft && card}
                  </div>
                </div>

                {/* Mobile stacked layout */}
                <div className="flex gap-4 mb-8 md:!hidden">
                  <div className="flex flex-col items-center flex-shrink-0" style={{ width: 40 }}>
                    <div className="timeline-dot mt-5" />
                    {index < data.story.length - 1 && (
                      <div style={{ flex: 1, width: 1.5, background: 'var(--blush-mid)', marginTop: 6 }} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">{card}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
