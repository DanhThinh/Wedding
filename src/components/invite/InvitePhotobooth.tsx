import { inviteData } from '../../data/inviteData';
import { setImageFallback } from '../../lib/imageFallback';
import { VintageCamera } from './art';

/**
 * Photobooth: máy ảnh cổ bên trái, hai dải ảnh polaroid xếp chồng lệch nhau
 * bên phải — dải trái có dòng chữ viết tay, dải phải in ngày cưới.
 */
export default function InvitePhotobooth() {
  const { photobooth, hero } = inviteData;
  const [a, b, c, d] = photobooth.strip;

  return (
    <section className="invite-booth" id="photobooth">
      <div className="invite-booth__stage">
        <VintageCamera className="invite-booth__camera" />

        <div className="invite-booth__strips" data-reveal="scale">
          <div className="invite-booth__strip invite-booth__strip--front">
            {[a, b].map((src, i) => (
              <img
                key={src ?? i}
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                onError={event => setImageFallback(event.currentTarget)}
              />
            ))}
            <p className="invite-booth__handwriting">{photobooth.handwriting}</p>
          </div>

          <div className="invite-booth__strip invite-booth__strip--back">
            {[c, d].map((src, i) => (
              <img
                key={src ?? i}
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                onError={event => setImageFallback(event.currentTarget)}
              />
            ))}
            <p className="invite-booth__stamp">{hero.dateDisplay}</p>
          </div>
        </div>
      </div>

      <p className="invite-booth__caption" data-reveal="up">{photobooth.caption}</p>
    </section>
  );
}
