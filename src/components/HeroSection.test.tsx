import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import HeroSection from './HeroSection';

vi.mock('../hooks/weddingContext', () => ({
  useWedding: () => ({
    data: {
      heroSlides: ['/images/hero-1.webp', '/images/hero-2.webp'],
      groom: { shortName: 'Danh Thịnh' },
      bride: { shortName: 'Thuý Hằng' },
      weddingDate: '2099-01-11T18:00:00+07:00',
      weddingDateDisplay: '11 tháng 01 năm 2025',
    },
  }),
}));

vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    killTweensOf: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
  },
}));

describe('HeroSection', () => {
  it('changes the active image when a slide dot is selected', () => {
    const { container } = render(<MemoryRouter><HeroSection /></MemoryRouter>);
    fireEvent.click(screen.getByRole('tab', { name: 'Slide 2' }));

    expect(screen.getByRole('tab', { name: 'Slide 2' }).getAttribute('aria-selected')).toBe('true');
    expect(container.querySelectorAll('.hero-bg-slide')[1].classList.contains('active')).toBe(true);
  });
});
