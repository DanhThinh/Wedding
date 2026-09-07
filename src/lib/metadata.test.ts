import { describe, expect, it } from 'vitest';
import { weddingData } from '../data/weddingData';
import { inviteData } from '../data/inviteData';
import { createWeddingMetadata } from './metadata';

describe('wedding content consistency', () => {
  it('uses the displayed wedding date for sharing and real event dates for structured data', () => {
    const html = createWeddingMetadata();
    expect(html).toContain(weddingData.weddingDateDisplay);
    expect(html).not.toContain('2027-01-11');
    const schema = JSON.parse(html.match(/<script[^>]*>(.*)<\/script>/)![1]);
    expect(schema.map((event: { startDate: string }) => event.startDate)).toEqual(weddingData.events.map(event => `${event.date}T${event.time}:00+07:00`));
    expect(schema[1].location).toBeUndefined();
  });
  it('generates absolute preview images under the configured subpath', () => {
    const html = createWeddingMetadata('https://example.com/invite?guest=An');
    expect(html).toContain('https://example.com/invite/images/hero/slide-01.webp');
    expect(html).not.toContain('guest=');
    expect(() => createWeddingMetadata('javascript:alert(1)')).toThrow();
  });
  it('shares story milestones between invitation styles', () => {
    expect(inviteData.story.milestones.map(item => item.year)).toEqual(weddingData.story.map(item => item.date.split('/')[2]));
  });
});
