/**
 * Reveal engine — một IntersectionObserver duy nhất cho toàn trang.
 *
 * Component chỉ cần gắn `data-reveal="up | fade | left | right | scale | mask | blur"`,
 * engine tự gắn class `is-revealed` khi phần tử vào khung nhìn.
 *
 * Ưu điểm so với việc observe cả <section>: mỗi phần tử reveal đúng lúc nó
 * thực sự xuất hiện, nên các section cao (story, album) không bị "chạy hết"
 * animation ngay khi mép trên section chạm viewport.
 *
 * Stagger được tính theo *đợt* (batch): các phần tử cùng lọt vào viewport
 * trong một tick sẽ nhận delay tăng dần theo thứ tự trong DOM.
 */

const REVEAL_ATTR = 'data-reveal';
const REVEALED_CLASS = 'is-revealed';
const DEFAULT_STAGGER = 0.09;
const MAX_STAGGER_DELAY = 0.45;

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Bước stagger có thể tuỳ biến qua `data-reveal-stagger` trên phần tử cha gần nhất. */
function staggerStepFor(element: Element) {
  const group = element.closest<HTMLElement>('[data-reveal-stagger]');
  const parsed = Number(group?.dataset.revealStagger);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_STAGGER;
}

function markRevealed(element: HTMLElement, delaySeconds: number) {
  element.style.setProperty('--reveal-delay', `${delaySeconds.toFixed(3)}s`);
  element.classList.add(REVEALED_CLASS);
}

/**
 * Khởi động engine. Trả về hàm dọn dẹp.
 * Gọi một lần duy nhất ở tầng App.
 */
export function startRevealEngine(): () => void {
  const targets = () => document.querySelectorAll<HTMLElement>(
    `[${REVEAL_ATTR}]:not(.${REVEALED_CLASS})`,
  );

  // Không có animation: hiện toàn bộ nội dung ngay, vẫn theo dõi DOM mới.
  if (prefersReducedMotion()) {
    const revealAll = () => targets().forEach(el => el.classList.add(REVEALED_CLASS));
    revealAll();
    const mutationObserver = new MutationObserver(revealAll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    return () => mutationObserver.disconnect();
  }

  const observer = new IntersectionObserver(
    entries => {
      const entering = entries
        .filter(entry => entry.isIntersecting)
        // Theo thứ tự DOM để stagger chạy từ trên xuống, không phụ thuộc thứ tự callback.
        .sort((a, b) => (
          a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        ));

      entering.forEach((entry, index) => {
        const element = entry.target as HTMLElement;
        const delay = Math.min(index * staggerStepFor(element), MAX_STAGGER_DELAY);
        markRevealed(element, delay);
        observer.unobserve(element);
      });
    },
    {
      // Kích hoạt khi phần tử đã vào khoảng 12% dưới của viewport → cảm giác "đúng lúc".
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12,
    },
  );

  const observeNew = () => targets().forEach(element => observer.observe(element));
  observeNew();

  // Bắt các phần tử render sau (lazy section, modal, danh sách lời chúc realtime…).
  // Gom nhiều mutation vào một lần quét mỗi frame — nếu không, mỗi lần React
  // đổi DOM lại kéo theo một querySelectorAll trên toàn tài liệu.
  let scanFrame = 0;
  const scheduleScan = () => {
    if (scanFrame) return;
    scanFrame = requestAnimationFrame(() => {
      scanFrame = 0;
      observeNew();
    });
  };

  const mutationObserver = new MutationObserver(scheduleScan);
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  return () => {
    if (scanFrame) cancelAnimationFrame(scanFrame);
    observer.disconnect();
    mutationObserver.disconnect();
  };
}
