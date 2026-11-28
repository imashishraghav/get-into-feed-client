/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#ffffff',        
          card: '#f9fafb',      
          neon: '#cfff04',      
          neonHover: '#b8e600', 
          text: '#111827',      
          muted: '#4b5563',     
          border: '#e5e7eb',    
          darkBg: '#0f172a'     
        },
        'brand-bg': '#F4F4F5',
        'brand-dark': '#09090B',
        'brand-blue': '#0033FF',
        'brand-lime': '#D4FF00',
        'brand-coral': '#FF6B5E',
        'brand-gray': '#18181B',
        'brand-light-gray': '#F4F4F5',
      },
      boxShadow: {
        'neon': '0 4px 14px 0 rgba(207, 255, 4, 0.39)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        space: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        inter: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
