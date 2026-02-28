import { useRef } from 'react';
import { useWedding } from '../hooks/useWedding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

export default function AlbumSection() {
  const { data } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const lgRef = useRef<any>(null);

  return (
    <section id="album" ref={ref} className="py-24 section-cream">
      <div className="container-custom">

        <div className="text-center mb-12">
          <span className="section-eyebrow">Our Memories</span>
          <h2 className="section-title">Album Hình Cưới</h2>
        </div>

        <LightGallery
          onInit={d => { lgRef.current = d.instance; }}
          speed={500}
          plugins={[lgZoom, lgThumbnail]}
          elementClassNames="gallery-grid"
          selector=".gallery-item"
        >
          {data.album.map((image, index) => (
            <a
              key={index}
              href={image}
              data-src={image}
              className={`gallery-item animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.07 * (index % 4)}s` }}
              aria-label={`Ảnh cưới ${index + 1}`}
            >
              <img
                src={image}
                alt={`Wedding photo ${index + 1}`}
                loading="lazy"
                decoding="async"
                width={400}
                height={400}
                onError={e => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x400/F5EBE9/D4887A?text=Photo+${index + 1}`;
                }}
              />
              {/* Zoom icon */}
              <div className="gallery-zoom-icon" aria-hidden="true">
                <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" strokeLinecap="round"/>
                  <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
          ))}
        </LightGallery>
      </div>
    </section>
  );
}
