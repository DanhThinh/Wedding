# 💬 Guestbook Realtime - Hướng dẫn Setup Firebase

## ✨ Tính năng

### 2 chế độ tự động
| Chế độ | Khi nào | Đặc điểm |
|--------|---------|----------|
| **🟢 Realtime** | Đã config Firebase | Khách thấy lời chúc của nhau **NGAY LẬP TỨC** |
| **💾 localStorage** | Chưa config | Vẫn hoạt động, lưu trên máy khách |

**App tự động phát hiện** — không cần đổi code!

---

## 🎯 Realtime hoạt động thế nào?

```
Khách A gửi lời chúc
       ↓
   Firestore
       ↓ (realtime push)
Khách B, C, D... thấy NGAY (không cần refresh)
```

Khi config Firebase, guestbook hiển thị badge **"🟢 Cập nhật trực tiếp"**.

---

## 🚀 Setup Firebase (10 phút, miễn phí)

### Bước 1: Tạo Firebase Project
1. Truy cập https://console.firebase.google.com
2. Click **"Add project"** (hoặc "Thêm dự án")
3. Đặt tên: `wedding-thinh-hang` (tùy ý)
4. Tắt Google Analytics (không cần) → Create

### Bước 2: Tạo Firestore Database
1. Menu trái → **Build → Firestore Database**
2. Click **"Create database"**
3. Chọn **"Start in production mode"** → Next
4. Location: chọn **asia-southeast1 (Singapore)** (gần VN nhất)
5. Enable

### Bước 3: Cấu hình Security Rules
1. Tab **"Rules"** trong Firestore
2. Paste rules sau (cho phép đọc + ghi lời chúc):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wishes/{wish} {
      // Ai cũng đọc được lời chúc
      allow read: if true;
      // Ai cũng gửi được, nhưng validate dữ liệu
      allow create: if request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() < 100
        && request.resource.data.message is string
        && request.resource.data.message.size() > 0
        && request.resource.data.message.size() < 1000;
      // Không cho sửa/xóa (tránh phá hoại)
      allow update, delete: if false;
    }
  }
}
```

3. Click **"Publish"**

### Bước 4: Đăng ký Web App
1. Project Overview → click icon **`</>`** (Web)
2. App nickname: `wedding-web`
3. **KHÔNG** check "Firebase Hosting" (chưa cần)
4. Register app
5. Copy đoạn `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXX",
  authDomain: "wedding-xxx.firebaseapp.com",
  projectId: "wedding-xxx",
  storageBucket: "wedding-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Bước 5: Thêm config vào dự án
1. Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

