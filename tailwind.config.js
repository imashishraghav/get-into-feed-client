/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    // 1. Automatic Centered Container with responsive padding
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
    extend: {
      colors: {
        background: '#F8F9FB',
        navy: '#0F172A',
        primary: '#2ED1B2',
        secondary: '#0EA5A4',
        border: '#E2E8F0',
      },
      // 2. Updated Premium Font Family
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, #2ED1B2 0%, #0EA5A4 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
      },
      boxShadow: {
        'soft': '0 20px 40px -15px rgba(14, 165, 164, 0.05)',
        'glow': '0 0 40px -10px rgba(46, 209, 178, 0.4)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.04)',
      },
      // 3. Custom Advanced Keyframes & Animations
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        blob: 'blob 7s infinite',
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [
    // 4. Official Typography Plugin (Crucial for Sanity CMS Blog Rendering)
    require('@tailwindcss/typography'),
    
    // 5. 🟢 FIX: Directly require and call the plugin here to avoid TS type errors
    require('tailwindcss/plugin')(function({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        }
      })
    })
  ],
}