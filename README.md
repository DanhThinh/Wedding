# Wedding Invitation Clone - Nguyễn Danh Thịnh & Phạm Thị Thuý Hằng

Clone pixel-perfect của website thiệp cưới online, với đầy đủ animations và interactions.

## 🚀 Chạy Local

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Cấu trúc Project

```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── CoupleSection.tsx
│   ├── StorySection.tsx
│   ├── CountdownSection.tsx
│   ├── AlbumSection.tsx
│   ├── EventsSection.tsx
│   ├── GuestbookSection.tsx
│   ├── GiftBoxSection.tsx
│   ├── QuickActions.tsx
│   ├── Preloader.tsx
│   ├── Toast.tsx
│   └── Modal.tsx
├── pages/
│   ├── HomePage.tsx
│   └── RSVPPage.tsx
├── hooks/
│   ├── useWedding.tsx    # Context provider
│   ├── useCountdown.ts   # Countdown timer hook
│   └── useScrollAnimation.ts
├── data/
│   └── weddingData.ts    # ⭐ Thay đổi nội dung ở đây
├── styles/
│   └── main.scss         # Global styles
└── App.tsx
```

## 🎨 Thay đổi Assets (Ảnh)

Thay các ảnh trong thư mục `public/images/`:

| File | Mô tả |
|------|-------|
| `hero-1.webp` đến `hero-5.webp` | Ảnh slideshow hero section |
| `groom.webp` | Ảnh chú rể |
| `bride.webp` | Ảnh cô dâu |
| `story-1.webp` đến `story-3.webp` | Ảnh timeline câu chuyện |
| `album-1.webp` đến `album-8.webp` | Ảnh album cưới |
| `qr-groom.png` | QR code chuyển khoản chú rể |
| `qr-bride.png` | QR code chuyển khoản cô dâu |
| `favicon.svg` | Icon tab trình duyệt |

## 📝 Thay đổi Nội dung

Chỉnh sửa file `src/data/weddingData.ts`:

```typescript
export const weddingData = {
  groom: {
    fullName: 'Nguyễn Danh Thịnh',    // Họ tên đầy đủ chú rể
    shortName: 'Danh Thịnh',           // Tên ngắn
    initial: 'T',                       // Chữ cái đầu cho monogram
    description: '...',                 // Mô tả
    bank: { ... },                      // Thông tin ngân hàng
  },
  bride: {
    fullName: 'Phạm Thị Thuý Hằng',
    shortName: 'Thuý Hằng',
    initial: 'H',
    // ...
  },
  weddingDate: new Date('2025-01-11T11:00:00'),
  events: [...],
  story: [...],
  // ...
};
```

## ✅ Parity Checklist - Animation/Interaction Match

| Feature | Duration | Easing | Status |
|---------|----------|--------|--------|
| Preloader heart pulse | 1.2s | ease-in-out | ✅ |
| Hero slideshow | 5s interval, 1s fade, 10s zoom | ease-out | ✅ |
| Hero text slide-in | 0.8s | ease-out | ✅ |
| Scroll reveal animations | 0.8s | ease | ✅ |
| Couple card expand/collapse | instant | - | ✅ |
| Timeline alternating layout | - | - | ✅ |
| Countdown realtime | 1s tick | - | ✅ |
| Gallery lightbox | 500ms | ease | ✅ |
| Gallery hover zoom | 0.5s | ease | ✅ |
| Calendar popover | 0.2s | ease | ✅ |
| Toast notification | 0.3s in, 3s display, 0.3s out | ease | ✅ |
| Modal overlay blur | 4px blur, 0.3s | ease | ✅ |
| Modal scale animation | 0.3s | ease | ✅ |
| Button hover lift | 0.3s | ease | ✅ |
| Quick actions fixed bottom | - | - | ✅ |
| Copy to clipboard + toast | instant + 3s | - | ✅ |
| Form validation | instant | - | ✅ |
| RSVP success redirect | instant | - | ✅ |

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + SCSS
- **Animation**: CSS animations + transitions
- **Gallery**: LightGallery
- **Routing**: React Router DOM
- **State**: React Context + localStorage

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

## 🔧 Mock API

- **Guestbook**: Firestore realtime khi có cấu hình; localStorage dùng cho development fallback.
- **RSVP**: Gửi vào Firestore khi có cấu hình; localStorage fallback không gửi dữ liệu đến chủ tiệc.

## Firebase và kiểm thử

Sao chép `.env.example` thành `.env`, điền cấu hình Firebase rồi deploy `firestore.rules`.

```bash
npm run test
npm run lint
npm run build
```

---

Made with ❤️ for the wedding of Nguyễn Danh Thịnh & Phạm Thị Thuý Hằng
