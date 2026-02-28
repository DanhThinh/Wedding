import { useRef } from 'react';
import { useWedding } from '../hooks/useWedding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

export default function AlbumSection() {
  const { data } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const lightGalleryRef = useRef<any>(null);

  return (
    <section id="album" ref={ref} className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="section-title">Album Hình Cưới</h2>

        <LightGallery
          onInit={(detail) => {
            lightGalleryRef.current = detail.instance;
          }}
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
              className={`gallery-item block animate-on-scroll ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${0.1 * (index % 4)}s` }}
            >
              <img
                src={image}
                alt={`Wedding photo ${index + 1}`}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400?text=Photo+${index + 1}`;
                }}
              />
              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </a>
          ))}
        </LightGallery>
      </div>
    </section>
  );
}
