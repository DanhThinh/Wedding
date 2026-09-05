import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom không có matchMedia. Nhiều component dò `prefers-reduced-motion`
// trước khi chạy animation nên cần bản thay thế tối thiểu.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
