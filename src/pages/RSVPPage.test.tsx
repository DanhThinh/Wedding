import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import RSVPPage from './RSVPPage';

const { showToast, saveRsvpMock } = vi.hoisted(() => ({
  showToast: vi.fn(),
  saveRsvpMock: vi.fn().mockResolvedValue('firestore'),
}));

vi.mock('../hooks/weddingContext', () => ({
  useWedding: () => ({
    data: {
      heroSlides: ['/images/hero-1.webp'],
      groom: { shortName: 'Danh Thịnh' },
      bride: { shortName: 'Thuý Hằng' },
      weddingDate: '2099-01-11T18:00:00+07:00',
      weddingDateDisplay: '11 tháng 01 năm 2025',
      events: [{ id: 1, name: 'Lễ Thành Hôn', timeDisplay: '18:00', location: 'TP. Hồ Chí Minh' }],
    },
    showToast,
  }),
}));

vi.mock('../lib/rsvp', async (importOriginal) => {
  const original = await importOriginal<typeof import('../lib/rsvp')>();
  return { ...original, saveRsvp: saveRsvpMock };
});

describe('RSVPPage', () => {
  it('submits a valid RSVP to the configured persistence layer', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RSVPPage /></MemoryRouter>);

    await user.type(screen.getByLabelText('Tên của bạn *'), 'Nguyễn Văn An');
    await user.type(screen.getByLabelText('Số điện thoại *'), '0901234567');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Xác nhận tham dự' }));

    expect(await screen.findByRole('heading', { name: 'Cảm ơn bạn!' })).toBeTruthy();
    expect(saveRsvpMock).toHaveBeenCalledWith({
      name: 'Nguyễn Văn An',
      phone: '0901234567',
      eventIds: [1],
      plusOnes: 0,
    });
  });
});
