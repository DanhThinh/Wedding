/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '360px',
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        primary: '#ee8584',
        'primary-light': 'rgba(238, 133, 132, 0.7)',
        'primary-dark': '#9f5958',
        'rose-gold': '#C9956F',
        'cream': '#FAF8F5',
        'blush': '#F3E0DD',
        accent: '#ee8584',
        'text-dark': '#2D2422',
        'text-light': '#7A6B65',
      },
      fontFamily: {
        'cormorant': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'oooh-baby': ['"Oooh Baby"', 'cursive'],
        'bellota': ['"Bellota Text"', 'cursive'],
        'marmelad': ['Marmelad', 'sans-serif'],
        'open-sans': ['"Open Sans"', 'sans-serif'],
        'coiny': ['Coiny', 'cursive'],
        'jura': ['Jura', 'sans-serif'],
        'monte-carlo': ['MonteCarlo', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.9s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-left': 'slideLeft 0.8s ease-out forwards',
        'slide-right': 'slideRight 0.8s ease-out forwards',
        'pulse-heart': 'pulseHeart 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseHeart: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'gradient-blush': 'linear-gradient(135deg, #FAF8F5 0%, #F3E0DD 50%, #FAF8F5 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.55) 100%)',
      },
    },
  },
  plugins: [],
}

