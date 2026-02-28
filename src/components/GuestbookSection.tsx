import { useState } from 'react';
import { useWedding } from '../hooks/useWedding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function GuestbookSection() {
  const { data, wishes, addWish, showToast } = useWedding();
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    addWish(name.trim(), message.trim());
    setName(''); setMessage('');
    setIsSubmitting(false);
  };

  return (
    <section id="guestbook" ref={ref} className="py-24 section-white">
      <div className="container-custom">

        <div className="text-center mb-12">
          <span className="section-eyebrow">Leave a Message</span>
          <h2 className="section-title">Sổ Lưu Bút</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* Form */}
          <div className={`animate-on-scroll animate-left ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
            <div className="guestbook-form-wrap">
              <p className="font-cormorant text-xl italic mb-6" style={{ color: 'var(--primary)' }}>
                Gửi lời yêu thương đến cặp đôi ✦
              </p>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="gb-name">Tên của bạn *</label>
                  <input
                    id="gb-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-input"
                    placeholder="Nhập tên của bạn"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="gb-msg">Lời chúc *</label>
                  <textarea
                    id="gb-msg"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="form-textarea"
                    placeholder="Nhập lời chúc của bạn..."
                    required
                  />
                </div>

                {/* Suggested wishes */}
                <div className="mb-5">
                  <p className="form-label mb-2">Gợi ý nhanh:</p>
                  <div className="flex flex-wrap gap-1">
                    {data.suggestedWishes.slice(0, 4).map((w, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setMessage(w)}
                        className="suggested-wish"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ width: '100%', display: 'flex' }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Đang gửi…
                    </>
                  ) : (
                    <span>Gửi lời chúc ✦</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Wishes list */}
          <div className={`animate-on-scroll animate-right ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <div className="max-h-[520px] overflow-y-auto space-y-3 pr-1">
              {wishes.length === 0 ? (
                <div className="text-center py-16" style={{ color: 'var(--text-light)' }}>
                  <svg className="w-14 h-14 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" style={{ color: 'var(--blush-mid)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                  <p className="font-cormorant text-xl italic" style={{ color: 'var(--text-mid)' }}>Chưa có lời chúc nào</p>
                  <p className="text-sm mt-1">Hãy là người đầu tiên!</p>
                </div>
              ) : wishes.map((w, i) => (
                <div key={i} className="wish-item">
                  <div className="wish-author">{w.name}</div>
                  <div className="wish-content">{w.message}</div>
                  <div className="text-xs mt-2" style={{ color: 'var(--text-light)' }}>
                    {new Date(w.date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
