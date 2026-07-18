# 💍 Wedding Website - Tổng quan Dự án

## 📚 Mục lục
1. [Tech Stack](#tech-stack)
2. [Cấu trúc Dự án](#cấu-trúc-dự-án)
3. [Tính năng Hiện có](#tính-năng-hiện-có)
4. [Tính năng Mới (Đã nâng cấp)](#tính-năng-mới-đã-nâng-cấp)
5. [Hướng dẫn Chạy](#hướng-dẫn-chạy)
6. [Customize & Deploy](#customize--deploy)

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** + **TypeScript**
- **Vite** (build tool siêu nhanh)
- **React Router DOM** (routing)

### Styling & Animation
- **Tailwind CSS** (utility-first CSS)
- **SCSS/Sass** (custom styles)
- **GSAP** (animation library cao cấp)
- Các font: Cormorant Garamond, Inter, Oooh Baby, Bellota...

### Libraries
- **LightGallery** (image lightbox/zoom)
- **Swiper** (carousel/slider)
- Canvas API (cho petals & confetti)

---

## 📁 Cấu trúc Dự án

```
wedding-thiep-cuoi/
├── public/
│   ├── images/              # Ảnh cưới, hero, album, QR...
│   │   ├── hero-1.webp → hero-5.webp
│   │   ├── groom.webp, bride.webp
│   │   ├── story-1.webp → story-3.webp
│   │   ├── album-1.webp → album-8.webp
│   │   ├── qr-groom.png, qr-bride.png
│   │   └── ASSETS_CHECKLIST.md
│   └── music/               # 🆕 Nhạc nền
│       └── background.mp3   (cần thêm)
│
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Preloader.tsx
│   │   ├── EnvelopeDialog.tsx       # Phong bì mở thiệp
│   │   ├── HeroSection.tsx          # Hero slideshow Ken Burns
│   │   ├── CoupleSection.tsx        # Thông tin cặp đôi
│   │   ├── StorySection.tsx         # Timeline câu chuyện
│   │   ├── CountdownSection.tsx     # 🆕 Countdown + Confetti
│   │   ├── AlbumSection.tsx         # 🆕 Masonry gallery + Filter
│   │   ├── EventsSection.tsx        # 🆕 Events + Google Maps
│   │   ├── GuestbookSection.tsx     # Sổ lưu bút
│   │   ├── GiftBoxSection.tsx       # Mừng cưới QR
│   │   ├── QuickActions.tsx         # FAB mobile
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── FallingPetals.tsx        # 🆕 Cánh hoa rơi
│   │   ├── ConfettiBurst.tsx        # 🆕 Confetti bùng nổ
│   │   ├── MusicToggle.tsx          # 🆕 Nút nhạc nổi
│   │   └── DevQAPanel.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── RSVPPage.tsx
│   │
│   ├── hooks/
│   │   ├── useWedding.tsx           # 🆕 Context + Music control
│   │   ├── useCountdown.ts
│   │   └── useScrollAnimation.ts
│   │
│   ├── data/
│   │   └── weddingData.ts           # ⭐ Data chính - customize tại đây
│   │
│   ├── styles/
│   │   └── main.scss                # Global styles
│   │
│   └── App.tsx                      # 🆕 App với Petals + Music
│
├── ALBUM_MASONRY_GUIDE.md           # 🆕 Hướng dẫn album
├── MAPS_SETUP_GUIDE.md              # 🆕 Hướng dẫn maps
├── PROJECT_OVERVIEW.md              # 🆕 File này
└── README.md                        # Hướng dẫn gốc

```

---

## 🎯 Tính năng Hiện có (Ban đầu)

### ✅ Core Features
1. **Preloader** - Màn chờ với trái tim đập
2. **Envelope Dialog** - Phong bì mở thiệp (wax seal, animation 3D)
3. **Hero Slideshow** - 5 ảnh với Ken Burns zoom effect
4. **Couple Section** - Thông tin cô dâu chú rể, expand/collapse
5. **Story Timeline** - Câu chuyện tình yêu theo thời gian (zigzag layout)
6. **Countdown Timer** - Đếm ngược đến ngày cưới (realtime)
7. **Album Gallery** - 8 ảnh với lightbox zoom/thumbnail
8. **Events Schedule** - 3 sự kiện với nút Add to Calendar
9. **Guestbook** - Sổ lưu bút (localStorage)
10. **Gift Box** - QR chuyển khoản cô dâu + chú rể
11. **RSVP Form** - Xác nhận tham dự
12. **Quick Actions** - Floating button mobile

### 🎨 Animation & Effects
- GSAP animations (entrance, scroll reveal, hover tilt)
- Magnetic hover effect
- Card 3D perspective
- Scroll-triggered animations
- Smooth transitions

---

## 🚀 Tính năng Mới (Đã nâng cấp)

### 1️⃣ **Hiệu ứng mở thiệp + Cánh hoa rơi + Nhạc nền** ✨

#### 🌸 FallingPetals Component
- Canvas animation 26-28 cánh hoa
- Hiệu ứng rơi tự nhiên với vật lý (sway, gravity, fade)
- Chế độ **burst** (bùng nổ lúc đầu rồi giảm dần)
- Tự động pause khi tab ẩn (tiết kiệm pin)
- Hỗ trợ `prefers-reduced-motion`

**File:** `src/components/FallingPetals.tsx`

#### 🎵 Music Control
- Audio loop vô hạn, volume 35%, fade-in mượt
- Bật tự động khi **mở thiệp** (user gesture)
- Toggle bật/tắt với nút nổi (floating button)
- Icon quay khi đang phát nhạc

**Files:** 
- `src/hooks/useWedding.tsx` (logic audio)
- `src/components/MusicToggle.tsx` (UI button)
- `public/music/background.mp3` (cần thêm file nhạc)

#### 📨 Tích hợp
- Petals chỉ hiện **sau khi mở thiệp**
- Nhạc bật ngay lúc user click "Mở thiệp"
- App structure: WeddingProvider → AppContent → petals + music

**File:** `src/App.tsx`

---

### 2️⃣ **Confetti bùng nổ khi Countdown về 0** 🎊

#### 🎉 ConfettiBurst Component
- 150-180 hạt confetti với 3 hình: chữ nhật, tròn, **trái tim**
- Vật lý thực tế: trọng lực, xoay, fade-out
- 12 màu sắc đa dạng (vàng, hồng, xanh, tím...)
- Bùng nổ 1 lần khi countdown = 0, tự tắt sau 6s

**File:** `src/components/ConfettiBurst.tsx`

#### ⏱️ Countdown Logic
- Phát hiện khi `days/hours/minutes/seconds = 0`
- Thay đổi UI:
  - **Trước**: Timer đếm ngược + ngày cưới
  - **Sau**: "Hôm Nay Là Ngày Cưới!" + icon trái tim đập + confetti
- Chỉ trigger khi section visible (tránh confetti khi chưa scroll tới)

**File:** `src/components/CountdownSection.tsx`

**Style:** `.countdown-celebration` trong `main.scss`

---

### 3️⃣ **Album Masonry Layout + Filter** 🖼️

#### 📐 Masonry Grid
- Layout cột không đều chiều cao (như Pinterest)
- Ảnh tự động xếp theo `aspectRatio` riêng
- Responsive: 2 cột (mobile) → 3 cột (tablet) → 4 cột (desktop)

#### 🔍 Filter Tabs
- 3 nút: **Tất cả** / **Pre-wedding** / **Wedding Day**
- Đếm số ảnh realtime cho mỗi category
- Active state với màu primary + shadow
- Animation smooth khi chuyển filter

#### 🏷️ Category Badge
- Nhãn "✨ Pre-wedding" hoặc "💍 Wedding"
- Hiện khi hover, fade-in mượt
- Background blur trong suốt

#### 🎨 Giữ nguyên
- Lightbox zoom + thumbnail (LightGallery)
- Magnetic hover effect (GSAP)
- Corner accents
- Lazy loading

**File:** `src/components/AlbumSection.tsx`

**Hướng dẫn custom:** `ALBUM_MASONRY_GUIDE.md`

---

### 4️⃣ **Google Maps tích hợp cho Events** 🗺️

#### 🗾 Embed Map trong Event Card
- Nút "Bản đồ" toggle hiện/ẩn map iframe
- Animation slide-down mượt
- Responsive, lazy load
- Footer "Mở trong Google Maps" → fullscreen

#### 🧭 Nút Chỉ đường (Navigation)
- Tự động mở Google Maps Navigation
- Tính route từ vị trí hiện tại → địa điểm
- Hoạt động trên mobile (app) và desktop (web)

#### 🔑 Không cần API key
- Dùng iframe embed public của Google
- Hoạt động ngay lập tức
- (Tùy chọn) Nâng cấp với API key để custom → xem guide

**File:** `src/components/EventsSection.tsx`

**Hướng dẫn setup:** `MAPS_SETUP_GUIDE.md`

---

## 🎨 Design System

### Colors
- **Primary:** `#D4887A` (rose gold)
- **Primary Light:** `rgba(212, 136, 122, 0.18)`
- **Primary Dark:** `#A5584C`
- **Rose Gold:** `#C9956F`
- **Cream:** `#FAF8F5`
- **Blush:** `#F5EBE9`

### Typography
- **Headings:** Cormorant Garamond (serif, elegant)
- **Body:** Inter, Open Sans (sans-serif, readable)
- **Script:** Oooh Baby, MonteCarlo (handwriting)
- Fluid typography: `clamp()` cho responsive

### Spacing & Radius
- Fluid spacing: `--sp-xs` → `--sp-2xl`
- Border radius: `--r-sm` (6px) → `--r-xl` (32px)

### Shadows
- `--shadow-xs` → `--shadow-lg`
- `--shadow-primary` (rose gold glow)
- `--shadow-gold` (warm glow)

---

## 🚀 Hướng dẫn Chạy

### Prerequisites
- Node.js 18+ và npm

### Installation
```bash
# Clone repo (nếu từ Git)
git clone <repo-url>
cd wedding-thiep-cuoi

# Install dependencies
npm install
```

### Development
```bash
# Start dev server (hot reload)
npm run dev

# Mở browser: http://localhost:5173
```

### Build Production
```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

### Lint
```bash
npm run lint
```

---

## ⚙️ Customize & Deploy

### 1. Thay đổi nội dung
Mở `src/data/weddingData.ts`, đổi:
- Tên cô dâu, chú rể
- Ngày cưới
- Địa điểm sự kiện
- Timeline câu chuyện
- Thông tin ngân hàng QR

### 2. Thay ảnh
Đặt ảnh vào `public/images/`:
- `hero-1.webp` → `hero-5.webp` (slideshow)
- `groom.webp`, `bride.webp`
- `story-1.webp` → `story-3.webp`
- `album-1.webp` → `album-8.webp`
- `qr-groom.png`, `qr-bride.png`

**Checklist:** `public/images/ASSETS_CHECKLIST.md`

### 3. Thêm nhạc nền
Đặt file MP3 vào `public/music/background.mp3`

Gợi ý:
- Piano/acoustic nhẹ nhàng
- 2-3 phút, loop tự nhiên
- Nguồn: Pixabay Music, Uppbeat (free)

### 4. Cập nhật địa chỉ sự kiện (cho Maps)
Trong `weddingData.ts`:
```typescript
events: [
  {
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM', // Đổi địa chỉ thật
    // Hoặc dùng tọa độ GPS: '10.762622,106.660172'
  }
]
```

### 5. Deploy
Dự án build thành static files, deploy lên:
- **Vercel** (recommended, free, tự động CI/CD)
- **Netlify** (free, drag & drop)
- **GitHub Pages** (free)
- **Firebase Hosting** (free tier)

#### Deploy Vercel:
```bash
npm i -g vercel
vercel --prod
```

Hoặc connect GitHub repo → auto deploy khi push.

---

## 📊 Performance

### Optimizations đã có
- **Code splitting** (React.lazy)
- **Image lazy loading** (loading="lazy")
- **WebP format** cho ảnh
- **Canvas animation** (hiệu năng cao hơn HTML/CSS)
- **GSAP ScrollTrigger** (tối ưu scroll)
- **Preload fonts** (`<link rel="preload">`)
- **will-change** cho animations

### Lighthouse Score (target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

---

## 🐛 Known Issues & Solutions

### 1. Nhạc không tự phát
**Nguyên nhân:** Trình duyệt chặn autoplay (security policy)

**Giải pháp:** Nhạc chỉ bật khi user click "Mở thiệp" (user gesture) → đã handle

### 2. Map không hiển thị
**Nguyên nhân:** Địa chỉ không chính xác hoặc API key sai

**Giải pháp:** 
- Kiểm tra địa chỉ trên google.com/maps
- Dùng tọa độ GPS nếu cần
- Xem `MAPS_SETUP_GUIDE.md`

### 3. Countdown âm (đã qua ngày cưới)
**Giải pháp:** Countdown tự động hiện "Hôm nay là ngày cưới!" + confetti

### 4. Ảnh không load
**Nguyên nhân:** File không tồn tại hoặc đường dẫn sai

**Giải pháp:** 
- Kiểm tra `public/images/` có đủ file không
- Dùng placeholder fallback (đã có sẵn)

---

## 📦 Bundle Size

### Main chunks
- **Vendor** (~200KB): React, GSAP, LightGallery
- **App** (~80KB): Components & logic
- **Styles** (~30KB): Tailwind + custom CSS
- **Total** (~310KB gzipped)

### Lazy loaded
- Confetti (~8KB)
- Album (~15KB)
- Maps (~5KB)

---

## 🎓 Học từ dự án này

### React Patterns
- Context API cho global state
- Custom hooks (useCountdown, useScrollAnimation)
- Compound components (Modal, Toast)
- Refs forwarding
- Portal (Modal overlay)

### Animation Techniques
- GSAP timeline sequencing
- Canvas particle systems
- CSS keyframes + transitions
- Intersection Observer (scroll animations)
- requestAnimationFrame optimization

### Performance
- Code splitting
- Lazy loading (images, components)
- Memoization (useCallback, useMemo)
- will-change CSS property
- Canvas vs DOM (performance comparison)

---

## 📚 Resources

### Documentation
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [GSAP Docs](https://greensock.com/docs/)
- [LightGallery](https://www.lightgalleryjs.com)
- [Google Maps Embed API](https://developers.google.com/maps/documentation/embed)

### Assets
- [Pixabay Music](https://pixabay.com/music/) (nhạc free)
- [Unsplash](https://unsplash.com) (ảnh stock)
- [Google Fonts](https://fonts.google.com)

---

## 🤝 Contributing

Muốn thêm tính năng? Một số ý tưởng:

### Chưa làm (có thể mở rộng)
- 💬 Guestbook realtime (Firebase/Supabase)
- 🌙 Dark/elegant mode
- 📱 Mobile swiper cho album
- 🎵 Playlist nhạc (nhiều bài)
- 🌐 Đa ngôn ngữ (VI/EN)
- 📊 Analytics (Google Analytics)
- 💌 Email invitation form
- 🎁 Gift registry integration
- 📸 Live photo upload from guests
- 🎥 Video background cho hero

---

## 📄 License

Private project for personal wedding use.

---

## ❤️ Credits

**Developed with love for:** Nguyễn Danh Thịnh & Phạm Thị Thuý Hằng

**Tech Stack:** React, TypeScript, Vite, Tailwind, GSAP

**Special Thanks:** Google Fonts, LightGallery, Unsplash

---

Chúc hai bạn trăm năm hạnh phúc! 💕🎊
