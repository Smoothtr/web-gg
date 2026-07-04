/** @type {import('tailwindcss').Config} */

// Token màu tham chiếu CSS variables (kênh "R G B") để hỗ trợ <alpha-value>.
// Giá trị light/dark được định nghĩa trong src/index.css (:root và .dark).
const tokenColors = {
  background: 'rgb(var(--c-background) / <alpha-value>)',
  surface: 'rgb(var(--c-surface) / <alpha-value>)',
  'surface-container-low': 'rgb(var(--c-surface-container-low) / <alpha-value>)',
  'surface-container': 'rgb(var(--c-surface-container) / <alpha-value>)',
  'surface-container-high': 'rgb(var(--c-surface-container-high) / <alpha-value>)',
  'surface-variant': 'rgb(var(--c-surface-variant) / <alpha-value>)',
  'surface-dim': 'rgb(var(--c-surface-dim) / <alpha-value>)',
  'on-surface': 'rgb(var(--c-on-surface) / <alpha-value>)',
  'on-surface-variant': 'rgb(var(--c-on-surface-variant) / <alpha-value>)',
  'outline-variant': 'rgb(var(--c-outline-variant) / <alpha-value>)',
  outline: 'rgb(var(--c-outline) / <alpha-value>)',
  primary: 'rgb(var(--c-primary) / <alpha-value>)',
  'on-primary': 'rgb(var(--c-on-primary) / <alpha-value>)',
  'primary-fixed': 'rgb(var(--c-primary-fixed) / <alpha-value>)',
  'primary-fixed-dim': 'rgb(var(--c-primary-fixed-dim) / <alpha-value>)',
  secondary: 'rgb(var(--c-secondary) / <alpha-value>)',
  'secondary-container': 'rgb(var(--c-secondary-container) / <alpha-value>)',
  'on-secondary-container': 'rgb(var(--c-on-secondary-container) / <alpha-value>)',
  tertiary: 'rgb(var(--c-tertiary) / <alpha-value>)',
  'inverse-surface': 'rgb(var(--c-inverse-surface) / <alpha-value>)',
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: tokenColors,
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'sans-serif'],
        heading: ['var(--font-heading)', 'Sora', 'sans-serif'],
        serif: ['var(--font-heading)', 'Sora', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
