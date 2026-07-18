import { useState, useEffect, useRef } from 'react';
import { useWedding } from '../hooks/weddingContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Focus trap
      modalRef.current?.focus();
    }

    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={modalRef}
        className="modal-box"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bellota text-2xl text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function GuestbookModal() {
  const { modals, closeModal, data, addWish, showToast } = useWedding();
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
    const ok = await addWish(name.trim(), message.trim());
    if (ok) {
      setName('');
      setMessage('');
      closeModal('guestbook');
    }
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={modals.guestbook}
      onClose={() => closeModal('guestbook')}
      title="Gửi Lời Chúc"
    >
      <form onSubmit={handleSubmit}>
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
                onClick={() => setMessage(wish)}
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
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi lời chúc'}
        </button>
      </form>
    </Modal>
  );
}
