/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2b2854',
        secondary: '#6671d2',
        'primary-light': 'rgba(43, 40, 84, 0.2)'
      },
      fontFamily: {
        syne: ['var(--font-syne)'],
        raleway: ['var(--font-raleway)'],
      },
    },
  },
  plugins: [],
} 