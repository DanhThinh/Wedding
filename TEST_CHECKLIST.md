# ✅ Test Checklist - Kiểm tra Web đang chạy

**Dev Server:** http://localhost:5173

---

## 🎯 Test theo thứ tự

### 1. **Preloader** (Màn chờ)
- [ ] Loading heart đập (animation)
- [ ] Chữ T & H hiển thị
- [ ] Progress bar chạy
- [ ] Tự động chuyển sang Envelope sau ~3s

---

### 2. **Envelope Dialog** (Phong bì mở thiệp) ✨ CÓ NHẠC + PETALS
- [ ] Phong bì hiển thị với wax seal
- [ ] Text "Chạm để mở thiệp"
- [ ] **Click seal** → phong bì mở animation 3D
- [ ] Thẻ cưới trượt lên
- [ ] **Nhạc nền bắt đầu phát** (fade-in)
- [ ] **Cánh hoa rơi** xuất hiện khắp màn hình
- [ ] **Nút nhạc** xuất hiện góc trên phải
- [ ] Chuyển sang Hero section

**⚠️ Lưu ý:** 
- Nếu nhạc không phát → check file `public/music/background.mp3` có tồn tại không
- Nếu chưa có file nhạc → tính năng vẫn hoạt động, chỉ không có âm thanh

---

### 3. **Hero Section** (Slideshow)
- [ ] 5 ảnh hero slideshow tự động chạy
- [ ] Ken Burns zoom effect (ảnh phóng to nhẹ)
- [ ] Crossfade mượt giữa các ảnh
- [ ] Text "Danh Thịnh & Thuý Hằng" hiển thị
- [ ] Ngày cưới: "11 tháng 01 2025"
- [ ] Nút "Xác nhận tham dự"
- [ ] Pagination dots (5 chấm) active đúng
- [ ] Scroll hint ở dưới

---

### 4. **Header** (Fixed top)
- [ ] Sticky khi scroll xuống
- [ ] Logo/Tên cặp đôi
- [ ] Menu nav links hoạt động (click → scroll smooth)

---

### 5. **Couple Section**
- [ ] Ảnh chú rể + cô dâu
- [ ] Hover → card nâng lên, xoay nhẹ
- [ ] Floating hearts decoration
- [ ] Nút "Xem thêm" → expand description
- [ ] Intro box: "Và.. Ngày ấy đã tới"
- [ ] Chữ ký: "Danh Thịnh & Thuý Hằng"

---

### 6. **Story Section** (Timeline)
- [ ] 3 milestone với ảnh
- [ ] Layout zigzag (trái-phải-trái)
- [ ] Scroll reveal animation
- [ ] Date + title + content
- [ ] Labels: "BẮT ĐẦU TỪ", "và sau nữa"

---

### 7. **Countdown Section** ⏱️ 🎊 CONFETTI
**Trường hợp 1: Ngày cưới chưa tới**
- [ ] Timer đếm ngược (Ngày | Giờ | Phút | Giây)
- [ ] Số thay đổi mỗi giây
- [ ] Flip animation khi số đổi
- [ ] Ngày cưới hiển thị: "11 tháng 01 2025"

**Trường hợp 2: Ngày cưới đã qua (11/01/2025 < hôm nay)** ✅ ĐANG TEST
- [ ] Timer = 00 | 00 | 00 | 00
- [ ] Title đổi thành: **"Hôm Nay Là Ngày Cưới!"**
- [ ] Icon trái tim đập (pulse animation)
- [ ] Thông điệp: "Cảm ơn bạn đã đồng hành..."
- [ ] **CONFETTI BÙNG NỔ** (150-180 hạt, 3 hình: rect, circle, heart)
- [ ] Confetti tự tắt sau ~6 giây
- [ ] Màu đa dạng (vàng, hồng, xanh, tím...)

**Common:**
- [ ] Nút "Gửi Lời Chúc" + "Xác nhận tham dự"
- [ ] Floating particles background

---

### 8. **Album Section** 🖼️ MASONRY + SWIPER

#### Desktop (≥768px)
- [ ] **Filter tabs** hiển thị: Tất cả / Pre-wedding / Wedding Day
- [ ] Click filter → ảnh lọc đúng
- [ ] Count số ảnh đúng mỗi category
- [ ] **Masonry grid** 4 cột, chiều cao không đều
- [ ] Hover ảnh → zoom nhẹ + badge hiện
- [ ] Badge: "✨ Pre-wedding" hoặc "💍 Wedding"
- [ ] Click ảnh → **Lightbox** fullscreen
- [ ] Lightbox: zoom, prev/next, thumbnail strip

