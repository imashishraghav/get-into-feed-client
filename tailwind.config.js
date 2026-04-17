/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F9FB',
        navy: '#0F172A',
        primary: '#2ED1B2',
        secondary: '#0EA5A4',
        border: '#E2E8F0',
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, #2ED1B2 0%, #0EA5A4 100%)',
      },
      boxShadow: {
        'soft': '0 20px 40px -15px rgba(14, 165, 164, 0.05)',
        'glow': '0 0 40px -10px rgba(46, 209, 178, 0.4)',
      }
    },
  },
  plugins: [],
}