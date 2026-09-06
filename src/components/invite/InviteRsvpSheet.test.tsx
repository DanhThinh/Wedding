import { StrictMode, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import InviteRsvpSheet from './InviteRsvpSheet';

const { showToast } = vi.hoisted(() => ({ showToast: vi.fn() }));
vi.mock('../../hooks/weddingContext', () => ({
  useWedding: () => ({ showToast, guest: null }),
}));
vi.mock('../../lib/analytics', () => ({ trackEvent: vi.fn() }));

function SheetHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Mở RSVP</button>
      <div inert>Already inactive</div>
      <InviteRsvpSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

describe('InviteRsvpSheet', () => {
  it('retains the draft on storage failure and lets the guest retry', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    showToast.mockClear();
    render(<InviteRsvpSheet open onClose={onClose} />);
    await user.click(screen.getByRole('radio', { name: 'Tham dự được' }));
    await user.type(screen.getByLabelText('Họ tên'), 'Nguyễn Văn An');
    await user.type(screen.getByLabelText('Lời nhắn'), 'Hẹn gặp nhé!');

    const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage full', 'QuotaExceededError');
    });
    await user.click(screen.getByRole('button', { name: 'Gửi thông tin' }));
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();
    expect(showToast).not.toHaveBeenCalled();
    expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe('Nguyễn Văn An');
    expect((screen.getByLabelText('Lời nhắn') as HTMLTextAreaElement).value).toBe('Hẹn gặp nhé!');
    expect(screen.getByRole('radio', { name: 'Tham dự được' }).getAttribute('aria-checked')).toBe('true');

    storage.mockRestore();
    await user.click(screen.getByRole('button', { name: 'Gửi thông tin' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(JSON.parse(localStorage.getItem('wedding-attendances')!)).toHaveLength(1);
  });

  it('wraps keyboard focus, disables the background and restores it on Escape', async () => {
    const user = userEvent.setup();
    render(<StrictMode><SheetHarness /></StrictMode>);
    const trigger = screen.getByRole('button', { name: 'Mở RSVP' });
    await user.click(trigger);
    expect(trigger.hasAttribute('inert')).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(screen.getByRole('dialog'));

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Gửi thông tin' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Đóng' }));
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Gửi thông tin' }));

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(trigger.hasAttribute('inert')).toBe(false);
    expect(screen.getByText('Already inactive').hasAttribute('inert')).toBe(true);
    expect(document.body.style.overflow).toBe('');
  });

  it('does not steal input focus when the parent updates its close callback', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<InviteRsvpSheet open onClose={() => {}} />);
    const input = screen.getByLabelText('Họ tên');
    await user.type(input, 'An');
    const onClose = vi.fn();
    rerender(<InviteRsvpSheet open onClose={onClose} />);
    expect(document.activeElement).toBe(input);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
