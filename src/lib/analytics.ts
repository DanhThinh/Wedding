import { getFirebaseClient } from './firebase';
import { getAnalyticsPageParams } from './analyticsPrivacy';

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

const BLOCKED_PARAM_KEYS = [
  'address',
  'email',
  'guest',
  'message',
  'name',
  'note',
  'phone',
  'tel',
  'wish',
];

export type AnalyticsEventName =
  | 'calendar_add'
  | 'calendar_menu_open'
  | 'envelope_open'
  | 'gallery_open'
  | 'hero_cta_click'
  | 'hero_slide_select'
  | 'map_directions_open'
  | 'map_toggle'
  | 'music_toggle'
  | 'rsvp_submit'
  | 'rsvp_validation_error'
  | 'wish_submit';

export function sanitizeAnalyticsParams(params: AnalyticsParams = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([key, value]) => {
      if (value === undefined || value === null) return false;
      const normalizedKey = key.toLowerCase();
      return !BLOCKED_PARAM_KEYS.some(blocked => normalizedKey.includes(blocked));
    }),
  );
}

export async function trackEvent(eventName: AnalyticsEventName, params: AnalyticsParams = {}) {
  try {
    const client = await getFirebaseClient();
    if (!client?.analytics) return;
    const { logEvent } = await import('firebase/analytics');
    logEvent(client.analytics, eventName, {
      ...sanitizeAnalyticsParams(params),
      ...getAnalyticsPageParams(),
    });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[Analytics] Không thể ghi event:', eventName, err);
    }
  }
}
