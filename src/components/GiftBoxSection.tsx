import { useState } from 'react';
import { useWedding } from '../hooks/useWedding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function GiftBoxSection() {
  const { data, showToast } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copy thành công!', 'success');
    } catch {
      showToast('Không thể copy!', 'error');
    }
  };

  const person = activeTab === 'groom' ? data.groom : data.bride;

  return (
    <section id="giftbox" ref={ref} className="py-24 section-cream">
      <div className="container-custom">

        <div className="text-center mb-12">
          <span className="section-eyebrow">Wedding Gift</span>
          <h2 className="section-title">Hộp Mừng Cưới</h2>
          <p className="mt-2" style={{ color: 'var(--text-mid)', fontSize: 'var(--fs-sm)' }}>
            Sự hiện diện của bạn là niềm vinh hạnh lớn nhất 💕
          </p>
        </div>

        <div className={`max-w-sm mx-auto animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          {/* Tab */}
          <div className="flex mb-6 p-1 rounded-full" style={{ background: 'rgba(212,136,122,0.1)', border: '1px solid var(--border)' }}>
            {(['groom', 'bride'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 rounded-full font-medium text-sm transition-all"
                style={activeTab === tab
                  ? { background: 'var(--primary)', color: 'white', boxShadow: 'var(--shadow-primary)' }
                  : { color: 'var(--text-mid)', background: 'transparent' }
                }
              >
                {tab === 'groom' ? 'Chú Rể' : 'Cô Dâu'}
              </button>
            ))}
          </div>

          {/* QR Box */}
          <div className="qr-box">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'var(--primary-light)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" style={{ color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-cormorant text-lg italic" style={{ color: 'var(--primary)' }}>{person.shortName}</p>
                <p className="text-xs" style={{ color: 'var(--text-light)' }}>{activeTab === 'groom' ? 'Chú Rể' : 'Cô Dâu'}</p>
              </div>
            </div>

            <div className="qr-code">
              <img
                src={person.bank.qrCode}
                alt={`QR Code ${person.shortName}`}
                width={164}
                height={164}
                onError={e => {
                  (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=164x164&data=${encodeURIComponent(person.bank.number)}`;
                }}
              />
            </div>

            <div className="bank-info mt-5">
              <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{person.bank.bankName}</p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-mid)' }}>{person.bank.name}</p>
              <div className="bank-number">
                <span className="font-mono text-base font-bold" style={{ color: 'var(--text-dark)', letterSpacing: '0.06em' }}>
                  {person.bank.number}
                </span>
                <button onClick={() => copy(person.bank.number)} className="copy-btn" title="Sao chép số tài khoản">
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
