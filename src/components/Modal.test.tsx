import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

function ModalHarness({ onClose = vi.fn() }: { onClose?: () => void }) {
  const [name, setName] = useState('');

  return (
    <Modal isOpen onClose={() => onClose()} title="Kiểm tra modal">
      <label htmlFor="modal-test-name">Tên</label>
      <input
        id="modal-test-name"
        value={name}
        onChange={event => setName(event.target.value)}
      />
      <button type="button">Hoàn tất</button>
    </Modal>
  );
}

describe('Modal', () => {
  it('keeps the active input focused while its parent rerenders', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);
    const input = screen.getByLabelText('Tên') as HTMLInputElement;

    await user.click(input);
    await user.type(input, 'Thuý Hằng');

    expect(input.value).toBe('Thuý Hằng');
    expect(document.activeElement).toBe(input);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ModalHarness onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
