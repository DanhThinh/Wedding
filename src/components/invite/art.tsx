/**
 * Bộ hoạ tiết SVG dùng riêng cho giao diện thiệp bản demo.
 * Vẽ bằng vector để không phụ thuộc file ảnh và luôn nét trên màn hình retina.
 */

/* ─────────────────────────────────────────────────────────────
   HOA LY MÀU NƯỚC (bìa thiệp)
   Một dải hoa duy nhất trải hết chiều ngang màn hình; hai nửa bìa
   cùng vẽ dải này nên đường nét khớp liền cho tới lúc tách đôi.
   ───────────────────────────────────────────────────────────── */

/** Một cánh hoa hướng lên, gốc tại (0,0). */
const PETAL = 'M0 0 C -11 -13, -12 -32, 0 -48 C 12 -32, 11 -13, 0 0 Z';
/** Cánh lớp trong, ngắn hơn để bông hoa dày dặn hơn. */
const PETAL_INNER = 'M0 0 C -8 -10, -8 -24, 0 -34 C 8 -24, 8 -10, 0 0 Z';

function Lily({ x, y, scale = 1, rotate = 0, opacity = 1 }: {
  x: number; y: number; scale?: number; rotate?: number; opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d={PETAL} fill="url(#lilyPetal)" stroke="#e6a3b8" strokeWidth="0.7" strokeOpacity="0.55" />
          <path d="M0 -3 L0 -42" stroke="#dd8fa9" strokeWidth="0.6" strokeOpacity="0.5" fill="none" />
        </g>
      ))}
      {[30, 90, 150, 210, 270, 330].map((angle) => (
        <g key={`inner-${angle}`} transform={`rotate(${angle})`}>
          <path d={PETAL_INNER} fill="url(#lilyPetal)" stroke="#e6a3b8" strokeWidth="0.6" strokeOpacity="0.45" opacity="0.92" />
        </g>
      ))}
      {[-38, -14, 10, 34].map((angle, i) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d="M0 0 Q 2 -16, 1 -28" stroke="#c98a72" strokeWidth="1.1" fill="none" strokeOpacity="0.75" />
          <ellipse cx="1" cy="-30" rx="2.6" ry="4" fill="#b5714f" opacity="0.85" transform={`rotate(${i * 8 - 12} 1 -30)`} />
        </g>
      ))}
      <circle r="4.2" fill="#f4c9d6" />
      <circle r="2" fill="#e2a2b6" />
    </g>
  );
}

