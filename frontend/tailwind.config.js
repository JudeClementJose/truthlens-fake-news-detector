/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36a9f7',
          500: '#0c8de4',
          600: '#0270c2',
          700: '#03599e',
          800: '#074c82',
          900: '#0c406e',
          950: '#082849',
        },
        darkbg: {
          900: '#0b1329',
          800: '#111c38',
          700: '#1a294d',
          600: '#233663'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
