# 🧪 Guestbook Test Checklist

## Tình trạng hiện tại
- **Chế độ:** localStorage (fallback)
- **Firebase:** Chưa config
- **Dev server:** ✅ Running at http://localhost:5173
- **Build:** ✅ Thành công, không lỗi
- **Bundle:** 81KB gzipped (Firebase chunk)

---

## ✅ Test localStorage Mode (Manual)

### 1. Hiển thị Guestbook
- [ ] Mở http://localhost:5173
- [ ] Click "Mở thiệp"
- [ ] Scroll xuống "Sổ Lưu Bút"
- [ ] Thấy 2 lời chúc mặc định (Minh Anh, Hoàng Dũng)
- [ ] **KHÔNG** thấy badge "🟢 Cập nhật trực tiếp" (đúng)

### 2. Gửi lời chúc
- [ ] Nhập tên: "Test User"
- [ ] Nhập lời chúc: "Chúc mừng hạnh phúc!"
- [ ] Click "Gửi lời chúc ✦"
- [ ] Toast "Gửi lời chúc thành công!" hiện
- [ ] Lời chúc xuất hiện đầu danh sách
- [ ] Form reset về trống
- [ ] Animation fade-in mượt

### 3. Validation
- [ ] Để trống tên, click gửi
- [ ] Toast "Vui lòng nhập đầy đủ thông tin!"
- [ ] Form shake animation

### 4. Gợi ý nhanh
- [ ] Click "Chúc hai bạn trăm năm hạnh phúc!"
- [ ] Textarea tự động điền

### 5. localStorage Persist
- [ ] Refresh trang (F5)
- [ ] Lời chúc vẫn còn

### 6. Multi-tab Sync
- [ ] Mở tab 2: http://localhost:5173
- [ ] Gửi lời chúc ở tab 1
- [ ] Tab 2 tự động cập nhật (trong 1-2s)

### 7. Responsive Mobile
- [ ] Toggle DevTools responsive (Ctrl+Shift+M)
- [ ] Test 375px (mobile)
- [ ] Form và danh sách stack dọc
- [ ] Input đủ lớn, dễ nhấn
- [ ] Scroll mượt

---

## 🔥 Test Realtime Mode (Optional)

### Bước 1: Setup Firebase (10 phút)
1. Tạo Firebase project tại https://console.firebase.google.com
2. Enable Firestore Database (asia-southeast1)
3. Setup Security Rules (xem `GUESTBOOK_REALTIME_GUIDE.md`)
4. Lấy Web App config

### Bước 2: Config .env
```bash
# Tạo file .env từ template
cp .env.example .env

# Điền thông tin Firebase vào .env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_PROJECT_ID=wedding-xxx
# ... (các biến khác)
```

### Bước 3: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Bước 4: Test Realtime
- [ ] Mở http://localhost:5173
- [ ] Scroll xuống Guestbook
- [ ] **Thấy badge "🟢 Cập nhật trực tiếp"** (quan trọng!)
- [ ] Mở 2 tab/2 máy khác nhau
- [ ] Gửi lời chúc ở tab 1
- [ ] Tab 2 thấy **NGAY LẬP TỨC** (không cần refresh)

### Bước 5: Check Firestore Console
- [ ] Vào Firebase Console → Firestore Database
- [ ] Thấy collection `wishes`
- [ ] Thấy documents với fields: name, message, createdAt

---

## 🐛 Troubleshooting

### Badge "Realtime" không hiện (sau khi config)
**Nguyên nhân:** File .env chưa load hoặc config sai

**Giải pháp:**
1. Kiểm tra file `.env` (không phải `.env.txt`)
2. Restart dev server (Ctrl+C → `npm run dev`)
3. Check DevTools Console có lỗi không
4. Verify `VITE_FIREBASE_PROJECT_ID` đúng

### Lời chúc không sync realtime
**Nguyên nhân:** Security Rules chặn

**Giải pháp:**
1. Vào Firebase Console → Firestore → Rules
2. Check `allow read: if true;` có đúng không
3. Publish rules lại
4. Đợi 1 phút

### Build error "Cannot find module firebase"
**Nguyên nhân:** Dependencies chưa install

**Giải pháp:**
```bash
npm install firebase
```

---

## 📊 Kết quả mong đợi

### localStorage Mode (hiện tại)
✅ Lời chúc lưu trên máy khách  
✅ Sync giữa tabs trong cùng trình duyệt  
❌ Không sync giữa máy/thiết bị khác  
✅ Không cần Firebase, hoạt động ngay  

### Realtime Mode (sau khi setup)
✅ Lời chúc lưu trên Firestore (cloud)  
✅ Sync **tức thì** giữa tất cả khách  
✅ Badge "🟢 Cập nhật trực tiếp"  
✅ Khách thấy lời chúc của nhau **ngay lập tức**  

---

## 🎯 Next Steps

### Nếu localStorage đủ tốt:
→ Không cần làm gì, deploy như hiện tại

### Nếu muốn realtime:
→ Làm theo `GUESTBOOK_REALTIME_GUIDE.md` (10 phút)

### Khi deploy production:
→ Check `DEPLOYMENT_CHECKLIST.md`

---

**Test completed:** ___________  
**Tester:** ___________  
**Issues found:** ___________
