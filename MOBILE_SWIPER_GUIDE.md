# 📱 Mobile Album Swiper - Instagram Style

## ✨ Tính năng

### Desktop & Tablet (≥768px)
- **Masonry Grid** với filter tabs
- Hover effects, magnetic tilt
- Lightbox zoom

### Mobile (<768px)
- **Swiper carousel** kiểu Instagram/Tinder
- Vuốt sang trái/phải
- **Coverflow effect** (ảnh giữa nổi bật, 2 bên mờ đi)
- Auto-play (3.5s/ảnh, tạm dừng khi chạm)
- Pagination dots
- Chạm ảnh → mở lightbox fullscreen

---

## 🎯 UX Flow

### Desktop
```
Grid masonry 4 cột
  ↓
Hover → zoom nhẹ + badge hiện
  ↓
Click → Lightbox zoom
```

### Mobile
```
Swiper carousel
  ↓
Vuốt trái/phải để xem ảnh
  ↓
Chạm ảnh → Lightbox fullscreen
  ↓
Trong lightbox: pinch to zoom, swipe
```

---

## 🎨 Coverflow Effect

**Ảnh giữa:**
- Scale 1 (full size)
- Opacity 1 (rõ nét)
- Shadow nổi

**Ảnh hai bên:**
- Scale 0.85 (nhỏ hơn)
- Opacity 0.5 (mờ)
- Xoay 15° (perspective)

→ Tạo cảm giác **3D depth** như iPhone Photos app

---

## ⚙️ Cấu hình Swiper

Trong `AlbumSection.tsx`, tìm `<Swiper>`:

### 1. Thay đổi tốc độ autoplay
```tsx
autoplay={{
  delay: 3500,  // ⬅️ Đổi thành 2000 (2s) hoặc 5000 (5s)
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
}}
```

### 2. Tắt autoplay
```tsx
// Xóa dòng này
autoplay={{...}}

// Hoặc set thành false
autoplay={false}
```

### 3. Đổi số ảnh hiển thị
```tsx
slidesPerView="auto"  // ⬅️ Đổi thành 1, 1.2, 1.5...
// "auto" = responsive theo width ảnh
// 1 = chỉ 1 ảnh, full width
// 1.2 = 1 ảnh chính + peek 2 bên
```

### 4. Đổi cường độ coverflow
```tsx
coverflowEffect={{
  rotate: 15,      // ⬅️ Góc xoay (0-50)
  stretch: 0,      // ⬅️ Khoảng cách giữa slides
  depth: 150,      // ⬅️ Độ sâu 3D (50-300)
  modifier: 1.5,   // ⬅️ Tỷ lệ effect (1-3)
  slideShadows: true,
}}
```

**Presets:**
```tsx
// Subtle (nhẹ nhàng)
{ rotate: 8, depth: 100, modifier: 1 }

// Dramatic (mạnh mẽ)
{ rotate: 30, depth: 250, modifier: 2.5 }

// Flat (phẳng, không 3D)
{ rotate: 0, depth: 0, modifier: 1 }
```

### 5. Navigation arrows (nút prev/next)
```tsx
// Enable arrows
navigation={true}

// Trong CSS đã có style sẵn
```

### 6. Loop (lặp vô hạn)
```tsx
loop={filteredImages.length > 3}  // ⬅️ Đổi thành true hoặc false
```

---

## 🎨 Customize Style

### 1. Đổi kích thước ảnh mobile
Mở `main.scss`, tìm:
```scss
.album-swiper {
  .swiper-slide {
    width: 85%;         // ⬅️ Đổi 70%-95%
    max-width: 320px;   // ⬅️ Đổi 280px-400px
  }
}
```

### 2. Đổi aspect ratio ảnh
```scss
.swiper-slide-content {
  aspect-ratio: 3/4;  // ⬅️ Đổi 1/1 (vuông), 9/16 (story), 4/3...
}
```

### 3. Đổi màu pagination dots
```scss
.album-swiper .swiper-pagination-bullet {
  background: var(--primary);  // ⬅️ Đổi màu
}
```

### 4. Tắt hint "Chạm để phóng to"
```scss
.swiper-hint {
  display: none;  // ⬅️ Thêm dòng này
}
```

---

## 🔧 Troubleshooting

### Swiper không vuốt được
**Nguyên nhân:** CSS conflict hoặc touchAction bị chặn

**Giải pháp:**
```tsx
// Thêm vào <Swiper>
touchRatio={1}
threshold={5}
```

### Ảnh bị méo/crop
**Nguyên nhân:** aspect-ratio không khớp ảnh thật

**Giải pháp:**
```scss
.swiper-slide-content img {
  object-fit: contain;  // Thay vì cover
}
```

### Auto-play không hoạt động
**Nguyên nhân:** Browser policy (chặn autoplay khi không có user interaction)

**Giải pháp:** Autoplay sẽ bắt đầu sau khi user scroll đến section (đã có sẵn)

### Pagination dots không hiển thị
**Nguyên nhân:** CSS conflict hoặc bị ẩn

**Giải pháp:**
```scss
.album-swiper .swiper-pagination {
  position: relative !important;
  bottom: 0 !important;
}
```

---

## 📊 Performance

### Bundle size
- Swiper core: ~35KB gzipped
- Modules (Navigation, Pagination, Coverflow): ~8KB

### Optimization
- Lazy load ảnh (có sẵn)
- GPU acceleration (CSS transform)
- Virtual slides (nếu >50 ảnh):
```tsx
virtual
virtualIndex
```

---

## 🎯 Best Practices

### 1. Số ảnh tối ưu
- **8-12 ảnh**: Vừa đủ, không quá dài
- **>20 ảnh**: Enable virtual slides

### 2. Kích thước ảnh
- Width: 800-1200px
- Height: theo aspect ratio
- Format: WebP (nhẹ)
- Compress: TinyPNG, Squoosh

### 3. Order ảnh
- Đặt ảnh đẹp nhất đầu tiên
- Mix pre-wedding và wedding
- Chuyển cảnh đa dạng (portrait, landscape, close-up, wide)

---

## 🚀 Advanced: Custom Transitions

### 1. Fade transition (thay vì coverflow)
```tsx
effect="fade"
fadeEffect={{
  crossFade: true
}}
```

### 2. Cube transition
```tsx
effect="cube"
cubeEffect={{
  shadow: true,
  slideShadows: true,
  shadowOffset: 20,
  shadowScale: 0.94,
}}
```

### 3. Flip transition
```tsx
effect="flip"
flipEffect={{
  slideShadows: true,
  limitRotation: true,
}}
```

---

## 📱 Test trên thiết bị thật

### iOS Safari
```bash
# Enable remote debugging
Settings → Safari → Advanced → Web Inspector
```

### Android Chrome
```bash
# Enable USB debugging
chrome://inspect
```

### Responsive mode (Chrome DevTools)
```
Ctrl+Shift+M (Windows)
Cmd+Shift+M (Mac)
```

Test:
- Vuốt trái/phải
- Chạm ảnh → lightbox
- Pinch to zoom trong lightbox
- Autoplay hoạt động
- Pagination clickable

---

## 🎨 Inspiration

Swiper này học từ:
- **Instagram Stories** (vertical swipe)
- **Tinder** (card stack)
- **Apple Photos** (coverflow)
- **Netflix** (carousel)

---

Chúc bạn có album mobile đẹp! 📸✨
