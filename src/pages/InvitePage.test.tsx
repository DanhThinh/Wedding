import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WeddingProvider } from '../hooks/useWedding';
import { GuestbookModal } from '../components/Modal';
import InvitePage from './InvitePage';

// The gallery's third-party lightbox is unrelated to the guestbook flow.
vi.mock('../components/invite/InviteAlbum', () => ({ default: () => <section id="album" /> }));

beforeEach(() => {
  sessionStorage.setItem('envelope-opened', 'true');
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});

afterEach(() => {
  sessionStorage.clear();
  document.body.style.overflow = '';
});

function renderInvitation() {
  return render(
    <WeddingProvider guest={{ name: 'Khách mời An', title: 'Anh', label: 'Anh Khách mời An' }}>
      <InvitePage />
      <GuestbookModal />
    </WeddingProvider>,
  );
}

describe('guestbook on the main invitation', () => {
  it('renders stored wishes on the main page, with Vietnam dates', async () => {
    localStorage.setItem('wedding-wishes', JSON.stringify([
      { name: 'Bình', message: 'Chúc hai bạn hạnh phúc!', date: '2027-01-10T18:00:00Z' },
    ]));
    renderInvitation();
    const book = screen.getByRole('region', { name: 'Sổ lưu bút' });
    expect(await within(book).findByText('Chúc hai bạn hạnh phúc!')).toBeTruthy();
    expect(within(book).getByText('Bình')).toBeTruthy();
    expect(within(book).getByText('11/01/2027')).toBeTruthy();
    expect(within(book).getByRole('status').textContent).toBe('1 lời chúc · Lưu trên thiết bị này');
  });

  it('shows the empty state, then updates the same list when sending from the section or dock', async () => {
    const user = userEvent.setup();
    renderInvitation();
    const book = screen.getByRole('region', { name: 'Sổ lưu bút' });
    expect(await within(book).findByText('Chưa có lời chúc nào.')).toBeTruthy();
    await user.click(within(book).getByRole('button', { name: 'Gửi lời chúc' }));
    let dialog = screen.getByRole('dialog', { name: 'Gửi Lời Chúc' });
    expect((within(dialog).getByLabelText('Tên của bạn *') as HTMLInputElement).value).toBe('Khách mời An');
    await user.type(within(dialog).getByLabelText('Lời chúc *'), 'Trăm năm hạnh phúc!');
    await user.click(within(dialog).getByRole('button', { name: 'Gửi lời chúc' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(within(book).getByText('Trăm năm hạnh phúc!')).toBeTruthy();
    expect(within(book).queryByText('Chưa có lời chúc nào.')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Gửi lời chúc...' }));
    dialog = screen.getByRole('dialog', { name: 'Gửi Lời Chúc' });
    await user.type(within(dialog).getByLabelText('Lời chúc *'), 'Chúc mừng ngày vui!');
    await user.click(within(dialog).getByRole('button', { name: 'Gửi lời chúc' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    const list = within(book).getByRole('list', { name: 'Danh sách lời chúc' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(within(list).getAllByRole('listitem')[0].textContent).toContain('Chúc mừng ngày vui!');
    expect(JSON.parse(localStorage.getItem('wedding-wishes')!)).toHaveLength(2);
  });
});
