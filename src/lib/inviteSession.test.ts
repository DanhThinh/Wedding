import { afterEach, describe, expect, it, vi } from 'vitest';
import { getEnvelopeOpened, markEnvelopeOpened, prepareGuestSession } from './inviteSession';

const originalUrl = window.location.href;
const originalState = window.history.state;

afterEach(() => {
  window.history.replaceState(originalState, '', originalUrl);
  sessionStorage.clear();
});

describe('private invitation bootstrap', () => {
  it('captures the guest and cleans the URL while preserving router state and navigation', () => {
    window.history.replaceState({ key: 'invite', idx: 2 }, '', '/Wedding/?guest=An&t=Anh&source=mail#album');
    expect(prepareGuestSession()).toEqual({ name: 'An', title: 'Anh', label: 'Anh An' });
    expect(window.location.pathname + window.location.search + window.location.hash)
      .toBe('/Wedding/?source=mail#album');
    expect(window.history.state).toEqual({ key: 'invite', idx: 2 });
    // A refresh or route change without the personal query still resolves the same guest.
    expect(prepareGuestSession()?.label).toBe('Anh An');
  });

  it('reopens the cover for a different guest in the same session', () => {
    window.history.replaceState(null, '', '/Wedding/?guest=An');
    prepareGuestSession();
    markEnvelopeOpened();
    window.history.replaceState(null, '', '/Wedding/?guest=Binh');
    expect(prepareGuestSession()?.name).toBe('Binh');
    expect(getEnvelopeOpened()).toBe(false);
  });

  it('keeps initial personalization and removes private parameters when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked'); });
    window.history.replaceState(null, '', '/?guest=An&t=Anh');
    expect(prepareGuestSession()?.label).toBe('Anh An');
    expect(window.location.search).toBe('');
  });
});
