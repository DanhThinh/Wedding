import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import InviteVenue from './InviteVenue';

const { fixture } = vi.hoisted(() => ({ fixture: {
  venue: { eyebrow: 'địa chỉ tổ chức', kicker: 'TẠI', name: 'Test Venue', address: '' },
  mapQuery: 'Test Venue 123 Nguyễn Huệ, TP.HCM',
} }));
vi.mock('../../data/inviteData', () => ({ inviteData: fixture }));

describe('InviteVenue', () => {
  it.each(['', '   ', 'Địa chỉ sẽ cập nhật', 'Chưa có địa chỉ'])(
    'does not render a map or directions for an unfinished address: %s', address => {
      fixture.venue.address = address;
      const { container } = render(<InviteVenue />);
      expect(container.querySelector('iframe')).toBeNull();
      expect(screen.queryByRole('link')).toBeNull();
      expect(screen.getByText('Địa chỉ sẽ cập nhật')).toBeTruthy();
    },
  );

  it('renders real directions and prevents the iframe from forwarding the invitation URL', () => {
    fixture.venue.address = '123 Nguyễn Huệ, TP.HCM';
    const { container } = render(<InviteVenue />);
    const iframe = container.querySelector('iframe')!;
    expect(new URL(iframe.src).searchParams.get('q')).toBe(fixture.mapQuery);
    expect(iframe.getAttribute('referrerpolicy')).toBe('no-referrer');
    const link = screen.getByRole('link', { name: fixture.venue.address }) as HTMLAnchorElement;
    expect(new URL(link.href).searchParams.get('query')).toBe(fixture.mapQuery);
    expect(link.rel).toBe('noreferrer');
  });
});
