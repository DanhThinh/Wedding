import { useState } from 'react';
import { useWedding } from '../hooks/useWedding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function GiftBoxSection() {
  const { data, showToast } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copy thành công!', 'success');
    } catch {
      showToast('Không thể copy. Vui lòng thử lại!', 'error');
    }
  };

  const currentPerson = activeTab === 'groom' ? data.groom : data.bride;

  return (
    <section id="giftbox" ref={ref} className="py-20 bg-gradient-to-b from-white to-primary/5">
      <div className="container-custom">
        <h2 className="section-title">Hộp Mừng Cưới</h2>

        <div className={`max-w-md mx-auto animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          {/* Tab Buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab('groom')}
              className={`flex-1 py-3 px-4 rounded-full font-medium transition-all ${
                activeTab === 'groom'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Chú Rể
            </button>
            <button
              onClick={() => setActiveTab('bride')}
              className={`flex-1 py-3 px-4 rounded-full font-medium transition-all ${
                activeTab === 'bride'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Cô Dâu
            </button>
          </div>

          {/* QR Box */}
          <div className="qr-box">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bellota text-lg text-primary">{currentPerson.shortName}</p>
                <p className="text-sm text-gray-500">{activeTab === 'groom' ? 'Chú Rể' : 'Cô Dâu'}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="qr-code bg-white p-4">
              <img
                src={currentPerson.bank.qrCode}
                alt={`QR Code ${currentPerson.shortName}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentPerson.bank.number)}`;
                }}
              />
            </div>

            {/* Bank Info */}
            <div className="bank-info mt-6">
              <p className="text-gray-600 font-medium">{currentPerson.bank.bankName}</p>
              <p className="text-sm text-gray-500 mb-3">{currentPerson.bank.name}</p>
              
              <div className="bank-number">
                <span className="font-mono text-lg font-semibold">{currentPerson.bank.number}</span>
                <button
                  onClick={() => copyToClipboard(currentPerson.bank.number)}
                  className="copy-btn"
                  title="Sao chép số tài khoản"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Thank you note */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Sự hiện diện của bạn là niềm vinh hạnh lớn nhất của chúng mình 💕
          </p>
        </div>
      </div>
    </section>
  );
}
