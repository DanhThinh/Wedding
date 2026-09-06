import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { weddingData } from '../../data/weddingData';
import InviteVenue from './InviteVenue';

const originalEvents = weddingData.events.map(event => ({ ...event }));
afterEach(() => {
  weddingData.events.forEach((event, index) => Object.assign(event, originalEvents[index]));
});

function fillAddresses() {
  weddingData.events.forEach((event, index) => {
    event.address = `${100 + index} Nguyễn Huệ, TP.HCM`;
    event.mapQuery = '';
  });
}

describe('InviteVenue', () => {
  it('shows the three shared events in order with their Vietnam dates and times', () => {
    render(<InviteVenue />);
    const cards = screen.getAllByRole('article');
    expect(cards.map(card => within(card).getByRole('heading', { level: 3 }).textContent))
      .toEqual(['Tiệc nhà trai', 'Tiệc nhà gái', 'Tiệc cưới']);
    expect(weddingData.events.map(event => event.id)).toEqual([1, 2, 3]);
    expect(within(cards[0]).getByText('11:00 · 03/03/2027')).toBeTruthy();
    expect(within(cards[1]).getByText('17:00 · 02/03/2027')).toBeTruthy();
    expect(within(cards[2]).getByText('18:00 · 03/03/2027')).toBeTruthy();
    expect(cards[0].querySelector('time')?.dateTime).toBe('2027-03-03T11:00:00+07:00');
  });

  it.each(['', '   ', 'Địa chỉ sẽ cập nhật', 'Chưa có địa chỉ'])(
    'hides map actions only for the event with an unfinished address: %s', address => {
      fillAddresses();
      weddingData.events[0].address = address;
      render(<InviteVenue />);
      const groomCard = screen.getByRole('article', { name: 'Tiệc nhà trai' });
      expect(within(groomCard).queryByRole('button', { name: /bản đồ/ })).toBeNull();
      expect(within(groomCard).queryByRole('link')).toBeNull();
      expect(within(groomCard).getByText('Địa chỉ sẽ cập nhật')).toBeTruthy();
      expect(screen.queryByRole('button', { name: /bản đồ/ })).toBeNull();
      expect(screen.getAllByRole('link', { name: /Chỉ đường/ })).toHaveLength(2);
    },
  );

  it('links each card to directions for its own address from the shared data', () => {
    fillAddresses();
    const { container } = render(<InviteVenue />);
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.queryByRole('button', { name: /bản đồ/ })).toBeNull();
    for (const event of weddingData.events) {
      const card = screen.getByRole('article', { name: event.name });
      expect(within(card).getByText(event.location)).toBeTruthy();
      expect(within(card).getByText(event.address)).toBeTruthy();
      const link = within(card).getByRole('link', { name: `Chỉ đường đến ${event.name}` }) as HTMLAnchorElement;
      const url = new URL(link.href);
      expect(url.pathname).toBe('/maps/dir/');
      expect(url.searchParams.get('destination')).toBe(event.address);
      expect(link.rel).toBe('noreferrer');
    }
  });

  it('uses the supplied map pin for both groom and wedding events', () => {
    render(<InviteVenue />);
    const coordinates = '19.7655721,105.8081431';
    for (const name of ['Tiệc nhà trai', 'Tiệc cưới']) {
      const card = screen.getByRole('article', { name });
      expect(within(card).getByText('Trường THPT Nguyễn Huệ')).toBeTruthy();
      const link = within(card).getByRole('link', { name: `Chỉ đường đến ${name}` }) as HTMLAnchorElement;
      expect(new URL(link.href).searchParams.get('destination')).toBe(coordinates);

    }
    expect(within(screen.getByRole('article', { name: 'Tiệc nhà gái' })).queryByRole('link')).toBeNull();
  });

  it('expands each event timeline independently and supports keyboard controls', async () => {
    const user = userEvent.setup();
    render(<InviteVenue />);
    expect(screen.getAllByRole('button', { name: /Xem lịch trình/ })).toHaveLength(3);
    expect(screen.queryByRole('list')).toBeNull();

    const groomToggle = screen.getByRole('button', { name: 'Xem lịch trình Tiệc nhà trai' });
    await user.click(groomToggle);
    const groomList = screen.getByRole('list', { name: 'Lịch trình Tiệc nhà trai' });
    expect(within(groomList).getAllByRole('listitem')).toHaveLength(2);
    expect(within(groomList).getByText('Đón khách')).toBeTruthy();
    expect(within(groomList).getByText('Khai tiệc')).toBeTruthy();
    expect(groomList.querySelector('time')?.dateTime).toBe('2027-03-03T11:00:00+07:00');
    expect(groomToggle.getAttribute('aria-expanded')).toBe('true');
    expect(groomList.parentElement?.id).toBe(groomToggle.getAttribute('aria-controls'));

    // A missing address must not prevent reading this event's schedule.
    await user.click(screen.getByRole('button', { name: 'Xem lịch trình Tiệc nhà gái' }));
    const brideList = screen.getByRole('list', { name: 'Lịch trình Tiệc nhà gái' });
    expect(within(brideList).getByText('Bắt đầu tiệc nhà gái')).toBeTruthy();
    expect(brideList.querySelector('time')?.dateTime).toBe('2027-03-02T17:00:00+07:00');
    expect(within(brideList).queryByText('Đón khách')).toBeNull();
    expect(screen.getAllByRole('list')).toHaveLength(2);

    await user.click(groomToggle);
    expect(groomToggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('list', { name: 'Lịch trình Tiệc nhà trai' })).toBeNull();
    expect(screen.getByRole('list', { name: 'Lịch trình Tiệc nhà gái' })).toBe(brideList);

    const weddingToggle = screen.getByRole('button', { name: 'Xem lịch trình Tiệc cưới' });
    weddingToggle.focus();
    await user.keyboard('{Enter}');
    const weddingList = screen.getByRole('list', { name: 'Lịch trình Tiệc cưới' });
    expect(within(weddingList).getByText('Bắt đầu tiệc cưới')).toBeTruthy();
    expect(weddingList.querySelector('time')?.dateTime).toBe('2027-03-03T18:00:00+07:00');
    await user.keyboard(' ');
    expect(screen.queryByRole('list', { name: 'Lịch trình Tiệc cưới' })).toBeNull();
  });

  it('shows a pending message when an event has no schedule yet', async () => {
    weddingData.events[1].timeline = [];
    const user = userEvent.setup();
    render(<InviteVenue />);
    await user.click(screen.getByRole('button', { name: 'Xem lịch trình Tiệc nhà gái' }));
    expect(within(screen.getByRole('article', { name: 'Tiệc nhà gái' }))
      .getByText('Lịch trình sẽ cập nhật')).toBeTruthy();
  });

});