#### Mobile (<768px) - Resize browser xuống
- [ ] **Swiper carousel** xuất hiện (thay grid)
- [ ] **Vuốt trái/phải** để xem ảnh
- [ ] **Coverflow effect**: ảnh giữa nổi, 2 bên mờ + xoay 3D
- [ ] **Auto-play** (ảnh tự chuyển ~3.5s)
- [ ] **Pagination dots** ở dưới (active dot dài hơn)
- [ ] Badge "✨ Pre-wedding" / "💍 Wedding"
- [ ] Hint "Chạm để phóng to" (pulse)
- [ ] **Chạm ảnh** → lightbox fullscreen

---

### 9. **Events Section** 🗺️ MAPS
**3 sự kiện: Tiệc nhà trai, Tiệc nhà gái, Lễ Thành Hôn**

Cho mỗi event:
- [ ] Icon calendar + tên sự kiện
- [ ] Thời gian, địa điểm, địa chỉ
- [ ] **3 nút hành động:**

1. **Nút "Bản đồ"**
   - [ ] Click → **Google Maps iframe** hiện bên dưới
   - [ ] Map hiển thị địa chỉ (zoom 15)
   - [ ] Footer: "Mở trong Google Maps →"
   - [ ] Click lần 2 → ẩn map

2. **Nút "Chỉ đường"**
   - [ ] Click → mở Google Maps Navigation (tab mới)
   - [ ] Route từ vị trí hiện tại → địa điểm

3. **Nút "Lịch"**
   - [ ] Click → popover hiện
   - [ ] 3 options: Google Calendar, Apple Calendar, Outlook
   - [ ] Click option → download .ics hoặc mở calendar

- [ ] Hover card → tilt 3D nhẹ

**⚠️ Lưu ý Maps:**
- Địa chỉ hiện tại là dummy (123 ABC...)
- Map vẫn hoạt động nhưng sẽ không chính xác
- Cần đổi địa chỉ thật trong `weddingData.ts`

---

### 10. **Guestbook Section** (Sổ lưu bút)
- [ ] Form: Name + Message
- [ ] Placeholder text
- [ ] Nút "Gửi lời chúc"
- [ ] Submit → Toast "Gửi thành công!"
- [ ] Wish hiển thị trong list (mới nhất trên đầu)
- [ ] Có 2 wishes mẫu sẵn
- [ ] Scroll animation cho wish cards

---

### 11. **GiftBox Section** (Mừng cưới)
- [ ] 2 tab: Chú rể | Cô dâu
- [ ] Click tab → chuyển thông tin
- [ ] QR code hiển thị
- [ ] Tên tài khoản, STK, Ngân hàng
- [ ] Nút "Sao chép STK" → Toast "Đã sao chép!"
- [ ] Clipboard có STK

---

### 12. **Footer**
- [ ] Tên cặp đôi
- [ ] Ngày cưới
- [ ] Credits / copyright

---

### 13. **Quick Actions** (Mobile FAB)
**Chỉ hiện khi resize <1024px**
- [ ] 2 nút nổi ở bottom:
  - **Lời chúc** (icon message)
  - **Mừng cưới** (icon money)
- [ ] Click → scroll hoặc mở modal
- [ ] Fixed bottom với blur background

---

### 14. **Nút Nhạc Nổi** 🎵 (Top-right)
- [ ] Nút hiển thị góc trên phải
- [ ] Icon nốt nhạc
- [ ] Khi nhạc đang phát: **icon quay** (spin animation)
- [ ] Click → toggle bật/tắt nhạc
- [ ] Hover → scale lớn hơn + shadow

---

### 15. **Cánh hoa rơi** 🌸 (Background)
- [ ] ~28 cánh hoa rơi liên tục
- [ ] Chuyển động tự nhiên (sway, rotate, fade)
- [ ] Màu hồng pastel đa dạng
- [ ] Không block tương tác
- [ ] Smooth 30-60 FPS

---

### 16. **Responsive** 📱

#### Desktop (>1024px)
- [ ] Layout rộng, 3-4 cột
- [ ] Hover effects hoạt động
- [ ] Masonry grid cho album

#### Tablet (768-1024px)
- [ ] Layout 2-3 cột
- [ ] Quick Actions ẩn
- [ ] Masonry grid 3 cột

#### Mobile (<768px)
- [ ] Layout 1 cột
- [ ] Font size nhỏ hơn
- [ ] Quick Actions hiện
- [ ] **Swiper cho album** (thay grid)
- [ ] Touch-friendly (buttons lớn hơn)
- [ ] Burger menu nếu có

