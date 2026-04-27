/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF6B9A',
          rose: '#FF9FC0',
          blush: '#FFE7F0',
          orange: '#FFB36B',
          peach: '#FFD6B3',
          green: '#31C36A',
          dark: '#121826',
          card: '#FFF7FB',
          muted: '#6A7083',
          soft: '#FFFDFB',
        },
      },
      fontFamily: { sans: ['Noto Sans Thai', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
