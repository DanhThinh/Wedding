import { useWedding } from '../hooks/useWedding';

export default function QuickActions() {
  const { openModal } = useWedding();

  return (
    <nav className="quick-actions lg:hidden" aria-label="Quick actions">
      <button
        className="quick-action-btn"
        onClick={() => openModal('guestbook')}
        aria-label="Gửi lời chúc"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
        <span>Lời chúc</span>
      </button>

      <button
        className="quick-action-btn"
        onClick={() => document.getElementById('giftbox')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Mừng cưới"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Mừng cưới</span>
      </button>
    </nav>
  );
}