---

### 17. **Performance**

#### Load time
- [ ] First paint < 2s
- [ ] Interactive < 3s
- [ ] Ảnh lazy load (chỉ tải khi scroll gần)

#### Animations
- [ ] Smooth 60 FPS (không giật lag)
- [ ] Scroll smooth
- [ ] No jank khi resize

#### Console
- [ ] Không có error (màu đỏ)
- [ ] Warning chấp nhận được (màu vàng)

---

### 18. **Accessibility**

#### Keyboard navigation
- [ ] Tab qua các element
- [ ] Enter để click button/link
- [ ] Esc để đóng modal/lightbox

#### Screen reader (optional)
- [ ] Aria labels có
- [ ] Alt text cho ảnh

#### Contrast
- [ ] Text đọc rõ trên background

---

## 🐛 Các lỗi thường gặp

### 1. Nhạc không phát
**Nguyên nhân:** File `public/music/background.mp3` chưa có

**Giải pháp:**
- Download nhạc miễn phí: [Pixabay](https://pixabay.com/music/), [Uppbeat](https://uppbeat.io)
- Đặt vào `public/music/background.mp3`
- Refresh page

### 2. Ảnh không hiển thị (placeholder)
**Nguyên nhân:** File ảnh trong `public/images/` chưa có

**Giải pháp:**
- Thay ảnh thật vào `public/images/`
- Danh sách: `hero-1.webp`, `groom.webp`, `album-1.webp`...
- Xem `ASSETS_CHECKLIST.md`

### 3. Countdown đã âm (0:0:0:0)
**Không phải lỗi!** Ngày cưới (11/01/2025) đã qua

**Kiểm tra:** Nên thấy "Hôm nay là ngày cưới!" + confetti

**Để test countdown thật:**
```typescript
// src/data/weddingData.ts
weddingDate: new Date('2025-12-31T18:00:00'), // Đổi sang tương lai
```

### 4. Maps không hiển thị địa chỉ đúng
**Nguyên nhân:** Địa chỉ dummy (123 ABC...)

**Giải pháp:**
- Đổi địa chỉ thật trong `weddingData.ts`
- Xem `MAPS_SETUP_GUIDE.md`

### 5. Swiper không vuốt được
**Nguyên nhân:** Đang test trên desktop

**Giải pháp:**
- Resize browser < 768px width
- Hoặc mở DevTools → Device Mode (Ctrl+Shift+M)
- Hoặc test trên điện thoại thật

### 6. Filter album không hoạt động
**Kiểm tra:** Console có error không?

**Nguyên nhân có thể:**
- Category ảnh sai (phải là 'prewedding' hoặc 'wedding')
- Logic filter bị sai

### 7. Confetti không xuất hiện
**Kiểm tra:**
- Countdown đã về 0 chưa?
- Đã scroll đến section Countdown chưa? (confetti chỉ trigger khi visible)

---

## 📊 Test Matrix (nhanh)

| Feature | Desktop | Tablet | Mobile | Status |
|---------|---------|--------|--------|--------|
| Preloader | ✅ | ✅ | ✅ | |
| Envelope + Music + Petals | ✅ | ✅ | ✅ | |
| Hero Slideshow | ✅ | ✅ | ✅ | |
| Countdown + Confetti | ✅ | ✅ | ✅ | |
| Album Masonry | ✅ | ✅ | ❌ | |
| Album Swiper | ❌ | ❌ | ✅ | |
| Events + Maps | ✅ | ✅ | ✅ | |
| Guestbook | ✅ | ✅ | ✅ | |
| Quick Actions | ❌ | ❌ | ✅ | |

---

## 🎯 Priority Test (nếu không đủ thời gian)

**Phải test:**
1. ✅ Envelope mở → nhạc + petals
2. ✅ Countdown confetti (nếu đã qua ngày)
3. ✅ Album swiper mobile
4. ✅ Maps embed + chỉ đường

**Nên test:**
5. Hero slideshow
6. Album masonry desktop
7. Guestbook submit
8. Responsive mobile

**Tùy chọn:**
9. Keyboard navigation
10. Performance metrics

---

## 🚀 Next Steps

Sau khi test xong:
1. **Fix bugs** (nếu có)
2. **Thay ảnh + nội dung** thật
3. **Thêm nhạc nền**
4. **Test lại lần nữa**
5. **Deploy** (xem `DEPLOYMENT_CHECKLIST.md`)

---

**Dev Server đang chạy:** http://localhost:5173  
**Stop server:** Ctrl+C trong terminal

Chúc test thành công! 🎊
