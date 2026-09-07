import { useId, useState } from 'react';
import { weddingData } from '../../data/weddingData';
import { useDialogA11y } from '../../hooks/useDialogA11y';
import { hasBank } from '../../lib/giftBank';

type Person = typeof weddingData.groom | typeof weddingData.bride;

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

interface InviteGiftSheetProps { open: boolean; onClose: () => void; }

export default function InviteGiftSheet({ open, onClose }: InviteGiftSheetProps) {
  const sheetRef = useDialogA11y(open, onClose);
  const titleId = useId();

  if (!open) return null;
  return (
    <div className="invite-sheet" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={sheetRef} className="invite-sheet__panel" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <button type="button" className="invite-sheet__close" onClick={onClose} aria-label="Đóng">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <h2 id={titleId} className="invite-sheet__title">Mừng cưới qua chuyển khoản</h2>
        <div className="invite-gift__cards">
          {hasBank(weddingData.bride) && <BankCard person={weddingData.bride} role="Cô dâu" />}
          {hasBank(weddingData.groom) && <BankCard person={weddingData.groom} role="Chú rể" />}
        </div>
      </div>
    </div>
  );
}
