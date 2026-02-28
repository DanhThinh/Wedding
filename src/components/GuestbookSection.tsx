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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    addWish(name.trim(), message.trim());
    setName('');
    setMessage('');
    setIsSubmitting(false);
  };

  const handleSuggestedWish = (wish: string) => {
    setMessage(wish);
  };

  return (
    <section id="guestbook" ref={ref} className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="section-title">Sổ Lưu Bút</h2>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <div className={`animate-on-scroll animate-left ${isVisible ? 'visible' : ''}`}>
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6">
              <div className="form-group">
                <label className="form-label">Tên của bạn *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lời chúc *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea"
                  placeholder="Nhập lời chúc của bạn..."
                  required
                />
              </div>

              {/* Suggested Wishes */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Gợi ý:</p>
                <div className="flex flex-wrap">
                  {data.suggestedWishes.slice(0, 4).map((wish, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestedWish(wish)}
                      className="suggested-wish"
                    >
                      {wish}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang gửi...
                  </span>
                ) : (
                  'Gửi lời chúc'
                )}
              </button>
            </form>
          </div>

          {/* Wishes List */}
          <div className={`animate-on-scroll animate-right ${isVisible ? 'visible' : ''}`}>
            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
              {wishes.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p>Chưa có lời chúc nào</p>
                  <p className="text-sm">Hãy là người đầu tiên gửi lời chúc!</p>
                </div>
              ) : (
                wishes.map((wish, index) => (
                  <div key={index} className="wish-item">
                    <div className="wish-author">{wish.name}</div>
                    <div className="wish-content">{wish.message}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(wish.date).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
