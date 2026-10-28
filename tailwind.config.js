/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf8f6',
          100: '#f2ece7',
          200: '#e5d9d0',
          300: '#d2c2b7',
          400: '#b9a79a',
          500: '#9f8c7f',
          600: '#847368',
          700: '#6f6057',
          800: '#5a4e47',
          900: '#423a35',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 8px 24px -18px rgba(15, 23, 42, 0.24), 0 1px 3px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 16px 32px -22px rgba(15, 23, 42, 0.28), 0 4px 12px -8px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
