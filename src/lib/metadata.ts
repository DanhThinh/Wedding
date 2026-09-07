import { weddingData } from '../data/weddingData';
import { hasMappableAddress } from './venue';

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]!);

export function createWeddingMetadata(siteUrl = weddingData.siteUrl) {
  const url = new URL(siteUrl);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('VITE_SITE_URL must be an HTTP(S) URL');
  url.search = '';
  url.hash = '';
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  const { groom, bride, weddingDateDisplay, events } = weddingData;
  const names = `${groom.fullName} & ${bride.fullName}`;
  const title = `Thiệp Cưới – ${groom.shortName} & ${bride.shortName} | ${weddingDateDisplay}`;
  const description = `Trân trọng kính mời quý vị đến tham dự lễ thành hôn của ${names} – Ngày ${weddingDateDisplay}.`;
  const image = new URL('images/hero/slide-01.webp', url).href;
  const meta = (kind: 'name' | 'property', key: string, content: string) =>
    `<meta ${kind}="${key}" content="${escapeHtml(content)}" />`;
  const schema = events.map(event => ({
    '@context': 'https://schema.org', '@type': 'Event',
    name: `${event.name} – ${names}`,
    startDate: `${event.date}T${event.time}:00+07:00`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(hasMappableAddress(event.address) ? { location: { '@type': 'Place', name: event.location, address: event.address } } : {}),
    organizer: { '@type': 'Person', name: groom.fullName },
    image, url: url.href, description,
  }));
  return [
    `<title>${escapeHtml(title)}</title>`,
    meta('name', 'description', description),
    meta('name', 'author', names),
    meta('name', 'robots', 'index, follow'),
    `<link rel="canonical" href="${escapeHtml(url.href)}" />`,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', `Thiệp Cưới ${groom.shortName} & ${bride.shortName}`),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:image', image),
    meta('property', 'og:image:alt', `Thiệp cưới của ${names}`),
    meta('property', 'og:url', url.href),
    meta('property', 'og:locale', 'vi_VN'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', image),
    `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}
