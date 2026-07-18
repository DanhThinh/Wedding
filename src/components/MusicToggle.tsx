import { useWedding } from '../hooks/weddingContext';

/**
 * Nút nhạc nền nổi (fixed) ở góc phải trên cùng.
 * Khi nhạc đang phát, icon quay nhẹ. Bấm để bật/tắt nhạc.
 */
export default function MusicToggle() {
  const { isMusicPlaying, toggleMusic } = useWedding();

  return (
    <button
      onClick={toggleMusic}
      className={`music-toggle ${isMusicPlaying ? 'playing' : ''}`}
      aria-label={isMusicPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      title={isMusicPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
    >
      {isMusicPlaying ? (
        /* Icon nốt nhạc đang phát */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ) : (
        /* Icon nốt nhạc tắt (có gạch chéo) */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
          <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2.5" stroke="currentColor" />
        </svg>
      )}
    </button>
  );
}
