/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9ec',
          100: '#f9efcc',
          200: '#f1db8a',
          300: '#e9c74d',
          400: '#d4af37',
          500: '#b8972e',
          600: '#9a7a22',
          700: '#7c5f1a',
          800: '#5e4714',
          900: '#3f2f0d',
        },
        obsidian: {
          50:  '#f4f4f4',
          100: '#e0e0e0',
          200: '#c2c2c2',
          300: '#a0a0a0',
          400: '#757575',
          500: '#505050',
          600: '#333333',
          700: '#1f1f1f',
          800: '#141414',
          900: '#0A0A0A',
        },
        cream: {
          50:  '#fdfcf9',
          100: '#f9f6ef',
          200: '#f5f0e8',
          300: '#ede3d0',
          400: '#e0d0b4',
          500: '#ccb990',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        ultra:  '0.5em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'draw-line': 'drawLine 1.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
};
