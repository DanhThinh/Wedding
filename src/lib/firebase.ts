// Firebase configuration
// Điền thông tin từ Firebase Console: https://console.firebase.google.com
// Project Settings → General → Your apps → Web app → SDK setup
//
// Có thể dùng biến môi trường (.env) để bảo mật:
//   VITE_FIREBASE_API_KEY=...
//   VITE_FIREBASE_PROJECT_ID=...
//   ...

import type { FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

const isTestMode = import.meta.env.MODE === 'test';

/**
 * Kiểm tra Firebase đã được config chưa.
 * Nếu chưa, app sẽ fallback về localStorage (vẫn hoạt động).
 */
export const isFirebaseConfigured = Boolean(
  !isTestMode && firebaseConfig.apiKey && firebaseConfig.projectId
);

export interface FirebaseClient {
  app: FirebaseApp;
  analytics?: Analytics;
  db: Firestore;
}

let clientPromise: Promise<FirebaseClient | null> | null = null;

/** Firebase chỉ được tải khi một tính năng realtime thực sự cần dùng. */
export function getFirebaseClient(): Promise<FirebaseClient | null> {
  if (!isFirebaseConfigured) return Promise.resolve(null);
  if (clientPromise) return clientPromise;

  clientPromise = Promise.all([
    import('firebase/app'),
    import('firebase/analytics'),
    import('firebase/firestore'),
  ]).then(async ([firebaseApp, analytics, firestore]) => {
    const app = firebaseApp.getApps().length > 0
      ? firebaseApp.getApp()
      : firebaseApp.initializeApp(firebaseConfig);
    const analyticsInstance = firebaseConfig.measurementId && await analytics.isSupported()
      ? analytics.getAnalytics(app)
      : undefined;

    return { app, analytics: analyticsInstance, db: firestore.getFirestore(app) };
  }).catch((err) => {
    console.error('[Firebase] Khởi tạo thất bại:', err);
    clientPromise = null;
    return null;
  });

  return clientPromise;
}
