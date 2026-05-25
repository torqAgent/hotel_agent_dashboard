/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#F5C842', dim: '#c9a133', bg: 'rgba(245,200,66,0.08)' },
        dark: { DEFAULT: '#0d0d0d', card: '#141414', surface: '#1a1a1a', border: '#2a2a2a' }
      },
      fontFamily: { sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}
