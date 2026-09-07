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
| `/` | **Thiệp bản demo** — dựng lại theo `Demo/Demo.mp4`: bìa thiệp có con dấu sáp → Save The Date → Our Love Story → Và hôm nay → Wedding Ceremony → địa chỉ tổ chức và lịch trình từng tiệc → Photobooth → R.S.V.P → Hộp Quà Mừng → Album Ảnh Cưới |
| `/classic` | Giao diện cũ (header + phong bì 3D + quick actions) |
| `/rsvp` | Cùng form RSVP với thiệp: có/không, tên, chọn tiệc, số người đi cùng, SĐT tùy chọn và lời nhắn |
| `/manage` | Mở tệp danh sách khách riêng tư, lọc theo tiệc, tổng hợp số người và xuất CSV |

Nội dung của giao diện thiệp nằm ở `src/data/inviteData.ts` (dùng lại tên,
ngày cưới và ảnh từ `weddingData.ts`). Cập nhật nội dung tại:

- `weddingData.events` trong `src/data/weddingData.ts` — ba tiệc nhà trai,
  nhà gái và tiệc cưới, theo đúng thứ tự hiển thị. Điền `location` (tên địa điểm),
  `address` (địa chỉ đầy đủ), `date`, `time` và `timeDisplay`. Giữ ID 1/2/3 để
  khớp dữ liệu RSVP. Trang chủ, giao diện classic và RSVP dùng chung danh sách này.
  `mapQuery` dùng để ghim tọa độ chính xác khi có link Google Maps; để trống sẽ
  tra cứu theo `address`. Nhà trai và tiệc cưới dùng chung `groomVenue` ở đầu file.
- `weddingData.events[].timeline` — lịch trình riêng cho từng tiệc, gồm `id`,
  `time` (HH:mm, giờ Việt Nam) và `label`. Mỗi thẻ có nút xổ xuống “Xem lịch trình”,
  mặc định thu gọn và mở độc lập, kể cả khi chưa có địa chỉ. Ngày của các mốc
  lấy từ `date` của tiệc. Để danh sách trống nếu chưa chốt lịch trình.
  Hiện tiệc nhà trai giữ mốc 11:00 đón khách / 11:30 khai tiệc từ lịch cũ;
  nhà gái và tiệc cưới dùng giờ bắt đầu hiện có, có thể bổ sung mốc chi tiết.

Mỗi thẻ chỉ có nút “Chỉ đường” để mở Google Maps đến địa chỉ của tiệc đó,
không nhúng bản đồ trong thiệp. Nút chỉ xuất hiện khi
đã có địa chỉ thật; địa chỉ trống hoặc còn ghi “cập nhật” sẽ hiện thông báo chờ
cập nhật. Ngày, giờ và lịch tháng
trên thiệp luôn theo giờ Việt Nam (UTC+7), kể cả khi khách mở ở nước ngoài.

Ngày âm lịch ở phần *Wedding Ceremony* được tính tự động từ `weddingDate`
(`src/lib/lunar.ts`), không cần nhập tay.

Ngày chính lấy từ `weddingDay` ở đầu `weddingData.ts`; `weddingDateDisplay`,
metadata chia sẻ và lịch trong thiệp được sinh từ cùng dữ liệu. Ngày từng tiệc
vẫn có thể khác nhau, vì vậy khi đổi lịch cần kiểm tra cả `events[].date`.
Story của hai giao diện cũng dùng chung `weddingData.story`.
`VITE_SITE_URL` là URL công khai đầy đủ (bao gồm `/Wedding/` nếu có), dùng để
sinh canonical, Open Graph, Twitter và URL ảnh tuyệt đối ngay lúc build.
Không cần sửa ngày hay tên cặp đôi trong `index.html`.

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

Sau khi đọc tên, ứng dụng ghi nhớ khách trong phiên và xóa `guest` / `t` khỏi
thanh địa chỉ trước khi khởi tạo Analytics. Muốn chia sẻ lại thiệp cá nhân hóa,
dùng link mời ban đầu hoặc link từ CSV. Analytics chỉ nhận đường dẫn trang,
không nhận query string; bản đồ không được gửi kèm URL thiệp qua referrer.

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
│   │   ├── InviteTimeline.tsx   # Lịch trình xổ xuống trong từng thẻ địa điểm
│   │   ├── InvitePhotobooth.tsx # Máy ảnh cổ + dải polaroid
│   │   ├── InviteRsvp.tsx       # Khối R.S.V.P
│   │   ├── InviteRsvpSheet.tsx  # Bảng xác nhận tham dự
│   │   ├── InviteGuestbook.tsx  # Sổ lưu bút: danh sách lời chúc + nút gửi
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

Ảnh chụp gốc đã được chuyển từ `public/images/Temp` sang `assets/originals`.
Giữ ảnh nguồn ở đó; chỉ đưa ảnh đã tối ưu, được sử dụng trên thiệp vào `public`.
Album/LightGallery được tải khi gần vùng nhìn thấy hoặc khi khách bấm xem album;
giao diện classic và công cụ quản lý được chia thành các bundle riêng.

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
  weddingDate: new Date('2027-03-03T11:00:00+07:00'),
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

## Xác nhận tham dự và lưu nháp

