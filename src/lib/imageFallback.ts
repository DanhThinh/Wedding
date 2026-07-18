export const DEFAULT_IMAGE_FALLBACK = `${import.meta.env.BASE_URL}images/fallback/photo-fallback.webp`;

export function setImageFallback(
  image: HTMLImageElement,
  fallbackSrc = DEFAULT_IMAGE_FALLBACK
) {
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = fallbackSrc;
}
