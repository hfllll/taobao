/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tb: {
          orange: '#ff5000',
          red: '#ff4400',
          pink: '#ff9640',
          dark: '#3c3c3c',
          gray: '#f5f5f5'
        }
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(0,0,0,0.08)',
        hover: '0 8px 24px 0 rgba(0,0,0,0.15)'
      }
    }
  },
  plugins: []
}