- **Guestbook**: Firestore realtime khi có cấu hình; localStorage dùng cho development fallback.
- **RSVP**: cả hai form ghi vào `rsvps` với `schemaVersion: 2`. Chỉ thông báo
  gửi thành công sau phản hồi của Firestore. Nếu mất mạng, cấu hình thiếu hoặc
  bị từ chối, form giữ thông tin và hiện nút gửi lại. Chờ quá 8 giây cũng trả
  quyền điều khiển cho khách; phản hồi đến muộn vẫn được nhận.
- Bản nháp được lưu theo tên khách của link mời, dùng chung giữa `/` và `/rsvp`.
  Khi mở lại form hoặc có mạng trở lại, chỉ bản đã bấm gửi mới được thử gửi lại.
  Bản đang nhập chưa gửi không được tự động gửi.
- Mỗi xác nhận có ID ngẫu nhiên cố định và mã chỉnh sửa ngẫu nhiên 256 bit.
  Gửi lại/chỉnh sửa cập nhật cùng document, không thêm bản trùng. Mã chỉnh sửa
  chỉ lưu trên thiết bị và trong document riêng tư, không đưa vào URL, Analytics
  hay tệp xuất. Rules chặn đọc danh sách và chỉ cho cập nhật khi mã khớp.
- Khách có thể mở lại form trên cùng trình duyệt để sửa xác nhận. Xóa dữ liệu
  trình duyệt hoặc đổi thiết bị sẽ không khôi phục được quyền chỉnh sửa này.
- Số người đi cùng áp dụng cho mỗi tiệc đã chọn. Khi chọn không tham dự,
  danh sách tiệc và số người đi cùng được xóa. Form đóng sau ngày cưới theo giờ VN.
- Nếu trình duyệt chặn lưu trữ, giữ nội dung trong form và báo lỗi trước khi gửi,
  vì không thể bảo đảm gửi lại cùng ID qua lần tải trang tiếp theo.
- Dữ liệu cũ trong `attendances`, `rsvps` và localStorage không bị xóa hay tự gửi
  lại. Rules vẫn hỗ trợ tạo bản theo schema cũ cho các tab còn mở trước cập nhật.

## Tổng hợp danh sách khách

Yêu cầu Node.js 22.18+ và tài khoản quản trị có quyền đọc Firestore bằng
Application Default Credentials, hoặc biến `GOOGLE_APPLICATION_CREDENTIALS`
trỏ tới tệp service account lưu riêng trên máy. Không đặt credential quản trị
trong `VITE_*`, `public` hay Git.

```bash
npm run rsvps:export -- --project ghostx-9a380
```

Lệnh chỉ đọc `rsvps` và `attendances`, xuất JSON + CSV vào `.private/` (đã ignore).
Không in thông tin khách ra terminal, không xuất mã chỉnh sửa và không ghi đè tệp
đã có. Mở route `/manage`, chọn JSON vừa xuất để lọc, xem số khách theo tiệc và
tải CSV. Trang này không kết nối cơ sở dữ liệu, không tải tệp lên server và không
lưu danh sách vào trình duyệt. Truy cập URL `/manage` không làm lộ danh sách khách.

Form cũ không chọn tiệc sẽ được đánh dấu “Chưa chọn tiệc”. Không tự gộp người
trùng tên vì có thể là hai khách khác nhau; cần đối chiếu trước khi chốt số lượng.

Có thể thử công cụ bằng dữ liệu mẫu:

```bash
npm run rsvps:export -- --from tests/fixtures/rsvps.json
```

## Firebase và kiểm thử

Sao chép `.env.example` thành `.env`, điền cấu hình Firebase rồi deploy `firestore.rules`.
Với bản GitHub Pages, tạo các Actions Variables cùng tên `VITE_FIREBASE_*`
(tối thiểu `VITE_FIREBASE_API_KEY` và `VITE_FIREBASE_PROJECT_ID`). Khuyến nghị
cấu hình provider reCAPTCHA v3 trong Firebase App Check, thêm site key tương ứng
vào `VITE_FIREBASE_APPCHECK_SITE_KEY` tại môi trường local và GitHub Actions.
Site secret chỉ nhập vào Firebase Console; không đưa secret vào biến `VITE_*`.
Đăng ký đúng domain triển khai, kiểm tra request hợp lệ trong App Check metrics,
rồi bật enforcement cho Cloud Firestore. Bật enforcement khi ứng dụng chưa có
provider/token sẽ làm mọi lời chúc và RSVP trực tuyến bị từ chối.

Triển khai `firestore.rules` mới **trước** khi phát hành client dùng schema v2:

```bash
npm run firebase:rules
```

Firestore rules tests cần Java 21+. Các bài kiểm tra dùng project
`demo-wedding-tests` trong emulator, không ghi dữ liệu lên Firebase thật.
Browser tests tự build một bản riêng dưới `/Wedding/`, xóa cấu hình Firebase
production khỏi môi trường chạy và kiểm tra cả Chromium lẫn WebKit mobile.

```bash
npm run test
npm run lint
npm run build
npm run test:rules
npx playwright install chromium webkit
npm run test:e2e
```

Workflow `verify.yml` chạy lint, unit tests, rules tests và browser tests cho PR;
workflow deploy gọi lại cùng bộ kiểm tra trước khi build production và xuất bản.
Các ảnh/số liệu kiểm thử không thay thế kiểm tra trên điện thoại thật hay xác
minh App Check enforcement trong project production.

---

Made with ❤️ for the wedding of Nguyễn Danh Thịnh & Phạm Thị Thuý Hằng
