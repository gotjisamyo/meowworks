/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { orange: '#FF6B35', dark: '#0D0D14', card: '#151520' },
      },
      fontFamily: { sans: ['Nunito', 'sans-serif'] },
    },
  },
  plugins: [],
};
