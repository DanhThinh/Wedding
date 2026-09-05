import { describe, expect, it } from 'vitest';
import {
  GUEST_MAX_LENGTH,
  buildGuestUrl,
  parseGuest,
  sanitizeGuestValue,
} from './guest';
import { buildLink, parseGuestCsv, parseCsvLine } from '../../scripts/guests.mjs';

const BASE = 'https://danhthinh.github.io/Wedding/';

describe('parseGuest', () => {
  it('đọc được xưng hô và họ tên có dấu tiếng Việt', () => {
    expect(parseGuest('?t=Anh&guest=Nguy%E1%BB%85n%20V%C4%83n%20Quang')).toEqual({
      title: 'Anh',
      name: 'Nguyễn Văn Quang',
      label: 'Anh Nguyễn Văn Quang',
    });
  });

  it('bỏ xưng hô thì label chỉ còn họ tên', () => {
    expect(parseGuest('?guest=Ho%C3%A0ng%20Anh%20Tu%E1%BA%A5n')?.label)
      .toBe('Hoàng Anh Tuấn');
  });

  it('trả null khi link không có tham số guest', () => {
    expect(parseGuest('')).toBeNull();
    expect(parseGuest('?t=Anh')).toBeNull();
    expect(parseGuest('?guest=%20%20')).toBeNull();
  });
});

describe('sanitizeGuestValue', () => {
  it('cắt tên quá dài theo code point, không xé ký tự có dấu', () => {
    const long = 'ễ'.repeat(200);
    const result = sanitizeGuestValue(long);
    expect([...result]).toHaveLength(GUEST_MAX_LENGTH);
    expect(result).toBe('ễ'.repeat(GUEST_MAX_LENGTH));
  });

  it('bỏ ký tự xuống dòng và zero-width, gom khoảng trắng', () => {
    expect(sanitizeGuestValue('  Nguyễn\n\tVăn​  Quang  ')).toBe('Nguyễn Văn Quang');
  });
});

describe('buildGuestUrl', () => {
  it('đi vòng tròn: build rồi parse ra đúng dữ liệu ban đầu', () => {
    const url = new URL(buildGuestUrl(BASE, 'Trần Thị Bích Hạnh', 'Chị'));
    expect(parseGuest(url.search)).toEqual({
      title: 'Chị',
      name: 'Trần Thị Bích Hạnh',
      label: 'Chị Trần Thị Bích Hạnh',
    });
  });

  it('không thêm tham số xưng hô khi bỏ trống', () => {
    const url = new URL(buildGuestUrl(BASE, 'Hoàng Anh Tuấn'));
    expect(url.searchParams.has('t')).toBe(false);
    expect(url.searchParams.get('guest')).toBe('Hoàng Anh Tuấn');
  });

  it('báo lỗi khi thiếu họ tên', () => {
    expect(() => buildGuestUrl(BASE, '   ')).toThrow();
  });
});

/* Script sinh link là file .mjs riêng nên không dùng chung code với app được.
   Test này khoá hai bên lại: link script sinh ra phải parse được bằng app. */
describe('scripts/guests.mjs khớp với src/lib/guest.ts', () => {
  it('link do script sinh ra được app đọc đúng', () => {
    const fromScript = buildLink(BASE, 'Lê Minh Đức', 'Gia đình');
    expect(fromScript).toBe(buildGuestUrl(BASE, 'Lê Minh Đức', 'Gia đình'));
    expect(parseGuest(new URL(fromScript).search)).toEqual({
      title: 'Gia đình',
      name: 'Lê Minh Đức',
      label: 'Gia đình Lê Minh Đức',
    });
  });

  it('đọc CSV: bỏ dòng tiêu đề, chấp nhận cột xưng hô trống', () => {
    const csv = [
      'xung_ho,ho_ten',
      'Anh,Nguyễn Văn Quang',
      ',Hoàng Anh Tuấn',
      '',
      'Chị,Trần Thị Bích Hạnh',
    ].join('\n');

    expect(parseGuestCsv(csv)).toEqual([
      { title: 'Anh', name: 'Nguyễn Văn Quang' },
      { title: '', name: 'Hoàng Anh Tuấn' },
      { title: 'Chị', name: 'Trần Thị Bích Hạnh' },
    ]);
  });

  it('đọc CSV chỉ có một cột họ tên', () => {
    expect(parseGuestCsv('Nguyễn Văn Quang')).toEqual([
      { title: '', name: 'Nguyễn Văn Quang' },
    ]);
  });

  it('hiểu ô bọc nháy kép có chứa dấu phẩy', () => {
    expect(parseCsvLine('Anh,"Nguyễn Văn Quang, Jr."')).toEqual([
      'Anh',
      'Nguyễn Văn Quang, Jr.',
    ]);
  });
});
