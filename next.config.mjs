/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aapki normal settings yahan rahengi
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;