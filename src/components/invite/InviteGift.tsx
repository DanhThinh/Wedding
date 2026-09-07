import { useState } from 'react';
import { inviteData } from '../../data/inviteData';
import { weddingData } from '../../data/weddingData';
import { CoupleLineArt, GiftBoxArt } from './art';
import InviteGiftSheet from './InviteGiftSheet';
import { hasBank } from '../../lib/giftBank';

/** "Hộp Quà Mừng" — cặp đôi vẽ nét đứng cạnh hộp quà bung tim. Bấm vào hộp để xem QR chuyển khoản. */
export default function InviteGift() {
  const { gift } = inviteData;
  const [qrOpen, setQrOpen] = useState(false);
  const showBanks = hasBank(weddingData.groom) || hasBank(weddingData.bride);

  return (
    <section className="invite-gift" id="gift">
      <h2 className="invite-gift__title" data-reveal="up">{gift.title}</h2>

      <div className="invite-gift__art" data-reveal="scale">
        <CoupleLineArt className="invite-gift__couple" />
        {showBanks ? (
          <button
            type="button"
            className="invite-gift__box-btn"
            onClick={() => setQrOpen(true)}
            aria-haspopup="dialog"
          >
            <GiftBoxArt className="invite-gift__box" />
            <span className="invite-gift__box-hint">Chạm để xem QR mừng cưới</span>
          </button>
        ) : (
          <GiftBoxArt className="invite-gift__box" />
        )}
      </div>

      <p className="invite-gift__desc" data-reveal="up">{gift.description}</p>

      {showBanks && <InviteGiftSheet open={qrOpen} onClose={() => setQrOpen(false)} />}
    </section>
  );
}
