/**
 * Nội dung cho giao diện thiệp "Ngày chung đôi" (bản dựng lại theo video demo).
 * Cấu trúc bám sát thứ tự các màn trong demo:
 *   Bìa thiệp → Save The Date → Our Love Story → Và hôm nay → Cô dâu / Chú rể
 *   → Wedding Ceremony → Địa chỉ tổ chức → TimeLine → Photobooth
 *   → R.S.V.P → Hộp Quà Mừng → Album Ảnh Cưới → Lời cảm ơn
 *
 * Thông tin cô dâu / chú rể / ngày cưới / ảnh dùng chung với `weddingData`
 * để chỉ phải sửa một chỗ.
 */
import { weddingData } from './weddingData';
import { getDateParts } from '../lib/date';

const WEEKDAY_VI = ['CHỦ NHẬT', 'THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7'];

const pad2 = (value: number) => value.toString().padStart(2, '0');

const date = weddingData.weddingDate;
const { year, month, day, weekday, hour, minute } = getDateParts(date);
const displayDate = `${pad2(day)}.${pad2(month)}.${year}`;

const venue = {
  eyebrow: 'địa chỉ tổ chức',
  kicker: 'TẠI TRUNG TÂM TIỆC CƯỚI',
  // ⚠️ Đổi thành tên + địa chỉ thật; địa chỉ được dùng luôn cho bản đồ Google.
  name: 'Trung Tâm Tiệc Cưới',
  address: 'Địa chỉ sẽ cập nhật',
};

export const inviteData = {
  /* ── Bìa thiệp (màn đầu tiên, chạm để mở) ───────────────────── */
  cover: {
    hint: 'Chạm để mở thiệp',
  },

  /* ── Save The Date ──────────────────────────────────────────── */
  hero: {
    script: 'Save The Date',
    image: weddingData.heroSlides[0],
    /** Demo in tên cô dâu trước, rồi tới chú rể. */
    names: `${weddingData.bride.shortName} & ${weddingData.groom.shortName}`,
    dateDisplay: displayDate,
    /** Chữ ký mờ phía dưới ảnh, giống dòng "Charoline" trong demo. */
    studio: weddingData.monogram,
  },

  /* ── Our Love Story ─────────────────────────────────────────── */
  story: {
    title: 'Our Love Story',
    /**
     * Mỗi mốc là một dấu tim trên trục dọc, ảnh và chữ nằm so le hai bên.
     * `side: 'left'` nghĩa là chữ bên trái, ảnh bên phải (giống mốc đầu của demo).
     */
    milestones: [
      {
        id: 1,
        year: '2017',
        title: 'How We Met',
        text: weddingData.story[0].content,
        image: weddingData.story[0].image,
        side: 'left' as const,
      },
      {
        id: 2,
        year: '2018',
        title: 'First Adventure',
        text: weddingData.story[1].content,
        image: weddingData.story[1].image,
        side: 'right' as const,
      },
      {
        id: 3,
        year: '2024',
        title: 'Moving Forward',
        text: 'Chúng mình hiểu rằng đây là định mệnh đã đưa nhau về đây. Cùng nhau vun đắp cuộc sống, chắp cánh cho những ước mơ và ngày một gắn bó, mạnh mẽ hơn qua từng ngày.',
        image: weddingData.story[2].image,
        side: 'left' as const,
      },
      {
        id: 4,
        year: '2026',
        title: 'The Proposal',
        text: 'Trái tim đầy ắp yêu thương và những giấc mơ về ngày mai, anh đã ngỏ lời... và em gật đầu trong niềm xúc động vỡ oà.',
        image: weddingData.heroSlides[1],
        side: 'right' as const,
      },
    ],
  },

  /* ── Và hôm nay ─────────────────────────────────────────────── */
  today: {
    title: 'Và hôm nay',
    subtitle: 'Chúng mình chính thức về chung 1 nhà',
    bride: {
      role: 'Cô dâu',
      name: weddingData.bride.shortName,
      image: weddingData.bride.image,
    },
    groom: {
      role: 'Chú rể',
      name: weddingData.groom.shortName,
      image: weddingData.groom.image,
    },
  },

  /* ── Wedding Ceremony ───────────────────────────────────────── */
  ceremony: {
    title: 'Wedding Ceremony',
    /** "11 GIỜ - 11/01/2027 - THỨ 2" */
    line: `${hour}${minute ? `:${pad2(minute)}` : ''} GIỜ - ${pad2(day)}/${pad2(month)}/${year} - ${WEEKDAY_VI[weekday]}`,
    welcome: 'WELCOME TO OUR WEDDING',
    image: weddingData.heroSlides[2],
  },

  /* ── Địa chỉ tổ chức ────────────────────────────────────────── */
  venue,

  /* ── TimeLine (4 mốc giờ trong ngày cưới) ───────────────────── */
  timeline: {
    title: 'TimeLine',
    items: [
      { id: 1, time: '04:30', label: 'Lễ rước dâu', place: 'Tại nhà gái', icon: 'car' as const },
      { id: 2, time: '09:30', label: 'Thánh lễ hôn phối', place: 'Tại nhà thờ', icon: 'church' as const },
      { id: 3, time: '11:00', label: 'Đón khách', place: 'Tại khách sạn', icon: 'arch' as const },
      { id: 4, time: '11:30', label: 'Khai tiệc', place: 'Tại khách sạn', icon: 'cheers' as const },
    ],
  },

  /* ── Photobooth (dải ảnh polaroid + máy ảnh cổ) ─────────────── */
  photobooth: {
    caption: 'Cùng chúng mình lưu giữ lại những khoảnh khắc hạnh phúc',
    handwriting: 'Cùng Nhau',
    strip: [
      weddingData.album[0],
      weddingData.album[1],
      weddingData.album[2],
      weddingData.album[3],
    ],
  },

  /* ── R.S.V.P ────────────────────────────────────────────────── */
  rsvp: {
    eyebrow: 'R.S.V.P.',
    title: 'Xác Nhận Tham Dự',
    description:
      'Vui lòng xác nhận tham dự để chúng mình chuẩn bị lễ cưới được thuận lợi và trọn vẹn nhất.',
    cta: 'Gửi thông tin',
  },

  /* ── Hộp Quà Mừng ───────────────────────────────────────────── */
  gift: {
    title: 'Hộp Quà Mừng',
    description:
      'Sự hiện diện của bạn là món quà quý giá nhất. Nếu ở xa, bạn có thể gửi lời chúc mừng qua đây nhé!',
  },

  /* ── Album Ảnh Cưới + Lời cảm ơn ────────────────────────────── */
  album: {
    title: 'Album Ảnh Cưới',
    photos: weddingData.album,
    thanks: {
      title: 'Lời cảm ơn !',
      body: weddingData.intro.content,
    },
  },

  /* ── Watermark dọc bên phải + thanh dock dưới cùng ──────────── */
  chrome: {
    watermark: `${weddingData.monogram} · ${displayDate}`,
    wishPlaceholder: 'Gửi lời chúc...',
  },

  weddingDate: date,
  /** Chuỗi tra cứu cho iframe Google Maps ở phần "địa chỉ tổ chức". */
  mapQuery: `${venue.name} ${venue.address}`.trim(),
};

export type InviteData = typeof inviteData;