2. Mở `.env`, điền thông tin:
```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=wedding-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=wedding-xxx
VITE_FIREBASE_STORAGE_BUCKET=wedding-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

3. **Restart dev server** (quan trọng, để load .env):
```bash
# Ctrl+C để stop, rồi chạy lại
npm run dev
```

### Bước 6: Test
1. Mở web → scroll xuống "Sổ Lưu Bút"
2. Thấy badge **"🟢 Cập nhật trực tiếp"** → thành công!
3. Mở web ở 2 tab/2 máy
4. Gửi lời chúc ở tab 1 → tab 2 thấy ngay (không refresh)

---

## 🔒 Bảo mật

### API Key có lộ không?
**Firebase API key KHÔNG phải secret** — nó chỉ định danh project, an toàn để public.

Bảo mật thật nằm ở **Security Rules** (đã setup ở Bước 3).

### Rules đã chặn gì?
- ✅ Cho đọc lời chúc (ai cũng xem được)
- ✅ Cho gửi lời chúc (validate độ dài)
- ❌ Không cho sửa lời chúc người khác
- ❌ Không cho xóa lời chúc
- ❌ Chặn spam (giới hạn độ dài name < 100, message < 1000)

### Chống spam thêm (optional)
Thêm rate limit bằng App Check:
1. Firebase Console → App Check
2. Enable reCAPTCHA v3
3. Thêm vào code (xem Firebase docs)

---

## 💰 Chi phí

Firebase Firestore **Free tier (Spark plan):**
- 50,000 reads/ngày
- 20,000 writes/ngày
- 1GB storage

**Website cưới:** Dùng vài trăm lượt → **FREE hoàn toàn**

Không cần thẻ tín dụng cho Spark plan.

---

## 🛠️ Quản lý lời chúc

### Xem tất cả lời chúc
Firebase Console → Firestore Database → collection `wishes`

### Xóa lời chúc spam/không phù hợp
1. Vào Firestore Console
2. Click document cần xóa
3. Delete

### Export lời chúc (lưu kỷ niệm)
```bash
# Cài Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Export
firebase firestore:export ./backup
```

---

## 🐛 Troubleshooting

### Badge "Realtime" không hiện
**Nguyên nhân:** Chưa load .env hoặc config sai

**Giải pháp:**
1. Kiểm tra file `.env` có đúng tên không (không phải `.env.txt`)
2. Restart dev server (Ctrl+C → `npm run dev`)
3. Mở DevTools Console xem lỗi

### Lỗi "Missing or insufficient permissions"
**Nguyên nhân:** Security Rules chưa publish hoặc sai

**Giải pháp:**
- Kiểm tra Rules ở Bước 3
- Click "Publish" lại
- Đợi 1 phút để rules áp dụng

### Lỗi "Failed to get document"
**Nguyên nhân:** projectId sai hoặc Firestore chưa tạo

**Giải pháp:**
- Kiểm tra `VITE_FIREBASE_PROJECT_ID` đúng chưa
- Đảm bảo đã tạo Firestore Database (Bước 2)

### Lời chúc không hiện realtime
**Nguyên nhân:** Network hoặc rules chặn read

**Giải pháp:**
- Check `allow read: if true` trong Rules
- Mở Network tab xem request có thành công không

---

## 🔄 Chuyển đổi giữa 2 chế độ

### Đang dùng localStorage, muốn lên Realtime
→ Làm theo Bước 1-6 ở trên

### Đang dùng Realtime, muốn về localStorage
→ Xóa hoặc comment các dòng trong `.env`:
```env
# VITE_FIREBASE_API_KEY=...
```
→ Restart server

### Migrate data localStorage → Firestore
Lời chúc cũ trong localStorage không tự chuyển. Nếu cần:
1. Mở DevTools Console
2. Chạy:
```javascript
JSON.parse(localStorage.getItem('wedding-wishes'))
```
3. Copy data, thêm thủ công vào Firestore Console

---

## 📊 Kiến trúc Code

```
src/
├── lib/
│   └── firebase.ts          # Config + init Firebase
│
├── hooks/
│   ├── useGuestbook.ts      # Logic 2 chế độ (Firestore/localStorage)
│   └── useWedding.tsx       # Context tích hợp useGuestbook
│
└── components/
    ├── GuestbookSection.tsx # UI + realtime badge
    └── Modal.tsx            # GuestbookModal
```

### Adapter Pattern
`useGuestbook` tự động chọn backend:
```typescript
if (isFirebaseConfigured && db) {
  // Firestore realtime (onSnapshot)
} else {
  // localStorage (với storage event sync)
}
```

→ Component không cần biết đang dùng backend nào.

---

## 🎯 Nâng cao (optional)

### 1. Thêm reactions (♥ like)
```typescript
// Thêm field vào document
{ name, message, createdAt, likes: 0 }

// Update likes
await updateDoc(doc(db, 'wishes', id), {
  likes: increment(1)
});
```

### 2. Avatar emoji ngẫu nhiên
```typescript
const avatars = ['🌸', '💐', '🌹', '💕', '🎉'];
const avatar = avatars[Math.floor(Math.random() * avatars.length)];
```

### 3. Moderation (duyệt trước khi hiện)
```javascript
// Rules: chỉ hiện wish đã approved
allow read: if resource.data.approved == true;
```

### 4. Pagination (nếu nhiều lời chúc)
```typescript
import { limit, startAfter } from 'firebase/firestore';
query(collection(db, 'wishes'), orderBy('createdAt', 'desc'), limit(20))
```

---

## ✅ Checklist Setup

- [ ] Tạo Firebase project
- [ ] Tạo Firestore Database (asia-southeast1)
- [ ] Setup Security Rules + Publish
- [ ] Đăng ký Web App
- [ ] Copy config vào `.env`
- [ ] Restart dev server
- [ ] Thấy badge "🟢 Cập nhật trực tiếp"
- [ ] Test gửi lời chúc ở 2 tab
- [ ] Deploy (nhớ thêm env vars trên hosting)

---

## 🚀 Deploy với Firebase

### Vercel/Netlify
Thêm Environment Variables trong dashboard:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
(tất cả VITE_FIREBASE_*)
```

### Firebase Hosting
```bash
firebase init hosting
firebase deploy
```

---

Chúc bạn setup thành công! Lời chúc realtime sẽ làm khách thích thú 💕
