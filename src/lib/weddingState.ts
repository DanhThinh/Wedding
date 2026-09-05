export type WeddingPhase = 'before' | 'wedding-day' | 'after';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const VIETNAM_UTC_OFFSET_IN_MS = 7 * 60 * 60 * 1000;

function getVietnamCalendarDay(date: Date) {
  // Việt Nam dùng UTC+7 quanh năm. Dịch timestamp trước khi chia theo ngày giúp
  // kết quả không phụ thuộc múi giờ hệ điều hành của khách hoặc máy chạy CI.
  return Math.floor((new Date(date).getTime() + VIETNAM_UTC_OFFSET_IN_MS) / DAY_IN_MS);
}

export function getWeddingPhase(weddingDate: Date, now = new Date()): WeddingPhase {
  const weddingDay = getVietnamCalendarDay(weddingDate);
  const currentDay = getVietnamCalendarDay(now);

  if (currentDay < weddingDay) return 'before';
  if (currentDay === weddingDay) return 'wedding-day';
  return 'after';
}

/**
 * Chỉ hiện mục mừng cưới khi khách thực sự chuyển khoản được.
 *
 * Ảnh QR là TUỲ CHỌN: GiftBoxSection đã có sẵn nhánh hiển thị khi thiếu ảnh
 * ("Có thể dùng số tài khoản bên dưới"), nên chỉ cần tên ngân hàng + số tài
 * khoản là đủ dùng. Trước đây hàm này bắt buộc cả qrCode, khiến toàn bộ section
 * bị ẩn dù đã điền đầy đủ thông tin ngân hàng.
 */
export function hasGiftDetails(data: {
  groom: { bank: { bankName: string; number: string; qrCode: string } };
  bride: { bank: { bankName: string; number: string; qrCode: string } };
}) {
  return [data.groom, data.bride].some(person => Boolean(
    person.bank.bankName.trim()
    && person.bank.number.trim(),
  ));
}
