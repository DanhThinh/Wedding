import { useEffect, useRef, useCallback } from 'react';

interface ConfettiBurstProps {
  /** Kích hoạt confetti khi true */
  active: boolean;
  /** Số lượng hạt confetti */
  particleCount?: number;
  /** Thời gian tồn tại (ms), sau đó tự ẩn */
  duration?: number;
  /** Màu sắc confetti */
  colors?: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  fadeSpeed: number;
  shape: 'rect' | 'circle' | 'heart';
}

/**
 * Hiệu ứng confetti bùng nổ phủ toàn màn hình.
 * Chỉ hoạt động khi `active = true`, tự dọn sau `duration`.
 */
export default function ConfettiBurst({
  active,
  particleCount = 150,
  duration = 5000,
  colors = [
    '#D4887A', '#C9956F', '#F3C5C0', '#EDB7B1',
    '#FFD700', '#FF6B6B', '#FF69B4', '#FFA07A',
    '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C',
  ],
}: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasTriggered = useRef(false);

  const createParticle = useCallback(
    (width: number, height: number): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 10;
      const shapes: Particle['shape'][] = ['rect', 'circle', 'heart'];

      return {
        x: width / 2 + (Math.random() - 0.5) * width * 0.3,
        y: height * 0.45 + (Math.random() - 0.5) * height * 0.2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5 - Math.random() * 4,
        gravity: 0.12 + Math.random() * 0.08,
        size: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        opacity: 1,
        fadeSpeed: 0.002 + Math.random() * 0.003,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
    },
    [colors]
  );

  useEffect(() => {
    if (!active || hasTriggered.current) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    hasTriggered.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let rafId = 0;
    let running = true;

    const particles: Particle[] = Array.from({ length: particleCount }, () =>
      createParticle(width, height)
    );

    const drawHeart = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number
    ) => {
      const s = size * 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y - s * 0.3, x - s, y - s * 0.3, x - s, y + s * 0.1);
      ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s, x, y + s * 1.2);
      ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.6, x + s, y + s * 0.1);
      ctx.bezierCurveTo(x + s, y - s * 0.3, x, y - s * 0.3, x, y + s * 0.3);
      ctx.fill();
    };

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;

      for (const p of particles) {
        if (p.opacity <= 0) continue;
        aliveCount++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.fadeSpeed;

        if (p.opacity <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        switch (p.shape) {
          case 'rect':
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.5);
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'heart':
            drawHeart(ctx, 0, 0, p.size);
            break;
        }

        ctx.restore();
      }

      if (aliveCount > 0) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    rafId = requestAnimationFrame(tick);

    // Dọn dẹp sau duration
    const timeout = setTimeout(() => {
      running = false;
      cancelAnimationFrame(rafId);
    }, duration);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, particleCount, duration, createParticle]);

  // Reset trigger khi active chuyển từ true → false
  useEffect(() => {
    if (!active) {
      hasTriggered.current = false;
    }
  }, [active]);

  if (!active) return null;

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
        zIndex: 9999,
      }}
    />
  );
}
