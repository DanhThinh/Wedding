import { useState, useEffect, useId, useRef } from 'react';
import { useWedding } from '../hooks/weddingContext';
import { trackEvent } from '../lib/analytics';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusableElements = () => Array.from(
      modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        modalRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="modal-box"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 id={titleId} className="font-bellota text-2xl text-primary">{title}</h3>
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
    const saveMode = await addWish(name.trim(), message.trim());
    if (saveMode) {
      void trackEvent('wish_submit', {
        mode: saveMode,
        source: 'modal',
      });
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
          <label className="form-label" htmlFor="modal-wish-name">Tên của bạn *</label>
          <input
            id="modal-wish-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Nhập tên của bạn"
            autoComplete="name"
            maxLength={80}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="modal-wish-message">Lời chúc *</label>
          <textarea
            id="modal-wish-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-textarea"
            placeholder="Nhập lời chúc của bạn..."
            maxLength={500}
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
