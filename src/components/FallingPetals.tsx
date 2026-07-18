import { useEffect, useRef } from 'react';

interface FallingPetalsProps {
  /** Số lượng cánh hoa trôi liên tục */
  count?: number;
  /** Màu cánh hoa (mảng để tạo sự đa dạng) */
  colors?: string[];
  /** Bật chế độ "bùng nổ" lúc đầu rồi giảm dần về count */
  burst?: boolean;
  /** z-index của canvas */
  zIndex?: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  sway: number;
  swaySpeed: number;
  angle: number;
  spin: number;
  color: string;
  opacity: number;
}

/**
 * Hiệu ứng cánh hoa rơi nhẹ nhàng phủ toàn màn hình.
 * Dùng canvas để tối ưu hiệu năng, tự tạm dừng khi tab ẩn,
 * và tôn trọng prefers-reduced-motion.
 */
export default function FallingPetals({
  count = 26,
  colors = ['#F3C5C0', '#EDB7B1', '#F7D8D4', '#E6A39B', '#FBE3E0'],
  burst = false,
  zIndex = 5,
}: FallingPetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let rafId = 0;
    let running = true;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const createPetal = (initial = false): Petal => ({
      x: rand(0, width),
      y: initial ? rand(-height, height) : rand(-40, -10),
      size: rand(8, 16),
      speedY: rand(0.6, 1.6),
      speedX: rand(-0.4, 0.4),
      sway: rand(0, Math.PI * 2),
      swaySpeed: rand(0.01, 0.03),
      angle: rand(0, Math.PI * 2),
      spin: rand(-0.02, 0.02),
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: rand(0.5, 0.9),
    });

    const baseCount = count;
    const startCount = burst ? Math.round(count * 2.4) : count;
    let petals: Petal[] = Array.from({ length: startCount }, () =>
      createPetal(true)
    );

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      // Hình cánh hoa: hai đường cong bezier tạo dáng giọt/cánh
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.5, p.size, 0, p.size * 0.4, p.size);
      ctx.bezierCurveTo(0, p.size * 1.3, -p.size * 0.4, p.size * 0.6, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (const p of petals) {
        p.y += p.speedY;
        p.sway += p.swaySpeed;
        p.x += p.speedX + Math.sin(p.sway) * 0.6;
        p.angle += p.spin;

        drawPetal(p);

        // Reset khi rơi khỏi màn hình
        if (p.y > height + 30) {
          Object.assign(p, createPetal(false));
        }
      }

      // Nếu đang ở chế độ burst, giảm dần số cánh hoa về mức nền
      if (petals.length > baseCount) {
        petals = petals.filter(
          (p, i) => !(p.y > height + 30 && i % 2 === 0)
        );
      }

      rafId = requestAnimationFrame(tick);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [count, colors, burst]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
      }}
    />
  );
}
