import { useState, useEffect } from 'react';
import { useWedding } from '../hooks/useWedding';

export default function HeroSection() {
  const { data, openModal } = useWedding();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [data.heroSlides.length]);

  return (
    <section id="hero" className="relative min-h-screen pt-[90px] hero-clip overflow-hidden">
      {/* Slideshow Background */}
      <div className="absolute inset-0 -mt-[70px] -z-10">
        {data.heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
            }`}
            style={{
              backgroundImage: `url(${slide})`,
              transitionProperty: 'opacity, transform',
              transitionDuration: '1s, 10s',
            }}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-90px)] text-center text-white">
        {/* Save the Date */}
        <h2 
          className="font-oooh text-3xl md:text-4xl mb-4 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          Save the Date
        </h2>

        {/* Couple Names */}
        <h1 className="font-bellota text-4xl md:text-6xl lg:text-7xl mb-6 flex flex-wrap items-center justify-center gap-2 md:gap-4">
          <span 
            className="animate-slide-right"
            style={{ animationDelay: '0.3s' }}
          >
            {data.groom.shortName}
          </span>
          <small 
            className="animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            &amp;
          </small>
          <span 
            className="animate-slide-left"
            style={{ animationDelay: '0.3s' }}
          >
            {data.bride.shortName}
          </span>
        </h1>

        {/* Wedding Date */}
        <div 
          className="text-xl md:text-2xl font-bellota mb-8 animate-fade-in"
          style={{ animationDelay: '1s' }}
        >
          {data.weddingDateDisplay}
        </div>

        {/* CTA Button */}
        <div 
          className="animate-fade-in"
          style={{ animationDelay: '1s' }}
        >
          <button
            onClick={() => openModal('guestbook')}
            className="btn-light"
          >
            <span className="h-lines"></span>
            <span className="v-lines"></span>
            Gửi Lời Chúc
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center text-white/80">
            <span className="text-sm mb-2">Kéo xuống</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
