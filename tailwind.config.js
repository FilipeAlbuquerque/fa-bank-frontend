/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,scss}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf8e1',
          100: '#f9ecb0',
          200: '#f5e07e',
          300: '#f1d44c',
          400: '#edca2a',
          500: '#C9A227',
          600: '#B8860B',
          700: '#9a6f08',
          800: '#7c5806',
          900: '#5e4104',
        },
        blood: {
          500: '#8B0000',
          600: '#7a0000',
          mid: '#A00000',
        },
        dark: {
          600: '#1a1a1a',
          700: '#111111',
          800: '#0a0a0a',
          900: '#050505',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
