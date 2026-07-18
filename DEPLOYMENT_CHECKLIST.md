# ✅ Deployment Checklist - Sẵn sàng lên production

## 📋 Trước khi deploy

### 1. **Nội dung** (bắt buộc)
- [ ] Đổi tên cô dâu + chú rể trong `src/data/weddingData.ts`
- [ ] Đổi ngày cưới → `weddingDate: new Date('2025-XX-XX')`
- [ ] Cập nhật địa chỉ sự kiện (3 events)
- [ ] Thông tin ngân hàng + QR code
- [ ] Timeline câu chuyện tình yêu (story)
- [ ] Thông tin gia đình (cha mẹ)

### 2. **Ảnh** (bắt buộc)
Thay ảnh trong `public/images/`:
- [ ] `hero-1.webp` → `hero-5.webp` (5 ảnh slideshow)
- [ ] `groom.webp` (ảnh chú rể)
- [ ] `bride.webp` (ảnh cô dâu)
- [ ] `story-1.webp` → `story-3.webp` (3 ảnh timeline)
- [ ] `album-1.webp` → `album-8.webp` (8 ảnh album)
- [ ] `qr-groom.png` (QR chuyển khoản chú rể)
- [ ] `qr-bride.png` (QR chuyển khoản cô dâu)
- [x] `favicon.svg` (icon tab trình duyệt)
- [ ] Cấu hình Firebase trong `.env` để RSVP và guestbook gửi dữ liệu thật
- [ ] Deploy `firestore.rules` trước khi chia sẻ thiệp

**Format khuyến nghị:**
- WebP (nhỏ gọn, chất lượng cao)
- Hero: 1920x1080px trở lên
- Couple: 600x800px (portrait)
- Album: 800-1200px

