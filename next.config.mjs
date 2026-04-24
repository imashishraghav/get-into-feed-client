/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 1. HATA DIYA: output: 'export' (Ab real server chalega, static HTML nahi!)
  
  reactStrictMode: true,
  
  // 🛡️ 2. Security: Hides Next.js signature from hackers
  poweredByHeader: false,
  
  // 🖼️ 3. PRO IMAGE OPTIMIZATION (unoptimized: true hata diya!)
  // Ab VPS khud images ko compress karke WebP/AVIF mein badlega
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30 days cache for blazing fast load times
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
  },

  // 🧹 4. CLEAN PRODUCTION
  // Production mein console.log hata dega, par errors dikhayega
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error', 'warn'] } 
      : false,
  },

  // ⚡ 5. PERFORMANCE
  // Heavy libraries ko optimize karke load time kam karega
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // 🛡️ 6. ADVANCED: CUSTOM SECURITY HEADERS
  // Ye aapki agency site ko Clickjacking aur XSS attacks se bachayega
  async headers() {
    return [
      {
        // Ye headers website ke har page par apply honge
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Koi aur aapki site ko apne iframe mein nahi chala payega
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Cross-Site Scripting protection
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;