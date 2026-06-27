/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#E8CC6A',
          500: '#D4AF37',
          600: '#C9A84C',
          700: '#B8960C',
          800: '#9A7D0A',
          900: '#7D6608',
        },
        navy: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#1E3A5F',
          600: '#162D4A',
          700: '#0F2040',
          800: '#0A1628',
          900: '#060D1F',
          950: '#030810',
        },
        brand: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#E8CC6A',
          500: '#D4AF37',
          600: '#C9A84C',
          700: '#B8960C',
          800: '#9A7D0A',
          900: '#7D6608',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(201,168,76,0.08)',
        'gold':       '0 4px 20px rgba(201,168,76,0.25)',
        'modal':      '0 20px 60px rgba(0,0,0,0.6)',
        'btn':        '0 2px 8px rgba(201,168,76,0.35)',
      },
      backgroundImage: {
        'brand-gradient':  'linear-gradient(135deg, #C9A84C 0%, #D4AF37 50%, #E8CC6A 100%)',
        'dark-gradient':   'linear-gradient(180deg, #060D1F 0%, #030810 100%)',
        'card-gradient':   'linear-gradient(135deg, rgba(15,32,64,0.9), rgba(10,22,40,0.95))',
        'hero-gradient':   'linear-gradient(160deg, #030810 0%, #060D1F 40%, #0A1628 100%)',
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'shimmer':  'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      }
    }
  },
  plugins: []
};
