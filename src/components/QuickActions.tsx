import { useWedding } from '../hooks/useWedding';

export default function QuickActions() {
  const { openModal } = useWedding();

  return (
    <div className="quick-actions">
      <button onClick={() => openModal('guestbook')}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="hidden sm:inline">Gửi lời chúc</span>
      </button>

      <a href="/rsvp" className="flex-1 max-w-[150px] flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-all">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span className="hidden sm:inline">Xác nhận</span>
      </a>

      <button onClick={() => {
        const giftSection = document.getElementById('giftbox');
        if (giftSection) {
          giftSection.scrollIntoView({ behavior: 'smooth' });
        }
      }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline">Mừng cưới</span>
      </button>
    </div>
  );
}
