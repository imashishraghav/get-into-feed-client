// @ts-nocheck
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // 1. Allows you to use @import to keep your CSS modular and clean
    'postcss-import': {},
    
    // 2. 🟢 FIX: String ki jagah empty object {} use kiya hai taaki TypeScript error na de
    'tailwindcss/nesting': {},
    
    // 3. Core Tailwind engine
    tailwindcss: {},
    
    // 4. Automatically adds vendor prefixes (-webkit-, -moz-) for cross-browser support
    autoprefixer: {},
    
    // Note: Next.js handles CSS minification automatically in production via cssnano, 
    // so we don't need to manually add it here.
  },
};

export default config;