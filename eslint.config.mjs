import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  // Core Next.js Web Vitals (Standard)
  ...nextVitals,
  
  // ==========================================================================
  // 1. ADVANCED GLOBAL IGNORES (Speeds up linting time)
  // ==========================================================================
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "public/**",        // Static assets ko lint karne ki zaroorat nahi hai
    "**/*.config.js",   // Config files ko ignore karein taaki false errors na aayein
    "next-env.d.ts",
  ]),

  // ==========================================================================
  // 2. ENTERPRISE-GRADE CUSTOM RULES
  // ==========================================================================
  {
    rules: {
      // 🔴 REACT & HOOKS STRICTNESS (Prevents Memory Leaks)
      // Default 'warn' ko 'error' mein badal diya hai. Framer motion aur smooth scroll 
      // ke sath useEffect mein dependencies miss hone se infinite loop lag sakta hai.
      "react-hooks/exhaustive-deps": "error", 
      
      // Copywriting ko aasan banata hai. "We're" likhne par error nahi dega.
      "react/no-unescaped-entities": "off",   
      
      // Framer Motion ke custom components (forwardRef) ke sath error nahi dega.
      "react/display-name": "off",            

      // 🟡 CODE CLEANLINESS (Prevents Dead Code)
      // Normal console.log() par warning dega, par console.error() allow karega. 
      // Production mein garbage logs nahi jayenge.
      "no-console": ["warn", { allow: ["warn", "error"] }], 
      
      // Jo variables ya imports use nahi hue hain, unpar error dega taaki file size 
      // chhota rahe. (Agar variable ke aage "_" laga hai jaise "_unused", toh allow karega).
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_", 
        "varsIgnorePattern": "^_" 
      }], 

      // 🟢 NEXT.JS STRICT PERFORMANCE
      // Strictly Next/Image force karega taaki LCP (Largest Contentful Paint) score 100 rahe.
      "@next/next/no-img-element": "error", 
      
      // Normal <a> tags ko block karega aur <Link> force karega taaki page reload na ho 
      // aur smooth page transitions break na hon.
      "@next/next/no-html-link-for-pages": "error", 
    }
  }
]);

export default eslintConfig;