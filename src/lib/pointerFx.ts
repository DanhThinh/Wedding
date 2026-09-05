/**
 * Pointer FX — ánh sáng đi theo con trỏ + nghiêng nhẹ cho thẻ nội dung.
 *
 * Chỉ chạy trên thiết bị có con trỏ chính xác (chuột/trackpad) và khi người dùng
 * không bật "giảm chuyển động". Trên mobile hoàn toàn không tốn gì.
 *
 * Cách dùng: gắn `data-pointer-fx` lên phần tử, CSS đọc `--px`, `--py` (0–1)
 * và `--tilt-x`, `--tilt-y` (deg).
 */

const MAX_TILT_DEG = 3;

export function startPointerFx(): () => void {
  if (typeof window === 'undefined') return () => {};

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return () => {};

  let frame = 0;
  let pending: { element: HTMLElement; x: number; y: number } | null = null;

  const flush = () => {
    frame = 0;
    if (!pending) return;
    const { element, x, y } = pending;
    pending = null;
    element.style.setProperty('--px', x.toFixed(4));
    element.style.setProperty('--py', y.toFixed(4));
    element.style.setProperty('--tilt-y', `${((x - 0.5) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
    element.style.setProperty('--tilt-x', `${((0.5 - y) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
  };

  const handleMove = (event: PointerEvent) => {
    const element = (event.target as Element | null)?.closest<HTMLElement>('[data-pointer-fx]');
    if (!element) return;
    const rect = element.getBoundingClientRect();
    pending = {
      element,
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
    // Gom nhiều pointermove vào một lần ghi style mỗi frame.
    if (!frame) frame = requestAnimationFrame(flush);
  };

  const handleLeave = (event: PointerEvent) => {
    const element = (event.target as Element | null)?.closest<HTMLElement>('[data-pointer-fx]');
    if (!element) return;
    element.style.removeProperty('--tilt-x');
    element.style.removeProperty('--tilt-y');
  };

  document.addEventListener('pointermove', handleMove, { passive: true });
  document.addEventListener('pointerout', handleLeave, { passive: true });

  return () => {
    if (frame) cancelAnimationFrame(frame);
    document.removeEventListener('pointermove', handleMove);
    document.removeEventListener('pointerout', handleLeave);
  };
}
