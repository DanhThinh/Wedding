import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import { useWedding } from '../hooks/weddingContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { setImageFallback } from '../lib/imageFallback';

export default function AlbumSection() {
  const { data } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.05 });

  return (
    <section id="album" ref={ref} className="section-white album-section editorial-section">
      <div className="container-custom">
        <header className={`section-heading animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="section-eyebrow">Our Memories</span>
          <h2 className="section-title">Album Hình Cưới</h2>
          <p className="section-subtitle">Những khoảnh khắc chúng mình muốn lưu giữ mãi</p>
        </header>

        <LightGallery
          speed={450}
          plugins={[lgZoom, lgThumbnail]}
          elementClassNames="album-editorial-grid"
          selector=".album-editorial-item"
        >
          {data.album.map((src, index) => (
            <a
              key={src}
              href={src}
              className={`album-editorial-item album-item-${index + 1} animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.04 * index}s` }}
              aria-label={`Mở ảnh cưới ${index + 1}`}
            >
              <img
                src={src}
                alt={`Khoảnh khắc cưới ${index + 1}`}
                loading="lazy"
                decoding="async"
                onError={event => setImageFallback(event.currentTarget)}
              />
              <span className="album-open-mark" aria-hidden="true">+</span>
            </a>
          ))}
        </LightGallery>
      </div>
    </section>
  );
}
