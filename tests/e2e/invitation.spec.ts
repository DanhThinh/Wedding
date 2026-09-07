import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Keep runs deterministic and prevent third-party font/analytics requests.
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.hostname === '127.0.0.1' ? route.continue() : route.abort();
  });
});

test('personal link opens, metadata matches, and heavy routes/album stay deferred', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', request => requested.push(request.url()));
  await page.goto('./?guest=Khách%20An&t=Anh');
  await expect(page.getByText('Anh Khách An', { exact: true }).first()).toBeVisible();
  await expect(page).not.toHaveURL(/guest=/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /03 tháng 03 năm 2027/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^http:\/\/127\.0\.0\.1:4173\/Wedding\/images\//);
  expect(requested.some(url => /InviteAlbum-|ClassicPage-|lg-thumbnail-/.test(url))).toBe(false);
  await page.getByRole('button', { name: 'Mở thiệp cưới' }).click();
  await page.getByRole('button', { name: 'Xác nhận tham dự', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Họ tên *')).toHaveValue('Khách An');
  await page.getByRole('button', { name: 'Đóng', exact: true }).click();
  await page.locator('#album').scrollIntoViewIfNeeded();
  await expect(page.getByRole('link', { name: 'Mở ảnh cưới 1', exact: true })).toBeVisible();
});

test('an offline confirmation retains its draft across reload and both entry points', async ({ page, context }, testInfo) => {
  await page.goto('rsvp');
  await page.getByRole('radio', { name: 'Tham dự được', exact: true }).check();
  await page.getByLabel('Họ tên *').fill('Khách kiểm thử');
  await page.getByRole('checkbox', { name: /Tiệc nhà trai/ }).check();
  await page.getByLabel('Số người đi cùng').selectOption('2');
  await page.getByLabel('Lời nhắn').fill('Hẹn gặp cả nhà');
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Xác nhận tham dự', exact: true }).click();
  await expect(page.getByText('Chưa xác nhận được chủ tiệc đã nhận thông tin.')).toBeVisible();
  await expect(page.getByLabel('Họ tên *')).toHaveValue('Khách kiểm thử');
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('wedding-rsvp-v2:general')!));
  await context.setOffline(false);
  await page.reload();
  await expect(page.getByLabel('Họ tên *')).toHaveValue('Khách kiểm thử');
  await expect(page.getByLabel('Số người đi cùng')).toHaveValue('2');
  await page.getByRole('button', { name: 'Gửi lại xác nhận' }).click();
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('wedding-rsvp-v2:general')!));
  expect(after.id).toBe(before.id);
  expect(after.editToken).toBe(before.editToken);
  await page.screenshot({ path: testInfo.outputPath('rsvp-mobile.png'), fullPage: true });
  await page.getByRole('link', { name: /Về thiệp cưới/ }).click();
  await page.getByRole('button', { name: 'Mở thiệp cưới' }).click();
  await page.getByRole('button', { name: 'Xác nhận tham dự', exact: true }).click();
  await expect(page.getByLabel('Lời nhắn')).toHaveValue('Hẹn gặp cả nhà');
  await expect(page.getByLabel('Số người đi cùng')).toHaveValue('2');
});

test('blocked storage retains inputs and clearly reports that submission was not saved', async ({ page }) => {
  await page.goto('rsvp');
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); }; });
  await page.getByRole('radio', { name: 'Không thể tham dự' }).check();
  await page.getByLabel('Họ tên *').fill('Khách không lưu được');
  await page.getByRole('button', { name: 'Xác nhận tham dự', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Không thể lưu bản nháp');
  await expect(page.getByLabel('Họ tên *')).toHaveValue('Khách không lưu được');
  await expect(page.getByText('Xác nhận của bạn đã được gửi đến chúng mình.')).toHaveCount(0);
});

test('deep links reload correctly and the mobile form has no horizontal overflow', async ({ page }) => {
  for (const route of ['rsvp', 'classic']) {
    await page.goto(route);
    await page.reload();
    await expect(page.locator('main')).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('private guest report filters locally and exports a safe CSV', async ({ page }) => {
  await page.goto('manage');
  await page.getByLabel('Mở tệp danh sách khách (.json)').setInputFiles({
    name: 'rsvps.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ rows: [
      { id: 'a', source: 'rsvps', name: 'An', phone: '0901234567', attending: true, eventIds: [1, 3], plusOnes: 2, message: 'Chúc mừng' },
      { id: 'b', source: 'attendances', name: 'Bình', attending: true, eventIds: [], plusOnes: 0 },
      { id: 'c', source: 'rsvps', name: 'Chi', attending: false, eventIds: [], plusOnes: 0 },
    ] })),
  });
  await expect(page.getByRole('status')).toContainText('1 xác nhận chưa chọn tiệc');
  await page.getByLabel('Lọc theo tiệc').selectOption('1');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody tr')).toContainText('An');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất CSV (1)' }).click();
  expect((await download).suggestedFilename()).toBe('danh-sach-khach.csv');
});

test('gift QR downloads and skip navigation remains hidden until focused', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Mở thiệp cưới' }).click();
  await expect(page.locator('.skip-link')).toHaveCSS('clip-path', 'inset(100%)');
  await page.locator('#gift').scrollIntoViewIfNeeded();
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Tải mã QR' }).click();
  expect((await download).suggestedFilename()).toContain('groom-qr');
  await expect(page.getByRole('button', { name: 'Sao chép số tài khoản' })).toBeVisible();
});