function Bud({ x, y, rotate = 0, scale = 1 }: { x: number; y: number; rotate?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0 C -6 -10, -6 -26, 0 -34 C 6 -26, 6 -10, 0 0 Z" fill="url(#lilyPetal)" stroke="#e6a3b8" strokeWidth="0.7" strokeOpacity="0.5" />
      <path d="M0 -2 L0 -30" stroke="#dd8fa9" strokeWidth="0.6" strokeOpacity="0.45" />
    </g>
  );
}

function Leaf({ x, y, rotate = 0, scale = 1, tone = 'a' }: {
  x: number; y: number; rotate?: number; scale?: number; tone?: 'a' | 'b';
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0 0 C 22 -14, 54 -12, 74 2 C 52 18, 20 16, 0 0 Z"
        fill={tone === 'a' ? 'url(#leafA)' : 'url(#leafB)'}
        stroke="#8fae7f"
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />
      <path d="M2 1 C 24 -2, 50 0, 72 2" stroke="#7d9d6e" strokeWidth="0.7" fill="none" strokeOpacity="0.55" />
    </g>
  );
}

/**
 * Dải hoa ngang của bìa thiệp: cụm hoa ly toả sang hai bên, chừa khoảng giữa
 * cho con dấu sáp — bố cục lấy theo khung hình mở đầu của video demo.
 */
export function FloralBand({ className }: { className?: string }) {
  return (
    // Toạ độ 430×300 = đúng bề ngang một máy điện thoại, nên bố cục giữ nguyên
    // tỉ lệ như demo ở mọi kích thước màn hình.
    <svg className={className} viewBox="0 0 430 300" preserveAspectRatio="xMidYMid meet" role="presentation" aria-hidden="true">
      <defs>
        <radialGradient id="lilyPetal" cx="50%" cy="90%" r="90%">
          <stop offset="0%" stopColor="#fdf1f4" />
          <stop offset="45%" stopColor="#f8d7e0" />
          <stop offset="100%" stopColor="#eeadc2" />
        </radialGradient>
        <linearGradient id="leafA" x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%" stopColor="#cfe0c2" />
          <stop offset="100%" stopColor="#9dba8a" />
        </linearGradient>
        <linearGradient id="leafB" x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%" stopColor="#dfeada" />
          <stop offset="100%" stopColor="#aecb9c" />
        </linearGradient>
      </defs>

      {/* Cành: một nhánh chạy từ mép trái lên cụm hoa chính, một nhánh toả sang phải */}
      <g stroke="#a9c39a" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M-14 268 C 40 250, 84 214, 106 168" />
        <path d="M22 292 C 84 276, 136 250, 176 216" />
        <path d="M300 176 C 344 190, 392 206, 444 210" />
        <path d="M292 218 C 336 238, 384 258, 440 262" />
      </g>

      {/* Lá: chùm nhỏ dưới cụm trái, chùm lớn trải sang mép phải */}
      <Leaf x={-6} y={266} rotate={-26} scale={0.62} tone="a" />
      <Leaf x={44} y={294} rotate={-14} scale={0.5} tone="b" />
      <Leaf x={150} y={232} rotate={-30} scale={0.44} tone="b" />

      <Leaf x={314} y={182} rotate={8} scale={0.68} tone="b" />
      <Leaf x={330} y={228} rotate={22} scale={0.58} tone="a" />
      <Leaf x={376} y={166} rotate={-14} scale={0.5} tone="a" />
      <Leaf x={368} y={252} rotate={16} scale={0.46} tone="b" />

      <Bud x={168} y={92} rotate={-28} scale={0.6} />
      <Bud x={286} y={112} rotate={30} scale={0.5} />
      <Bud x={158} y={244} rotate={-14} scale={0.44} />

      {/* Hoa: một bông lớn bên trái, cụm ba bông nhỏ dần bên phải */}
      <Lily x={74} y={126} scale={1.28} rotate={-12} />
      <Lily x={128} y={222} scale={0.62} rotate={18} opacity={0.95} />

      <Lily x={318} y={148} scale={0.9} rotate={14} />
      <Lily x={268} y={80} scale={0.58} rotate={-22} opacity={0.94} />
      <Lily x={296} y={232} scale={0.48} rotate={26} opacity={0.9} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   CON DẤU SÁP (bìa thiệp)
   ───────────────────────────────────────────────────────────── */

/** Viền sáp gợn sóng — 24 đỉnh với bán kính so le. */
const SEAL_EDGE = (() => {
  const points: string[] = [];
  const steps = 24;
  for (let i = 0; i < steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    const radius = 46 + (i % 2 === 0 ? 3.4 : -1.6) + Math.sin(i * 1.7) * 1.8;
    points.push(`${(50 + Math.cos(angle) * radius).toFixed(2)} ${(50 + Math.sin(angle) * radius).toFixed(2)}`);
  }
  return `M${points.join(' L')} Z`;
})();

export function WaxSeal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" role="presentation" aria-hidden="true">
      <defs>
        <radialGradient id="waxFill" cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#3f7a55" />
          <stop offset="55%" stopColor="#22563a" />
          <stop offset="100%" stopColor="#123723" />
        </radialGradient>
        <radialGradient id="waxGloss" cx="32%" cy="24%" r="46%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d={SEAL_EDGE} fill="url(#waxFill)" />
      <path d={SEAL_EDGE} fill="none" stroke="#0e2d1c" strokeWidth="1.1" strokeOpacity="0.5" />
      <circle cx="50" cy="50" r="37" fill="none" stroke="#8fc3a1" strokeWidth="0.9" strokeOpacity="0.42" />

      {/* Hoạ tiết hoa lá dập nổi ở giữa */}
      <g stroke="#a9d6ba" strokeOpacity="0.62" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <path d="M50 68 C 50 58, 50 44, 50 32" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M50 ${60 - i * 8} C 42 ${58 - i * 8}, 37 ${52 - i * 8}, 36 ${45 - i * 8}`} />
            <path d={`M50 ${60 - i * 8} C 58 ${58 - i * 8}, 63 ${52 - i * 8}, 64 ${45 - i * 8}`} />
          </g>
        ))}
        <circle cx="50" cy="30" r="3.2" />
      </g>

      <path d={SEAL_EDGE} fill="url(#waxGloss)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   ICON TIMELINE
   ───────────────────────────────────────────────────────────── */

export type TimelineIcon = 'car' | 'church' | 'arch' | 'cheers';

const iconProps = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function TimelineGlyph({ name, className }: { name: TimelineIcon; className?: string }) {
  if (name === 'car') {
    return (
      <svg className={className} {...iconProps} role="presentation" aria-hidden="true">
        <path d="M9 30h30v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1H15v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
        <path d="M11 30l3.4-8.6A3 3 0 0 1 17.2 19h13.6a3 3 0 0 1 2.8 2.4L37 30" />
        <path d="M16 25h16" />
        <circle cx="15" cy="34" r="1.6" />
        <circle cx="33" cy="34" r="1.6" />
        <path d="M18 19v-3h12v3" />
        <path d="M21 13l3-3 3 3" />
      </svg>
    );
  }

  if (name === 'church') {
    return (
      <svg className={className} {...iconProps} role="presentation" aria-hidden="true">
        <path d="M24 6v8" />
        <path d="M20.5 9.5h7" />
        <path d="M24 14l8 7v17H16V21z" />
        <path d="M16 25l-5 4v9h5" />
        <path d="M32 25l5 4v9h-5" />
        <path d="M24 27a3 3 0 0 1 3 3v8h-6v-8a3 3 0 0 1 3-3z" />
      </svg>
    );
  }

  if (name === 'arch') {
    return (
      <svg className={className} {...iconProps} role="presentation" aria-hidden="true">
        <path d="M14 40V24a10 10 0 0 1 20 0v16" />
        <path d="M14 24c3-2 6 2 9-1s6 1 9-2" />
        <path d="M11 40h26" />
        <circle cx="17" cy="18" r="1.4" />
        <circle cx="31" cy="20" r="1.4" />
        <circle cx="24" cy="13" r="1.4" />
      </svg>
    );
  }

  return (
    <svg className={className} {...iconProps} role="presentation" aria-hidden="true">
      <path d="M14 10l-2 8a6 6 0 0 0 6 7 6 6 0 0 0 6-7l-2-8z" />
      <path d="M34 10l2 8a6 6 0 0 1-6 7 6 6 0 0 1-6-7l2-8z" />
      <path d="M18 25v11" />
      <path d="M30 25v11" />
      <path d="M14 38h8" />
      <path d="M26 38h8" />
      <path d="M22 6l4 4" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   MÁY ẢNH CỔ (photobooth)
   ───────────────────────────────────────────────────────────── */

export function VintageCamera({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 190" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="camBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a97b52" />
          <stop offset="55%" stopColor="#8a5f3c" />
          <stop offset="100%" stopColor="#5e3f27" />
        </linearGradient>
        <linearGradient id="camWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c1946a" />
          <stop offset="100%" stopColor="#8d6544" />
        </linearGradient>
      </defs>

      {/* Chân máy ba chân, có thanh giằng ngang */}
      <g stroke="url(#camWood)" strokeWidth="4.5" strokeLinecap="round" fill="none">
        <path d="M60 92 L26 186" />
        <path d="M60 92 L94 186" />
        <path d="M60 92 L62 176" />
      </g>
      <path d="M40 146 L81 146" stroke="url(#camWood)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="92" r="6" fill="#6f4b2c" />

      {/* Hộp phim phía sau + xếp li ống thổi */}
      <rect x="14" y="26" width="30" height="56" rx="4" fill="#6f4b2c" />
      <g fill="url(#camBody)" stroke="#4b3018" strokeOpacity="0.35" strokeWidth="0.8">
        <path d="M44 30 L58 36 L58 74 L44 80 Z" />
        <path d="M58 36 L70 41 L70 70 L58 74 Z" />
      </g>

      {/* Thân máy chính */}
      <rect x="68" y="34" width="34" height="44" rx="5" fill="url(#camBody)" />
      <rect x="68" y="34" width="34" height="44" rx="5" fill="none" stroke="#4b3018" strokeOpacity="0.5" strokeWidth="1.4" />

      {/* Ống kính */}
      <circle cx="85" cy="56" r="14" fill="#3a2413" />
      <circle cx="85" cy="56" r="10" fill="#6b4a2c" />
      <circle cx="85" cy="56" r="5.6" fill="#17110b" />
      <circle cx="81.5" cy="52" r="2.2" fill="#ffffff" fillOpacity="0.55" />

      {/* Kính ngắm + tay bóp chụp */}
      <rect x="20" y="16" width="16" height="11" rx="2.5" fill="#6f4b2c" />
      <circle cx="28" cy="14" r="3.6" fill="#8a5f3c" />
      <path d="M102 62 q9 5 9 15" stroke="#6f4b2c" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="111" cy="80" r="4.5" fill="#8a5f3c" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   HỘP QUÀ + CẶP ĐÔI (Hộp Quà Mừng)
   ───────────────────────────────────────────────────────────── */

export function GiftBoxArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 150" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="giftBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe3ea" />
          <stop offset="100%" stopColor="#f8c2d1" />
        </linearGradient>
        <linearGradient id="giftLid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff2f5" />
          <stop offset="100%" stopColor="#fbd4de" />
        </linearGradient>
      </defs>

      {/* Tim bay lên */}
      {[
        { x: 54, y: 30, s: 0.5, o: 0.55 },
        { x: 82, y: 14, s: 0.78, o: 0.9 },
        { x: 108, y: 34, s: 0.6, o: 0.75 },
        { x: 66, y: 52, s: 0.42, o: 0.6 },
        { x: 100, y: 58, s: 0.5, o: 0.7 },
      ].map((h) => (
        <path
          key={`${h.x}-${h.y}`}
          transform={`translate(${h.x} ${h.y}) scale(${h.s})`}
          opacity={h.o}
          d="M0 8 C -14 -6, -22 -18, -10 -25 C -4 -28, 0 -22, 0 -18 C 0 -22, 4 -28, 10 -25 C 22 -18, 14 -6, 0 8 Z"
          fill="#f0607f"
        />
      ))}

      {/* Nắp hộp mở nghiêng */}
      <g transform="rotate(-9 46 74)">
        <rect x="26" y="66" width="58" height="16" rx="3" fill="url(#giftLid)" stroke="#eaa9bc" strokeWidth="1.2" />
      </g>

      {/* Thân hộp */}
      <rect x="46" y="80" width="76" height="52" rx="5" fill="url(#giftBody)" stroke="#eaa9bc" strokeWidth="1.2" />
      <rect x="78" y="80" width="12" height="52" fill="#f28ea6" fillOpacity="0.75" />
      <path d="M84 80 C 72 72, 66 62, 76 60 C 82 59, 85 70, 84 80 Z" fill="#f0607f" fillOpacity="0.85" />
      <path d="M84 80 C 96 72, 102 62, 92 60 C 86 59, 83 70, 84 80 Z" fill="#f0607f" fillOpacity="0.85" />
    </svg>
  );
}

/** Cặp đôi vẽ nét mảnh, đứng cạnh hộp quà — chú rể vest sẫm, cô dâu váy xoè. */
export function CoupleLineArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 150" role="presentation" aria-hidden="true">
      <g stroke="#3a3330" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Chú rể */}
        <path d="M32 30 C 32 20, 48 20, 48 30 C 48 39, 44 43, 40 43 C 36 43, 32 39, 32 30 Z" fill="#fff" />
        <path d="M31 28 C 34 17, 46 17, 49 28 C 47 24, 42 22, 36 24 Z" fill="#3a3330" />
        {/* Thân vest */}
        <path d="M40 46 L30 54 L28 122 L52 122 L50 54 Z" fill="#3a3330" fillOpacity="0.88" />
        {/* Ve áo + sơ mi */}
        <path d="M40 46 L35 64 L40 60 L45 64 Z" fill="#fff" />
        <path d="M40 46 L40 60" stroke="#fff" strokeWidth="0.9" />
        {/* Tay */}
        <path d="M30 56 C 24 70, 23 84, 26 96" />
        <path d="M50 56 C 56 66, 58 76, 57 84" />

        {/* Cô dâu */}
        <path d="M72 32 C 72 22, 88 22, 88 32 C 88 41, 84 45, 80 45 C 76 45, 72 41, 72 32 Z" fill="#fff" />
        <path d="M71 30 C 72 18, 88 18, 89 30 C 92 40, 88 46, 86 43 C 88 34, 84 26, 80 26 C 76 26, 72 30, 71 30 Z" fill="#3a3330" />
        {/* Váy xoè */}
        <path d="M80 48 L72 60 L60 122 L100 122 L88 60 Z" fill="#fff" />
        <path d="M60 122 C 72 128, 88 128, 100 122" fill="#fff" />
        <path d="M74 66 L68 106" strokeWidth="0.8" strokeOpacity="0.5" />
        <path d="M86 66 L92 106" strokeWidth="0.8" strokeOpacity="0.5" />
        {/* Tay nắm bó hoa */}
        <path d="M72 58 C 66 68, 62 78, 62 86" />
        <path d="M88 58 C 94 66, 96 76, 95 84" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   GHẾ NGỒI — biểu tượng của phần "Xác Nhận Tham Dự"
   ───────────────────────────────────────────────────────────── */

export function ChairGlyph({ crossed = false, className }: { crossed?: boolean; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7.5 10.5V6a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v4.5" />
      <path d="M6 10.5h12a1 1 0 0 1 1 1V15H5v-3.5a1 1 0 0 1 1-1z" />
      <path d="M7 15v6" />
      <path d="M17 15v6" />
      {crossed && <path d="M3.5 3.5l17 17" strokeWidth="1.5" />}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   CHỮ KÝ + TIM VẼ TAY
   ───────────────────────────────────────────────────────────── */

const SIGNATURES = {
  a: 'M4 34 C 18 6, 26 6, 24 26 C 22 42, 32 40, 40 22 C 46 8, 54 10, 50 28 C 47 42, 58 38, 66 22 C 72 10, 82 12, 78 28 C 75 40, 86 36, 96 20 C 104 8, 118 12, 126 24 C 132 32, 140 30, 150 20',
  b: 'M6 30 C 16 8, 30 6, 28 24 C 26 40, 38 38, 46 20 C 52 6, 62 8, 58 26 C 55 40, 68 36, 76 20 C 84 6, 96 10, 94 24 C 92 38, 106 34, 118 18 C 126 8, 142 14, 148 30',
};

export function Signature({ variant = 'a', className }: { variant?: 'a' | 'b'; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 156 48" role="presentation" aria-hidden="true">
      <path
        d={SIGNATURES[variant]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 42 C 40 36, 110 36, 152 40" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.55" strokeLinecap="round" />
    </svg>
  );
}

/** Nét tim nguệch ngoạc rải quanh album ảnh. */
export function HeartDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 72" role="presentation" aria-hidden="true">
      <path
        d="M40 68 C 8 44, 2 24, 16 12 C 27 3, 38 11, 40 22 C 42 11, 53 3, 64 12 C 78 24, 72 44, 40 68 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Dấu tim đặc, dùng làm nút trên trục Love Story và trong lịch. */
export function HeartSolid({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role="presentation" aria-hidden="true" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
