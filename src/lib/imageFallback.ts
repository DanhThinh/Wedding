export const DEFAULT_IMAGE_FALLBACK = '/images/fallback/photo-fallback.webp';

export function setImageFallback(
  image: HTMLImageElement,
  fallbackSrc = DEFAULT_IMAGE_FALLBACK
) {
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = fallbackSrc;
}
