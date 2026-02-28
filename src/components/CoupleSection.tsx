import { useState } from 'react';
import { useWedding } from '../hooks/useWedding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function CoupleCard({
  image, role, name, description, delay, animClass,
}: {
  image: string; role: string; name: string; description: string;
  delay: string; animClass: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`couple-card animate-on-scroll ${animClass}`}
      style={{ transitionDelay: delay }}
    >
      {/* Decorative corner accents */}
      <div className="couple-card-corner tl" aria-hidden="true" />
      <div className="couple-card-corner tr" aria-hidden="true" />
      <div className="couple-card-corner bl" aria-hidden="true" />
      <div className="couple-card-corner br" aria-hidden="true" />

      <div className="couple-portrait">
        <img
          src={image}
          alt={name}
          loading="lazy"
          width={220}
          height={285}
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/220x285/F5EBE9/D4887A?text=${encodeURIComponent(role)}`; }}
        />
      </div>

      <div className="couple-role">{role}</div>
      <h3 className="couple-name">{name}</h3>
      <p className={`couple-desc ${expanded ? '' : 'line-clamp-3'}`}>{description}</p>
      <button
        onClick={() => setExpanded(v => !v)}
        className="mt-3 text-sm font-medium hover:underline"
        style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {expanded ? 'Thu gọn ↑' : 'Xem thêm ↓'}
      </button>
    </div>
  );
}

export default function CoupleSection() {
  const { data } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  return (
    <section id="couple" ref={ref} className="py-24 section-white">
      <div className="container-custom">

        <div className="text-center mb-12">
          <span className="section-eyebrow">The Couple</span>
          <h2 className="section-title">Cặp Đôi</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <CoupleCard
            image={data.groom.image}
            role="The Groom"
            name={data.groom.fullName}
            description={data.groom.description}
            delay="0.2s"
            animClass={isVisible ? 'visible animate-left' : 'animate-left'}
          />
          <CoupleCard
            image={data.bride.image}
            role="The Bride"
            name={data.bride.fullName}
            description={data.bride.description}
            delay="0.4s"
            animClass={isVisible ? 'visible animate-right' : 'animate-right'}
          />
        </div>

        {/* Intro box */}
        <div
          className={`couple-intro-box max-w-2xl mx-auto mt-14 animate-on-scroll ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.6s' }}
        >
          <div className="ornament" aria-hidden="true">
            <span className="ornament-icon" />
          </div>
          <h3 className="couple-intro-script">{data.intro.title}</h3>
          <p className="couple-intro-text">{data.intro.content}</p>
          <p className="couple-sign">{data.groom.shortName} &amp; {data.bride.shortName}</p>
        </div>
      </div>
    </section>
  );
}
