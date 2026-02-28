/// <reference types="vite/client" />

// Allow importing plain CSS files in TypeScript
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Third-party CSS side-effect imports
declare module 'swiper/css';
declare module 'swiper/css/navigation';
declare module 'swiper/css/pagination';
declare module 'lightgallery/css/lightgallery.css';
declare module 'lightgallery/css/lg-zoom.css';
declare module 'lightgallery/css/lg-thumbnail.css';
