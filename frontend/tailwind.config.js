// @type {import('tailwindcss').Config}
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        appleBg: '#F5F5F7',
        appleSurface: '#FFFFFF',
        appleText: '#1D1D1F',
        appleSecondaryText: '#86868B',
        appleBlue: '#0071E3',
        appleBlueHover: '#0077ED',
        appleGreen: '#34C759',
        appleRed: '#FF3B30',
        appleOrange: '#FF9500',
        appleBorder: '#D2D2D7',
      },
      boxShadow: {
        'apple-card': '0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-button': '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'apple': '20px',
        'apple-btn': '12px',
      }
    },
  },
  plugins: [],
}
