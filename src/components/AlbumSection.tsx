import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import { useWedding } from '../hooks/weddingContext';
import { setImageFallback } from '../lib/imageFallback';
import { trackEvent } from '../lib/analytics';
import RevealTitle from './RevealTitle';

export default function AlbumSection() {
  const { data } = useWedding();

  return (
    // Nhiều ảnh cùng lọt vào khung nhìn → rút ngắn nhịp stagger cho gọn.
    <section
      id="album"
      className="section-white album-section editorial-section"
      data-reveal-stagger="0.05"
    >
      <div className="container-custom">
        <header className="section-heading">
          <span className="section-eyebrow" data-reveal="up">Our Memories</span>
          <RevealTitle text="Album Hình Cưới" className="section-title" />
          <p className="section-subtitle" data-reveal="up">
            Những khoảnh khắc chúng mình muốn lưu giữ mãi
          </p>
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
              className={`album-editorial-item album-item-${index + 1}`}
              data-reveal="mask"
              aria-label={`Mở ảnh cưới ${index + 1}`}
              onClick={() => {
                void trackEvent('gallery_open', {
                  image_index: index + 1,
                  image_total: data.album.length,
                });
              }}
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
