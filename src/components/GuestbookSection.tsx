import { useState, useRef, useEffect } from 'react';
import { useWedding } from '../hooks/weddingContext';
import { trackEvent } from '../lib/analytics';
import RevealTitle from './RevealTitle';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/reveal';

export default function GuestbookSection() {
  const { data, wishes, addWish, showToast, guestbookMode } = useWedding();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const wishesListRef = useRef<HTMLDivElement>(null);

  // Form shake animation on error
  const shakeForm = () => {
    if (!formRef.current || prefersReducedMotion()) return;
    gsap.fromTo(formRef.current,
      { x: -10 },
      { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power1.inOut' }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
      shakeForm();
      return;
    }
    setIsSubmitting(true);
    
    const saveMode = await addWish(name.trim(), message.trim());
    if (!saveMode) {
      setIsSubmitting(false);
      return;
    }
    void trackEvent('wish_submit', {
      mode: saveMode,
      source: 'section',
    });
    
    // Success animation
    if (formRef.current && !prefersReducedMotion()) {
      gsap.fromTo(formRef.current,
        { scale: 1 },
        { scale: 0.98, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }
      );
    }
    
    setName('');
    setMessage('');
    setIsSubmitting(false);
    
    // Scroll to top of wishes list
    if (wishesListRef.current) {
      wishesListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Animate new wishes
  useEffect(() => {
    if (!prefersReducedMotion() && wishesListRef.current && wishes.length > 0) {
      const firstWish = wishesListRef.current.querySelector('.wish-item:first-child');
      if (firstWish) {
        gsap.fromTo(firstWish,
          { opacity: 0, x: -20, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
        );
      }
    }
  }, [wishes.length]);

  return (
    <section id="guestbook" className="py-24 section-white guestbook-section">
      <div className="container-custom">

        <div className="text-center mb-12">
          <span className="section-eyebrow" data-reveal="up">Leave a Message</span>
          <RevealTitle text="Sổ Lưu Bút" className="section-title" />
          <p className="section-subtitle" data-reveal="up">
            Gửi những lời chúc tốt đẹp đến chúng mình
          </p>
          <div className="guestbook-realtime-badge" data-reveal="up">
            <span className="realtime-dot" />
            {guestbookMode === 'firestore'
              ? `Cập nhật trực tiếp · ${wishes.length} lời chúc`
              : guestbookMode === 'loading'
                ? 'Đang kết nối Firebase'
                : `Lưu trên thiết bị · ${wishes.length} lời chúc`}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* Form */}
          <div data-reveal="left">
            <div className="guestbook-form-wrap" data-pointer-fx="glow">
              <div className="guestbook-form-header">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: 'var(--primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                </svg>
                <div>
                  <p className="font-cormorant text-xl italic mb-1" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    Gửi lời yêu thương
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-mid)' }}>
                    Mỗi lời chúc đều rất ý nghĩa với chúng mình ✦
                  </p>
                </div>
              </div>
              
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="gb-name">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ display: 'inline', marginRight: '6px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Tên của bạn *
                  </label>
                  <input
                    id="gb-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-input"
                    placeholder="Nhập tên của bạn"
                    required
                    autoComplete="name"
                    maxLength={80}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="gb-msg">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ display: 'inline', marginRight: '6px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                    </svg>
                    Lời chúc *
                  </label>
                  <textarea
                    id="gb-msg"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="form-textarea"
                    placeholder="Nhập lời chúc của bạn..."
                    required
                    maxLength={500}
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
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed guestbook-submit-btn"
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
                    <>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                      </svg>
                      <span>Gửi lời chúc ✦</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Wishes list */}
          <div data-reveal="right">
            <div ref={wishesListRef} className="wishes-list-container">
              {wishes.length === 0 ? (
                <div className="wishes-empty-state">
                  <svg className="w-14 h-14 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" style={{ color: 'var(--blush-mid)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                  <p className="font-cormorant text-xl italic" style={{ color: 'var(--text-mid)' }}>Chưa có lời chúc nào</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-light)' }}>Hãy là người đầu tiên!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishes.map((w, i) => (
                    <div key={w.id ?? `${w.date}-${i}`} className="wish-item">
                      <div className="wish-author">{w.name}</div>
                      <div className="wish-content">{w.message}</div>
                      <div className="wish-footer">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>{new Date(w.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
