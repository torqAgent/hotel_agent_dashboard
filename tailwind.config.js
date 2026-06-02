/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary colors using CSS variables
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          hover: 'var(--bg-hover)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        gold: {
          DEFAULT: 'var(--gold-primary)',
          dim: 'var(--gold-secondary)',
          bg: 'var(--gold-bg)',
        },
        // Legacy dark theme colors (for backwards compatibility)
        dark: {
          DEFAULT: '#0d0d0d',
          card: 'var(--bg-secondary)',
          surface: 'var(--bg-tertiary)',
          border: 'var(--border-color)',
        },
      },
      fontFamily: { sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}

