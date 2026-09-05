import { inviteData } from '../../data/inviteData';
import { setImageFallback } from '../../lib/imageFallback';
import { HeartDoodle, Signature } from './art';

/**
 * "Album Ảnh Cưới": lưới ảnh so le kiểu collage, vài nét tim đỏ vẽ tay chồng lên,
 * kết bằng "Lời cảm ơn !".
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

        <div className="invite-album__grid" data-reveal-stagger="0.07">
          {album.photos.map((src, index) => (
            <figure key={src} className={`invite-album__cell cell-${index % 6}`} data-reveal="scale">
              <img
                src={src}
                alt={`Ảnh cưới ${index + 1}`}
                loading="lazy"
                decoding="async"
                onError={event => setImageFallback(event.currentTarget)}
              />
            </figure>
          ))}
        </div>
      </div>

      <div className="invite-album__thanks" data-reveal="up">
        <p className="invite-album__thanks-title">{album.thanks.title}</p>
        <p className="invite-album__thanks-body">{album.thanks.body}</p>
        <Signature variant="a" className="invite-album__thanks-sign" />
      </div>
    </section>
  );
}
