import { afterEach, describe, expect, it, vi } from 'vitest';

const { app, initializeAnalytics } = vi.hoisted(() => ({ app: {}, initializeAnalytics: vi.fn(() => ({})) }));
vi.mock('firebase/app', () => ({ getApps: () => [], initializeApp: () => app }));
vi.mock('firebase/analytics', () => ({ isSupported: async () => true, initializeAnalytics }));
vi.mock('firebase/firestore', () => ({ getFirestore: () => ({}) }));

const originalUrl = window.location.href;
afterEach(() => {
  vi.unstubAllEnvs();
  window.history.replaceState(null, '', originalUrl);
});

describe('Firebase Analytics startup', () => {
  it('configures the first automatic pageview with sanitized URLs', async () => {
    vi.resetModules();
    vi.stubEnv('MODE', 'development');
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-key');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project');
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-TEST');
    vi.stubEnv('VITE_FIREBASE_APPCHECK_SITE_KEY', '');
    window.history.replaceState(null, '', '/Wedding/?guest=An&t=Anh');
    vi.spyOn(document, 'referrer', 'get').mockReturnValue('https://example.com/?guest=An');
    const { getFirebaseClient } = await import('./firebase');
    expect(await getFirebaseClient()).not.toBeNull();
    expect(initializeAnalytics).toHaveBeenCalledWith(app, { config: {
      page_location: `${window.location.origin}/Wedding/`,
      page_referrer: 'https://example.com/',
    } });
  });
});
