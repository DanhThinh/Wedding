# 🖼️ Album Masonry Layout - Hướng dẫn

## ✨ Tính năng mới

### 1. **Masonry Layout**
- Grid các cột có chiều cao không đều (như Pinterest)
- Ảnh tự động xếp theo aspect ratio tự nhiên
- Responsive: 2 cột (mobile) → 3 cột (tablet) → 4 cột (desktop)

### 2. **Filter Tabs**
- **Tất cả**: Hiển thị toàn bộ album
- **Pre-wedding**: Chỉ ảnh chụp trước đám cưới
- **Wedding Day**: Chỉ ảnh ngày cưới

### 3. **Category Badge**
- Hiện nhãn "✨ Pre-wedding" hoặc "💍 Wedding" khi hover
- Tự động theo filter category

### 4. **Giữ nguyên**
- Lightbox zoom/thumbnail
- Magnetic hover effect
- Corner accents
- Lazy loading

---

## 🎨 Cách custom category cho từng ảnh

Mở file `src/components/AlbumSection.tsx`, tìm đoạn này:

```typescript
const albumImages: AlbumImage[] = data.album.map((src, i) => ({
  src,
  // ⬇️ CHỈNH TẠI ĐÂY
  category: i < 4 ? 'prewedding' : 'wedding',
  aspectRatio: i % 3 === 0 ? 0.75 : i % 3 === 1 ? 1.2 : 1,
}));
```

### Cách 1: Gán theo thứ tự index
```typescript
category: i < 4 ? 'prewedding' : 'wedding',
// Ảnh 0-3: pre-wedding
// Ảnh 4+: wedding
```

### Cách 2: Gán thủ công từng ảnh
```typescript
const albumImages: AlbumImage[] = [
  { src: data.album[0], category: 'prewedding', aspectRatio: 0.75 },
  { src: data.album[1], category: 'prewedding', aspectRatio: 1.2 },
  { src: data.album[2], category: 'wedding', aspectRatio: 1 },
  { src: data.album[3], category: 'wedding', aspectRatio: 0.8 },
  // ... tiếp tục
];
```

### Cách 3: Đổi cấu trúc data (recommended)
Đổi `weddingData.ts`:

```typescript
// Thay vì
album: ['/images/album-1.webp', '/images/album-2.webp', ...],

// Thành
album: [
  { src: '/images/album-1.webp', category: 'prewedding', aspectRatio: 0.75 },
  { src: '/images/album-2.webp', category: 'prewedding', aspectRatio: 1.2 },
  { src: '/images/album-3.webp', category: 'wedding', aspectRatio: 1 },
  // ...
],
```

Rồi trong `AlbumSection.tsx`:
```typescript
const albumImages: AlbumImage[] = data.album;
```

---

## 📐 Aspect Ratio là gì?

- `aspectRatio = width / height`
- **0.75** = ảnh dọc (portrait, 3:4)
- **1** = ảnh vuông
- **1.2** = ảnh ngang nhẹ
- **1.5** = ảnh ngang rộng (landscape, 3:2)

Để masonry đẹp tự nhiên, nên mix các aspect ratio khác nhau.

---

## 🎯 Tips

### Làm sao biết aspect ratio của ảnh?
Dùng công cụ:
```bash
# macOS
sips -g pixelWidth -g pixelHeight /path/to/image.jpg

# Hoặc mở ảnh trong Preview > Tools > Show Inspector
```

Aspect ratio = pixelWidth / pixelHeight

### Muốn thêm category mới (ví dụ "Engagement")?
1. Đổi type trong `AlbumSection.tsx`:
```typescript
type FilterCategory = 'all' | 'prewedding' | 'wedding' | 'engagement';
```

2. Thêm nút filter:
```tsx
<button
  className={`filter-btn ${filter === 'engagement' ? 'active' : ''}`}
  onClick={() => setFilter('engagement')}
>
  Engagement ({albumImages.filter(i => i.category === 'engagement').length})
</button>
```

3. Đổi badge text (trong return JSX):
```tsx
<div className="gallery-badge">
  {image.category === 'prewedding' ? '✨ Pre-wedding' 
    : image.category === 'engagement' ? '💕 Engagement'
    : '💍 Wedding'}
</div>
```

---

## 🐛 Troubleshooting

**Ảnh bị crop lạ?**
→ Kiểm tra `aspectRatio`, nên match tỷ lệ ảnh thật.

**Filter không hoạt động?**
→ Kiểm tra `category` có đúng `'prewedding'` hoặc `'wedding'` (lowercase, không dấu).

**Masonry bị lệch?**
→ Clear cache trình duyệt, refresh lại.

---

Chúc bạn có album đẹp! 💐
