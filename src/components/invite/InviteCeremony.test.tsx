import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { inviteData } from '../../data/inviteData';
import InviteCeremony from './InviteCeremony';

describe('invitation dates', () => {
  it('shows the same Vietnam date in the hero, ceremony, watermark and month grid', () => {
    const { container } = render(<InviteCeremony />);
    expect(inviteData.hero.dateDisplay).toBe('11.01.2027');
    expect(inviteData.chrome.watermark).toContain('11.01.2027');
    expect(screen.getByText('11 GIỜ - 11/01/2027 - THỨ 2')).toBeTruthy();
    expect(screen.getByText('(Tức ngày 04 tháng 12 âm lịch)')).toBeTruthy();
    const cells = Array.from(container.querySelectorAll('.invite-calendar__grid > span'));
    expect(cells).toHaveLength(35); // January starts on Friday, after four blank cells.
    expect(cells.slice(0, 4).every(cell => cell.textContent === '')).toBe(true);
    expect(cells.findIndex(cell => cell.classList.contains('is-wedding'))).toBe(14);
    expect(container.querySelector('.is-wedding')?.textContent).toBe('11');
  });
});
