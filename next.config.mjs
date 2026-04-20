/** @type {import('next').NextConfig} */
const nextConfig = {
  // ==========================================================================
  // 1. CORE PERFORMANCE & CLEANLINESS
  // ==========================================================================
  reactStrictMode: true,
  poweredByHeader: false, // Security: Removes "X-Powered-By: Next.js" header
  compress: true, // Enables gzip/brotli compression for faster loads

  // ==========================================================================
  // 2. ADVANCED IMAGE OPTIMIZATION
  // ==========================================================================
  images: {
    formats: ['image/avif', 'image/webp'], // Serves ultra-light formats first
    minimumCacheTTL: 2592000, // 30 Days cache - Saves Sanity API bandwidth
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      // Optional: Agar aap Unsplash se placeholder images use karte hain
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
  },

  // ==========================================================================
  // 3. COMPILER OPTIMIZATIONS (Production Only)
  // ==========================================================================
  compiler: {
    // Jab site live hogi, toh saare console.log automatically remove ho jayenge.
    // (Lekin errors aur warnings rahenge taaki debugging ho sake)
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error', 'warn'] } 
      : false,
  },

  // ==========================================================================
  // 4. BLEEDING-EDGE EXPERIMENTAL FEATURES
  // ==========================================================================
  experimental: {
    // Yeh Framer Motion aur Lucide Icons ki loading speed 10x fast kar dega
    // kyunki yeh sirf wahi code load karega jo actually use hua hai.
    optimizePackageImports: ['lucide-react', 'framer-motion'], 
  },

  // ==========================================================================
  // 5. ENTERPRISE-GRADE SECURITY HEADERS
  // ==========================================================================
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevents clickjacking (koi aapki site iframe me nahi daal payega)
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()', // Blocks unwanted browser features
          },
        ],
      },
    ];
  },
};

export default nextConfig;