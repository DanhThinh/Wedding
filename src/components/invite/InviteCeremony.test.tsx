import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { inviteData } from '../../data/inviteData';
import InviteCeremony from './InviteCeremony';

describe('invitation dates', () => {
  it('shows the same Vietnam date in the hero, ceremony, watermark and month grid', () => {
    const { container } = render(<InviteCeremony />);
    expect(inviteData.hero.dateDisplay).toBe('03.03.2027');
    expect(inviteData.chrome.watermark).toContain('03.03.2027');
    expect(screen.getByText('11 GIỜ · 03/03/2027 · THỨ 4')).toBeTruthy();
    expect(screen.getByText('(Tức ngày 26 tháng 01 âm lịch)')).toBeTruthy();
    const cells = Array.from(container.querySelectorAll('.invite-calendar__grid > span'));
    expect(cells).toHaveLength(31); // March 2027 starts on Monday, no leading blank cells.
    expect(cells.findIndex(cell => cell.classList.contains('is-wedding'))).toBe(2);
    expect(container.querySelector('.is-wedding')?.textContent).toBe('3');
  });
});
