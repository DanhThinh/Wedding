/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
  readonly VITE_BACKGROUND_MUSIC_SRC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Allow importing plain CSS files in TypeScript
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Third-party CSS side-effect imports
declare module 'lightgallery/css/lightgallery.css';
declare module 'lightgallery/css/lg-zoom.css';
declare module 'lightgallery/css/lg-thumbnail.css';
