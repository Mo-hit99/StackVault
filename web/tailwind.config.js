export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['attribute', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Instrument Serif', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        accent: 'var(--accent)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
