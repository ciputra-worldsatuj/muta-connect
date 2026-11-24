/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Mendukung mode gelap untuk layar proyektor
  theme: {
    extend: {
      colors: {
        // Token warna mengacu pada Design System (design-system.md)
        brand: {
          primary: '#1E3A8A',
          'primary-hover': '#172E6E',
          accent: '#0D9488',
          'accent-light': '#2DD4BF',
          'dark-primary': '#93B4FF',
          'dark-accent': '#2DD4BF',
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#CBD5E1',
          'dark-bg': '#0B1220',
          'dark-card': '#131C2E',
          'dark-border': '#2A3650',
        },
        content: {
          main: '#0F172A',
          muted: '#475569',
          'dark-main': '#F1F5F9',
          'dark-muted': '#A8B3C7',
        },
        status: {
          success: '#15803D',
          'success-dark': '#4ADE80',
          warning: '#B45309',
          'warning-dark': '#FBBF24',
          danger: '#B91C1C',
          'danger-dark': '#F87171',
          info: '#1D4ED8',
          'info-dark': '#60A5FA',
          late: '#7C3AED',
          'late-dark': '#C4B5FD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
