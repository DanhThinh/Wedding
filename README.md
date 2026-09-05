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

## 🗺 Các route

| Route | Giao diện |
|-------|-----------|
| `/` | **Thiệp bản demo** — dựng lại theo `Demo/Demo.mp4`: bìa thiệp có con dấu sáp → Save The Date → Our Love Story → Và hôm nay → Wedding Ceremony → địa chỉ tổ chức → TimeLine → Photobooth → R.S.V.P → Hộp Quà Mừng → Album Ảnh Cưới |
| `/classic` | Giao diện cũ (header + phong bì 3D + quick actions) |
| `/rsvp` | Trang RSVP đầy đủ (tên, SĐT, chọn sự kiện) |

Nội dung của giao diện thiệp nằm ở `src/data/inviteData.ts` (dùng lại tên,
ngày cưới và ảnh từ `weddingData.ts`). Cần sửa tay hai chỗ:

- `venue.name` / `venue.address` — cũng là chuỗi tra cứu cho bản đồ Google.
- `timeline.items` — 4 mốc giờ trong ngày cưới.

Ngày âm lịch ở phần *Wedding Ceremony* được tính tự động từ `weddingDate`
(`src/lib/lunar.ts`), không cần nhập tay.

## 💌 Thiệp mời riêng theo tên khách

Tên khách nằm thẳng trong link, không cần lưu danh sách ở đâu cả:

```
https://danhthinh.github.io/Wedding/?t=Anh&guest=Nguyễn%20Văn%20Quang
                                     └ xưng hô ┘  └──── họ tên ────┘
```

- `guest` (bắt buộc) — thiếu tham số này thì thiệp chạy y như bản dùng chung.
- `t` (không bắt buộc) — xưng hô: Anh / Chị / Gia đình…
- Gõ tay: chỉ cần thay mỗi dấu cách bằng `%20`, chữ có dấu để nguyên.

Khi có tên, thiệp sẽ: hiện "Trân trọng kính mời + tên" trên bìa, thêm khối
"Thân mời" sau Save The Date, và điền sẵn ô họ tên ở phần R.S.V.P lẫn Gửi lời chúc.

### Sinh link hàng loạt

```bash
cp guests.example.csv guests.csv     # rồi điền danh sách thật vào
npm run guests                       # in ra bảng + ghi guests-links.csv
npm run guests -- --base https://tenmien-khac/   # đổi tên miền
```

CSV có 2 cột `xung_ho,ho_ten` (cột xưng hô để trống cũng được).
`guests.csv` và `guests-links.csv` đã nằm trong `.gitignore` — đó là danh sách
khách thật, đừng commit lên repo công khai.

> Lưu ý: khách chuyển tiếp link cho người khác thì người đó sẽ thấy tên sai —
> hệ quả tất yếu của việc để tên trong URL.

## 📁 Cấu trúc Project

```
src/
├── components/
│   ├── invite/          # ⭐ Giao diện thiệp bản demo (route `/`)
│   │   ├── art.tsx              # Hoa ly, con dấu sáp, máy ảnh, hộp quà… (SVG)
│   │   ├── InviteCover.tsx      # Bìa thiệp, chạm để tách đôi
│   │   ├── InviteHero.tsx       # Save The Date
│   │   ├── InviteGreeting.tsx   # Dòng "Thân mời <tên khách>"
│   │   ├── InviteStory.tsx      # Our Love Story
│   │   ├── InviteCouple.tsx     # Và hôm nay — cô dâu / chú rể
│   │   ├── InviteCeremony.tsx   # Wedding Ceremony + lịch tháng cưới
│   │   ├── InviteVenue.tsx      # Địa chỉ tổ chức + Google Maps
│   │   ├── InviteTimeline.tsx   # TimeLine 4 mốc giờ
│   │   ├── InvitePhotobooth.tsx # Máy ảnh cổ + dải polaroid
│   │   ├── InviteRsvp.tsx       # Khối R.S.V.P
│   │   ├── InviteRsvpSheet.tsx  # Bảng xác nhận tham dự
│   │   ├── InviteGift.tsx       # Hộp Quà Mừng
│   │   ├── InviteAlbum.tsx      # Album Ảnh Cưới (lightbox) + Lời cảm ơn — nạp trễ
│   │   └── InviteDock.tsx       # Nút nhạc, watermark, thanh dock dưới
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
│   ├── InvitePage.tsx    # Route `/` — ghép các khối invite/
│   ├── HomePage.tsx      # Route `/classic`
│   └── RSVPPage.tsx
├── hooks/
│   ├── useWedding.tsx    # Context provider
│   ├── useCountdown.ts   # Countdown timer hook
│   └── useScrollAnimation.ts
├── lib/
│   ├── guest.ts          # Đọc / sinh link mời riêng theo tên khách
│   ├── inviteSession.ts  # Trạng thái phiên: đã mở bìa chưa, đang mời ai
│   └── lunar.ts          # Đổi ngày dương → âm lịch
├── data/
│   ├── weddingData.ts    # ⭐ Thay đổi nội dung ở đây
│   └── inviteData.ts     # ⭐ Nội dung riêng của giao diện thiệp
├── styles/
│   ├── main.scss         # Global styles
│   └── partials/
│       └── _invite.scss  # Toàn bộ style của giao diện thiệp
└── App.tsx
```

## 🎨 Thay đổi Assets (Ảnh)

Thay các ảnh trong thư mục `public/images/`:

| File | Mô tả |
|------|-------|
| `images/hero/slide-01.webp` đến `slide-05.webp` | Ảnh slideshow hero section |
| `images/couple/groom-portrait.webp` | Ảnh chú rể |
| `images/couple/bride-portrait.webp` | Ảnh cô dâu |
| `images/story/moment-01.webp` đến `moment-03.webp` | Ảnh timeline câu chuyện |
| `images/album/photo-01.webp` đến `photo-08.webp` | Ảnh album cưới |
| `images/qr/groom-qr.webp` | QR code chuyển khoản chú rể |
| `images/qr/bride-qr.webp` | QR code chuyển khoản cô dâu |
| `images/system/favicon.svg` | Icon tab trình duyệt |

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
  weddingDate: new Date('2027-01-11T11:00:00+07:00'),
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
Với bản GitHub Pages, tạo các Actions Variables cùng tên `VITE_FIREBASE_*`
(tối thiểu `VITE_FIREBASE_API_KEY` và `VITE_FIREBASE_PROJECT_ID`). Khuyến nghị
cấu hình thêm `VITE_FIREBASE_APPCHECK_SITE_KEY` và bật App Check enforcement cho
Cloud Firestore để hạn chế ghi dữ liệu tự động.

```bash
npm run test
npm run lint
npm run build
```

---

Made with ❤️ for the wedding of Nguyễn Danh Thịnh & Phạm Thị Thuý Hằng
