import { useWedding } from '../hooks/useWedding';

export default function Header() {
  const { data } = useWedding();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo left */}
          <a href="/" className="flex items-center">
            <div className="w-[50px] h-[50px] bg-primary rounded flex items-center justify-center">
              <span className="text-white font-oooh text-lg">HT</span>
            </div>
          </a>

          {/* Center monogram */}
          <a href="#hero" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <h1 className="text-2xl font-oooh uppercase flex items-center gap-2">
              {data.groom.initial}
              <span className="heart-icon w-5 h-5"></span>
              {data.bride.initial}
            </h1>
          </a>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2 text-primary" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
