// Firebase configuration
// Điền thông tin từ Firebase Console: https://console.firebase.google.com
// Project Settings → General → Your apps → Web app → SDK setup
//
// Dùng biến môi trường (.env) để quản lý cấu hình theo từng môi trường:
//   VITE_FIREBASE_API_KEY=...
//   VITE_FIREBASE_PROJECT_ID=...
//   ...

import type { FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import type { Firestore } from 'firebase/firestore';
import { getAnalyticsPageParams } from './analyticsPrivacy';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY?.trim() || '';

const isTestMode = import.meta.env.MODE === 'test';

/**
 * Kiểm tra Firebase đã được config chưa.
 * Nếu chưa, RSVP giữ bản nháp và báo chưa gửi được.
 */
export const isFirebaseConfigured = Boolean(
  !isTestMode && firebaseConfig.apiKey && firebaseConfig.projectId
);

export interface FirebaseClient {
  app: FirebaseApp;
  db: Firestore;
}

let appPromise: Promise<FirebaseApp | null> | null = null;
let clientPromise: Promise<FirebaseClient | null> | null = null;
let analyticsPromise: Promise<Analytics | null> | null = null;

function getFirebaseApp(): Promise<FirebaseApp | null> {
  if (!isFirebaseConfigured) return Promise.resolve(null);
  if (appPromise) return appPromise;
  appPromise = import('firebase/app').then(async firebaseApp => {
    const app = firebaseApp.getApps().length > 0
      ? firebaseApp.getApp()
      : firebaseApp.initializeApp(firebaseConfig);

    if (appCheckSiteKey && typeof window !== 'undefined') {
      const appCheck = await import('firebase/app-check');
      appCheck.initializeAppCheck(app, {
        provider: new appCheck.ReCaptchaV3Provider(appCheckSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }

    return app;
  }).catch((err) => {
    console.error('[Firebase] Khởi tạo thất bại:', err);
    appPromise = null;
    return null;
  });
  return appPromise;
}

/** Load Firestore only for RSVP/guestbook, independently of optional Analytics. */
export function getFirebaseClient(): Promise<FirebaseClient | null> {
  if (!isFirebaseConfigured) return Promise.resolve(null);
  if (clientPromise) return clientPromise;
  clientPromise = Promise.all([getFirebaseApp(), import('firebase/firestore')]).then(([app, firestore]) => {
    if (!app) { clientPromise = null; return null; }
    return { app, db: firestore.getFirestore(app) };
  }).catch(() => { clientPromise = null; return null; });
  return clientPromise;
}

/** Opening the cover may log an event, but must not pull in the Firestore bundle. */
export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!isFirebaseConfigured || !firebaseConfig.measurementId) return Promise.resolve(null);
  if (analyticsPromise) return analyticsPromise;
  analyticsPromise = Promise.all([getFirebaseApp(), import('firebase/analytics')]).then(async ([app, analytics]) => {
    if (!app) { analyticsPromise = null; return null; }
    return await analytics.isSupported() ? analytics.initializeAnalytics(app, { config: getAnalyticsPageParams() }) : null;
  }).catch(() => { analyticsPromise = null; return null; });
  return analyticsPromise;
}