### 3. **Nhạc nền** (khuyến nghị)
- [ ] Thêm file `public/music/background.mp3`
  - Piano/acoustic nhẹ nhàng
  - 2-3 phút, loop tự nhiên
  - Nguồn: [Pixabay Music](https://pixabay.com/music/), [Uppbeat](https://uppbeat.io)

### 4. **Album Categories** (khuyến nghị)
- [ ] Gán category cho từng ảnh album (pre-wedding / wedding)
  - Mở `src/components/AlbumSection.tsx`
  - Tìm dòng `category: i < 4 ? 'prewedding' : 'wedding'`
  - Đổi logic theo ý muốn
  - Xem `ALBUM_MASONRY_GUIDE.md`

### 5. **Google Maps** (khuyến nghị)
- [ ] Test địa chỉ sự kiện trên google.com/maps
- [ ] Nếu không chính xác → dùng tọa độ GPS hoặc Place ID
  - Xem `MAPS_SETUP_GUIDE.md`
- [ ] (Optional) Lấy Google Maps API key để custom
  - https://console.cloud.google.com/google/maps-apis/

### 6. **SEO & Social Share** (khuyến nghị)
Mở `index.html`, đổi:
- [ ] `<title>` → "Thịnh ♥ Hằng - Wedding Invitation"
- [ ] `<meta name="description">` → Mô tả ngắn
- [ ] Open Graph tags:
```html
<meta property="og:title" content="Thịnh ♥ Hằng Wedding">
<meta property="og:description" content="11 tháng 01 2025">
<meta property="og:image" content="/images/hero-1.webp">
<meta property="og:url" content="https://yourdomain.com">
```

### 7. **Test local** (bắt buộc)
```bash
npm run dev
```

Kiểm tra:
- [ ] Mở thiệp → nhạc phát, petals rơi
- [ ] Hero slideshow chạy
- [ ] Countdown hiển thị đúng (hoặc "Hôm nay là ngày cưới" + confetti nếu đã qua)
- [ ] Album filter hoạt động
- [ ] Maps hiển thị địa chỉ đúng
- [ ] Guestbook submit được
- [ ] QR code đúng
- [ ] Responsive mobile/tablet

### 8. **Build production** (bắt buộc)
```bash
npm run build
```

- [ ] Không có lỗi build
- [ ] Check `dist/` folder có đầy đủ files

```bash
npm run preview
```

- [ ] Test production build local
- [ ] Kiểm tra lại tất cả tính năng

---

## 🚀 Deploy

### Option 1: Vercel (Recommended)
**Ưu điểm:** Free, tự động CI/CD, CDN global, HTTPS miễn phí

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Hoặc:
1. Push code lên GitHub
2. Import repo trên [vercel.com](https://vercel.com)
3. Auto deploy khi push → `main` branch

**Custom domain:**
- Vercel Dashboard → Settings → Domains
- Add domain + cấu hình DNS

### Option 2: Netlify
1. Drag & drop folder `dist/` vào [netlify.com/drop](https://app.netlify.com/drop)
2. Hoặc connect GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`

### Option 3: GitHub Pages
```bash
# Install gh-pages
npm i -D gh-pages

# Add to package.json scripts
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

### Option 4: Firebase Hosting
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Init
firebase init hosting

# Deploy
firebase deploy
```

---

## 🔍 Post-Deploy Check

Sau khi deploy, kiểm tra:
- [ ] Domain hoạt động (https://yourdomain.com)
- [ ] HTTPS enabled (ổ khóa xanh)
- [ ] Mở trên nhiều thiết bị:
  - [ ] Desktop (Chrome, Safari, Firefox)
  - [ ] Mobile (iOS Safari, Android Chrome)
  - [ ] Tablet
- [ ] Test toàn bộ tính năng lại 1 lần
- [ ] Share link test với bạn bè
- [ ] Lightbox ảnh hoạt động
- [ ] Nhạc nền phát (sau khi mở thiệp)
- [ ] Maps chỉ đường
- [ ] Add to Calendar
- [ ] Guestbook submit
- [ ] RSVP form

---

## 🎯 Performance Check

Chạy Lighthouse (Chrome DevTools):
```
Ctrl+Shift+I → Lighthouse tab → Generate report
```

**Target scores:**
- [ ] Performance: 90+
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 90+

**Nếu score thấp:**
- Optimize ảnh (compress, resize)
- Enable Gzip/Brotli compression (Vercel/Netlify tự động)
- Preload fonts
- Lazy load images

---

## 📱 Chia sẻ

### QR Code cho link website
Tạo QR code trỏ đến domain của bạn:
- https://www.qr-code-generator.com
- In QR code lên thiệp giấy

### Social Media
Post link với ảnh đẹp:
- Facebook, Zalo, Instagram
- Messenger groups
- Email invitation

### Thiệp giấy
In domain hoặc QR code lên thiệp cưới:
```
♥ Xem thiệp online tại:
yourdomain.com
```

---

## 🛠️ Bảo trì

### Cập nhật sau deploy
Nếu cần sửa gì (lỗi chính tả, thêm ảnh...):

1. Sửa code local
2. Test: `npm run dev`
3. Build: `npm run build`
4. Deploy lại:
   - Vercel: `vercel --prod` hoặc push git
   - Netlify: drag & drop `dist/`
   - GitHub Pages: `npm run deploy`

### Backup
- [ ] Backup folder dự án ra drive
- [ ] Push code lên GitHub (private repo nếu cần)

---

## 🎊 Sau đám cưới

### Lưu giữ kỷ niệm
- [ ] Export guestbook (localStorage → JSON)
- [ ] Screenshot website
- [ ] Archive website (Wayback Machine)
- [ ] Download toàn bộ ảnh từ server

### (Optional) Chuyển thành Thank You page
Thay countdown thành:
- "Cảm ơn bạn đã tham dự!"
- Gallery ảnh từ ngày cưới
- Video highlights

---

Chúc bạn deploy thành công! 🎉💕
