/**
 * Nội dung cho giao diện thiệp "Ngày chung đôi" (bản dựng lại theo video demo).
 * Cấu trúc bám sát thứ tự các màn trong demo:
 *   Bìa thiệp → Save The Date → Our Love Story → Và hôm nay → Cô dâu / Chú rể
 *   → Wedding Ceremony → Địa chỉ tổ chức / lịch trình từng tiệc → Photobooth
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

export const inviteData = {
  /* ── Bìa thiệp (màn đầu tiên, chạm để mở) ───────────────────── */
  cover: {
    hint: 'Chạm để mở thiệp',
  },

  /* ── Save The Date ──────────────────────────────────────────── */
  hero: {
    script: 'Save The Date',
    image: weddingData.heroSlides[0],
    /** Tên chú rể trước, cô dâu sau — khớp với thứ tự dùng ở Header/HeroSection bản classic. */
    names: `${weddingData.groom.shortName} & ${weddingData.bride.shortName}`,
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
    milestones: weddingData.story.map((moment, index) => ({
      id: moment.id,
      year: moment.date.split('/')[2],
      title: moment.title,
      text: moment.content,
      image: moment.image,
      side: index % 2 === 0 ? 'left' as const : 'right' as const,
    })),
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
    /** "11 GIỜ · 11/01/2027 · THỨ 2" — dùng dấu chấm giữa cho thanh thoát, đỡ khô khan hơn gạch nối. */
    line: `${hour}${minute ? `:${pad2(minute)}` : ''} GIỜ · ${pad2(day)}/${pad2(month)}/${year} · ${WEEKDAY_VI[weekday]}`,
    welcome: 'WELCOME TO OUR WEDDING',
    image: weddingData.heroSlides[2],
  },

  /* ── Địa chỉ tổ chức ────────────────────────────────────────── */
  venue: {
    title: 'Địa chỉ tổ chức',
    // Dùng cùng sự kiện với giao diện classic và form RSVP.
    events: weddingData.events,
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
};

export type InviteData = typeof inviteData;
