import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sanitizeAnalyticsParams, trackEvent } from './analytics';
import { getAnalyticsPageParams } from './analyticsPrivacy';

const { logEvent, analytics } = vi.hoisted(() => ({ logEvent: vi.fn(), analytics: {} }));
vi.mock('./firebase', () => ({ getFirebaseAnalytics: async () => analytics }));
vi.mock('firebase/analytics', () => ({ logEvent }));

const originalUrl = window.location.href;
beforeEach(() => vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-TEST'));
afterEach(() => { window.history.replaceState(null, '', originalUrl); vi.unstubAllEnvs(); });

describe('analytics helpers', () => {
  it('drops common PII params before logging events', () => {
    expect(sanitizeAnalyticsParams({
      event_id: 1,
      mode: 'firestore',
      name: 'Nguyễn Văn An',
      phone: '0901234567',
      message: 'Chúc mừng hạnh phúc',
      venueAddress: '123 Example Street',
      guest: 'An',
      plus_ones_count: 2,
      empty: undefined,
    })).toEqual({
      event_id: 1,
      mode: 'firestore',
      plus_ones_count: 2,
    });
  });

  it('removes private query strings and fragments from page and referrer URLs', () => {
    window.history.replaceState(null, '', '/Wedding/?guest=An&t=Anh#private');
    vi.spyOn(document, 'referrer', 'get').mockReturnValue('https://example.com/invite?guest=An#private');
    expect(getAnalyticsPageParams()).toEqual({
      page_location: `${window.location.origin}/Wedding/`,
      page_referrer: 'https://example.com/invite',
    });
  });

  it('sends sanitized page context even if an event supplies a personal URL', async () => {
    window.history.replaceState(null, '', '/Wedding/rsvp?guest=An');
    vi.spyOn(document, 'referrer', 'get').mockReturnValue('');
    await trackEvent('rsvp_submit', {
      mode: 'local', guest: 'An', page_location: 'https://example.com/?guest=An',
    });
    expect(logEvent).toHaveBeenCalledWith(analytics, 'rsvp_submit', {
      mode: 'local', page_location: `${window.location.origin}/Wedding/rsvp`, page_referrer: '',
    });
  });
});
