import { useId } from 'react';
import { useWedding } from '../../hooks/weddingContext';
import { ChatGlyph } from './art';

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh',
});

/** Hiển thị cùng nguồn lời chúc mà nút gửi trên thanh dock đang sử dụng. */
export default function InviteGuestbook() {
  const { wishes, guestbookLoading, guestbookMode, openModal } = useWedding();
  const titleId = useId();

  return (
    <section id="guestbook" className="invite-guestbook" aria-labelledby={titleId}>
      <h2 id={titleId} className="script-title is-gold">Sổ lưu bút</h2>
      <p className="invite-guestbook__intro">Những lời yêu thương dành cho chúng mình</p>
      <p className="invite-guestbook__status" role="status">
        {guestbookLoading
          ? 'Đang tải lời chúc…'
          : guestbookMode === 'local'
            ? `${wishes.length} lời chúc · Lưu trên thiết bị này`
            : `${wishes.length} lời chúc`}
      </p>

      {!guestbookLoading && (wishes.length > 0 ? (
        <ul className="invite-guestbook__list" aria-label="Danh sách lời chúc" tabIndex={0}>
          {wishes.map((wish, index) => {
            const date = new Date(wish.date);
            return (
              <li className="invite-guestbook__wish" key={wish.id ?? `${wish.date}-${index}`}>
                <p className="invite-guestbook__author">{wish.name}</p>
                <p className="invite-guestbook__message">{wish.message}</p>
                {!Number.isNaN(date.getTime()) && (
                  <time className="invite-guestbook__date" dateTime={date.toISOString()}>
                    {dateFormat.format(date)}
                  </time>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="invite-guestbook__empty">
          <p>Chưa có lời chúc nào.</p>
          <p>Hãy là người đầu tiên gửi lời chúc đến chúng mình nhé!</p>
        </div>
      ))}

      <button type="button" className="invite-btn" onClick={() => openModal('guestbook')}>
        <ChatGlyph />
        Gửi lời chúc
      </button>
    </section>
  );
}
