# 🗺️ Google Maps - Hướng dẫn Setup

## ✨ Tính năng đã tích hợp

### 1. **Embed Google Maps trong Event Card**
- Click nút "Bản đồ" → map hiển thị ngay trong card
- Responsive, lazy load (chỉ tải khi cần)
- Có nút "Mở trong Google Maps" để xem fullscreen

### 2. **Nút Chỉ đường**
- Tự động mở Google Maps Navigation
- Tính toán route từ vị trí hiện tại → địa điểm sự kiện
- Hoạt động trên cả mobile và desktop

### 3. **Nút thêm vào Lịch** (giữ nguyên)
- Google Calendar / Apple Calendar / Outlook

---

## 🚀 Hoạt động ngay (không cần API key)

Mình đã dùng **Google Maps iframe embed** (phương pháp public), hoạt động ngay không cần đăng ký.

**Test ngay:**
```bash
npm run dev
```

Scroll xuống "Sự Kiện Cưới" → click "Bản đồ" → map sẽ hiển thị.

---

## 📍 Cách map tìm địa chỉ chính xác

Google Maps tìm địa chỉ dựa trên text query. Để chính xác hơn:

### ✅ Địa chỉ tốt (dễ tìm):
```typescript
// Đầy đủ: số nhà, đường, quận, thành phố
address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'

// Tên địa điểm nổi tiếng
address: 'Trung tâm Hội nghị Gem Center, TP. Hồ Chí Minh'

// Tọa độ (chính xác 100%)
address: '10.762622,106.660172'
```

### ❌ Địa chỉ không rõ:
```typescript
// Quá chung chung
address: 'Tư gia nhà trai'

// Thiếu thành phố
address: '123 Đường ABC'
```

---

## 🔧 Nâng cấp (tùy chọn): Dùng Google Maps API Key

API key cho phép:
- Custom style bản đồ (màu sắc, hide labels...)
- Đặt marker chính xác
- Hiển thị info window
- Tránh giới hạn request (nếu traffic cao)

### Bước 1: Lấy API Key miễn phí
1. Truy cập: https://console.cloud.google.com/google/maps-apis/
2. Tạo project mới (hoặc chọn project hiện có)
3. **Enable APIs**: 
   - Maps Embed API
   - Maps JavaScript API
4. **Credentials** → Create API Key
5. **Restrict key** (quan trọng):
   - Application restrictions: HTTP referrers
   - Thêm domain: `yourdomain.com/*`, `localhost:*`
   - API restrictions: chỉ enable Maps Embed API

### Bước 2: Thêm vào code
Mở `src/components/EventsSection.tsx`, tìm đoạn:

```typescript
// CÁCH 2: Dùng iframe search (không cần API key, hoạt động ngay)
const getMapEmbedUrl = (address: string) => {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};
```

Đổi thành:

```typescript
// CÁCH 1: Dùng Embed API (có API key)
const getMapEmbedUrl = (address: string) => {
  const API_KEY = 'YOUR_API_KEY_HERE'; // Paste key vào đây
  return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodeURIComponent(address)}&zoom=15&maptype=roadmap`;
};
```

### Bước 3: Bảo mật API key (production)
Đừng commit key trực tiếp lên Git. Dùng environment variable:

**File `.env` (local):**
```
VITE_GOOGLE_MAPS_KEY=YOUR_API_KEY_HERE
```

**Code:**
```typescript
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';
```

**File `.gitignore` (đã có sẵn):**
```
.env
.env.local
```

---

## 🎯 Dùng Place ID (chính xác nhất)

Nếu muốn map hiển thị chính xác 100% (không lệch), dùng **Place ID**:

### Cách lấy Place ID:
1. Mở https://www.google.com/maps
2. Tìm địa điểm
3. Copy URL, tìm đoạn `!1s` + `0x...`
4. Hoặc dùng: https://developers.google.com/maps/documentation/places/web-service/place-id

**Ví dụ:**
```
Place ID: ChIJN1t_tDeuEmsRUsoyG83frY4
```

### Thêm vào weddingData:
```typescript
// src/data/weddingData.ts
events: [
  {
    id: 1,
    name: 'Tiệc nhà trai',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4', // ⬅️ Thêm
    // ...
  },
]
```

### Code:
```typescript
const getMapEmbedUrl = (event: { address: string; placeId?: string }) => {
  const API_KEY = 'YOUR_KEY';
  const query = event.placeId 
    ? `place_id:${event.placeId}` 
    : encodeURIComponent(event.address);
  return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${query}&zoom=16`;
};
```

---

## 📱 Mobile: Mở Google Maps App

Nút "Chỉ đường" tự động mở:
- **Mobile**: Google Maps app (nếu có) hoặc browser
- **Desktop**: Google Maps web

Không cần code thêm gì, đã tối ưu sẵn.

---

## 🎨 Custom zoom level

Trong `getMapEmbedUrl`, đổi `&zoom=15`:
- **13**: Nhìn thấy cả khu vực (vài km)
- **15**: Mặc định, vừa phải
- **17**: Zoom sát, thấy từng nhà
- **19**: Zoom cực gần (satellite mode)

---

## 🐛 Troubleshooting

**Map không hiển thị?**
1. Kiểm tra địa chỉ có chính xác không
2. Thử search thủ công trên google.com/maps
3. Mở DevTools Console xem lỗi
4. Nếu dùng API key: check có enable Maps Embed API chưa

**Map hiện sai địa điểm?**
→ Dùng Place ID (xem mục trên)

**"This page can't load Google Maps correctly"?**
→ API key bị restrict sai hoặc chưa enable billing (Google cần thẻ để verify, nhưng $200 free/tháng)

---

## 💡 Giá Google Maps API

- **$200 credit miễn phí mỗi tháng** (tương đương ~28,000 map loads)
- Nếu vượt: $7/1000 loads
- **Website cưới traffic thấp → FREE hoàn toàn**

---

Chúc bạn setup thành công! 🎊
