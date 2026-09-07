import { inviteData } from '../../data/inviteData';
import { weddingData } from '../../data/weddingData';
import { CoupleLineArt, GiftBoxArt } from './art';
import { useState } from 'react';

type Person = typeof weddingData.groom | typeof weddingData.bride;

/** Chỉ hiện thẻ ngân hàng khi đã điền đủ số tài khoản + tên ngân hàng. */
const hasBank = (person: Person) => Boolean(person.bank.number && person.bank.bankName);

function BankCard({ person, role }: { person: Person; role: string }) {
  const [status, setStatus] = useState('');
  const [qrFailed, setQrFailed] = useState(false);
  const copyAccount = async () => {
    try { await navigator.clipboard.writeText(person.bank.number); setStatus('Đã sao chép số tài khoản.'); }
    catch { setStatus('Chưa sao chép được. Bạn có thể nhấn giữ số tài khoản để sao chép.'); }
  };
  return (
    <div className="invite-gift__card">
      <p className="invite-gift__card-role">{role}</p>
      {person.bank.qrCode && !qrFailed && (
        <img className="invite-gift__qr" src={person.bank.qrCode} alt={`Mã QR chuyển khoản ${role}`} loading="lazy" onError={() => setQrFailed(true)} />
      )}
      <p className="invite-gift__card-name">{person.bank.name}</p>
      <p className="invite-gift__card-number">{person.bank.number}</p>
      <p className="invite-gift__card-bank">{person.bank.bankName}</p>
      <div className="invite-gift__actions">
        <button type="button" className="invite-btn" onClick={() => void copyAccount()}>Sao chép số tài khoản</button>
        {person.bank.qrCode && !qrFailed && <a className="invite-btn" href={person.bank.qrCode} download>Tải mã QR</a>}
      </div>
      {qrFailed && <p>Chưa tải được mã QR. Bạn có thể dùng số tài khoản bên trên.</p>}
      <p role="status">{status}</p>
    </div>
  );
}

/** "Hộp Quà Mừng" — cặp đôi vẽ nét đứng cạnh hộp quà bung tim. */
export default function InviteGift() {
  const { gift } = inviteData;
  const showBanks = hasBank(weddingData.groom) || hasBank(weddingData.bride);

  return (
    <section className="invite-gift" id="gift">
      <h2 className="invite-gift__title" data-reveal="up">{gift.title}</h2>

      <div className="invite-gift__art" data-reveal="scale">
        <CoupleLineArt className="invite-gift__couple" />
        <GiftBoxArt className="invite-gift__box" />
      </div>

      <p className="invite-gift__desc" data-reveal="up">{gift.description}</p>

      {showBanks && (
        <div className="invite-gift__cards" data-reveal="up">
          {hasBank(weddingData.bride) && <BankCard person={weddingData.bride} role="Cô dâu" />}
          {hasBank(weddingData.groom) && <BankCard person={weddingData.groom} role="Chú rể" />}
        </div>
      )}
    </section>
  );
}
