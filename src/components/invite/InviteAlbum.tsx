import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import { inviteData } from '../../data/inviteData';
import { setImageFallback } from '../../lib/imageFallback';
import { trackEvent } from '../../lib/analytics';
import { HeartDoodle, Signature } from './art';

/**
 * "Album Ảnh Cưới": lưới ảnh so le kiểu collage, vài nét tim đỏ vẽ tay chồng lên,
 * kết bằng "Lời cảm ơn !".
 *
 * Chạm vào ảnh để mở lightbox (phóng to, vuốt qua lại, dải thumbnail) — dùng
 * chung LightGallery với giao diện cũ ở `components/AlbumSection.tsx`.
 * Component này được `InvitePage` nạp trễ vì LightGallery khá nặng mà album
 * lại nằm cuối trang.
 */
export default function InviteAlbum() {
  const { album } = inviteData;

  return (
    <section className="invite-album" id="album">
      <h2 className="script-title" data-reveal="up">{album.title}</h2>

      <div className="invite-album__stage">
        <HeartDoodle className="invite-album__doodle invite-album__doodle--a" />
        <HeartDoodle className="invite-album__doodle invite-album__doodle--b" />
        <HeartDoodle className="invite-album__doodle invite-album__doodle--c" />

        <LightGallery
          speed={450}
          plugins={[lgZoom, lgThumbnail]}
          elementClassNames="invite-album__grid"
          selector=".invite-album__cell"
          download={false}
          counter={false}
        >
          {album.photos.map((src, index) => (
            <a
              key={src}
              href={src}
              className={`invite-album__cell cell-${index % 6}`}
              data-reveal="scale"
              aria-label={`Mở ảnh cưới ${index + 1}`}
              onClick={() => {
                void trackEvent('gallery_open', {
                  image_index: index + 1,
                  image_total: album.photos.length,
                });
              }}
            >
              <img
                src={src}
                alt={`Ảnh cưới ${index + 1}`}
                loading="lazy"
                decoding="async"
                onError={event => setImageFallback(event.currentTarget)}
              />
              <span className="invite-album__zoom" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="M11 8.5v5M8.5 11h5" />
                  <path d="M15.8 15.8L20 20" />
                </svg>
              </span>
            </a>
          ))}
        </LightGallery>
      </div>

      <div className="invite-album__thanks" data-reveal="up">
        <p className="invite-album__thanks-title">{album.thanks.title}</p>
        <p className="invite-album__thanks-body">{album.thanks.body}</p>
        <Signature variant="a" className="invite-album__thanks-sign" />
      </div>
    </section>
  );
}
