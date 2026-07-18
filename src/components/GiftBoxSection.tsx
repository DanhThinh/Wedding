import { useState, useRef, useEffect } from 'react';
import { useWedding } from '../hooks/weddingContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import gsap from 'gsap';
import { hasGiftDetails } from '../lib/weddingState';

export default function GiftBoxSection() {
  const { data, showToast } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const [qrFailed, setQrFailed] = useState<Record<'groom' | 'bride', boolean>>({
    groom: false,
    bride: false,
  });
  const qrBoxRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const bankInfoRef = useRef<HTMLDivElement>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copy thành công!', 'success');
      
      // Success animation
      if (bankInfoRef.current) {
        gsap.fromTo(bankInfoRef.current,
          { scale: 1 },
          { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }
        );
      }
    } catch {
      showToast('Không thể copy!', 'error');
    }
  };

  // Tab switch animation
  useEffect(() => {
    if (!qrBoxRef.current) return;
    
    const tl = gsap.timeline();
    
    // Fade out
    tl.to([qrCodeRef.current, bankInfoRef.current], {
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: 'power2.in',
    })
    // Fade in
    .to([qrCodeRef.current, bankInfoRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'back.out(1.5)',
    });
  }, [activeTab]);

  // QR code scan line animation
  useEffect(() => {
    if (!isVisible || !qrCodeRef.current) return;
    
    const scanLine = qrCodeRef.current.querySelector('.qr-scan-line');
    if (!scanLine) return;
    
    gsap.to(scanLine, {
      y: 164,
      duration: 2,
      repeat: -1,
      ease: 'none',
      repeatDelay: 1,
    });
  }, [isVisible, activeTab]);

  const person = activeTab === 'groom' ? data.groom : data.bride;
  const hasBankDetails = Boolean(person.bank.bankName && person.bank.number);
  const hasQrImage = Boolean(person.bank.qrCode) && !qrFailed[activeTab];

  if (!hasGiftDetails(data)) return null;

  return (
    <section id="giftbox" ref={ref} className="py-24 section-cream giftbox-section">
      <div className="container-custom">

        <div className={`text-center mb-12 animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <span className="section-eyebrow">Wedding Gift</span>
          <h2 className="section-title">Hộp Mừng Cưới</h2>
          <p className="section-subtitle">
            Sự hiện diện của bạn là niềm vinh hạnh lớn nhất
          </p>
        </div>

        <div className={`max-w-sm mx-auto animate-on-scroll ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.15s' }}>
          {/* Tab with gradient background */}
          <div className="giftbox-tab-container">
            <div className="giftbox-tab-bg" style={{
              transform: activeTab === 'groom' ? 'translateX(0)' : 'translateX(100%)',
            }} />
            {(['groom', 'bride'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`giftbox-tab ${activeTab === tab ? 'active' : ''}`}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {tab === 'groom' ? 'Chú Rể' : 'Cô Dâu'}
              </button>
            ))}
          </div>

          {/* QR Box with 3D effect */}
          <div ref={qrBoxRef} className="qr-box">
            {/* Decorative corners */}
            <div className="qr-box-corner tl" />
            <div className="qr-box-corner tr" />
            <div className="qr-box-corner bl" />
            <div className="qr-box-corner br" />
            
            {/* Header */}
            <div className="qr-box-header">
              <div className="qr-box-avatar">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" style={{ color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-cormorant text-lg italic" style={{ color: 'var(--primary)', fontWeight: 600 }}>{person.shortName}</p>
                <p className="text-xs" style={{ color: 'var(--text-light)' }}>{activeTab === 'groom' ? 'Chú Rể' : 'Cô Dâu'}</p>
              </div>
            </div>

            {/* QR Code with scan animation */}
            <div ref={qrCodeRef} className="qr-code">
              <div className="qr-code-inner">
                {hasQrImage ? (
                  <img
                    src={person.bank.qrCode}
                    alt={`QR Code ${person.shortName}`}
                    width={164}
                    height={164}
                    onError={() => {
                      setQrFailed(prev => ({ ...prev, [activeTab]: true }));
                    }}
                  />
                ) : (
                  <div
                    className="qr-placeholder"
                    role="img"
                    aria-label={`QR ${person.shortName} chưa được cập nhật`}
                  >
                    <span className="qr-placeholder-mark">{person.initial}</span>
                    <span className="qr-placeholder-text">QR sẽ cập nhật</span>
                  </div>
                )}
                {/* Scan line effect */}
                {hasQrImage && <div className="qr-scan-line" />}
              </div>
              <p className="qr-code-hint">
                {hasQrImage
                  ? 'Quét mã để chuyển khoản'
                  : hasBankDetails ? 'Có thể dùng số tài khoản bên dưới' : 'Thông tin sẽ được cập nhật'}
              </p>
            </div>

            {/* Bank Info */}
            <div ref={bankInfoRef} className="bank-info">
              <div className="bank-info-row">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                <div>
                  <p className="bank-info-label">Ngân hàng</p>
                  <p className="bank-info-value">{person.bank.bankName || 'Chưa cập nhật'}</p>
                </div>
              </div>
              
              <div className="bank-info-row">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <div>
                  <p className="bank-info-label">Chủ tài khoản</p>
                  <p className="bank-info-value">{person.bank.name}</p>
                </div>
              </div>
              
              <div className="bank-number">
                <div className="bank-number-inner">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: 'var(--primary)', marginRight: '8px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                  </svg>
                  <span className="font-mono text-base font-bold" style={{ color: 'var(--text-dark)', letterSpacing: '0.08em' }}>
                    {person.bank.number || 'Chưa cập nhật'}
                  </span>
                </div>
                <button
                  onClick={() => copy(person.bank.number)}
                  className="copy-btn"
                  title="Sao chép số tài khoản"
                  disabled={!hasBankDetails}
                >
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Decorative pattern */}
            <div className="qr-box-pattern" aria-hidden="true">
              <svg width="100%" height="40" viewBox="0 0 200 40" fill="none">
                <path d="M0 20 Q 50 10, 100 20 T 200 20" stroke="var(--blush-mid)" strokeWidth="1" opacity="0.3"/>
                <path d="M0 25 Q 50 15, 100 25 T 200 25" stroke="var(--primary)" strokeWidth="0.5" opacity="0.2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
