import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['msw', '@mswjs/interceptors'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  cacheComponents: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-east-005.backblazeb2.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typedRoutes: true,
  async headers() {
    return [
      {
        source: '/(.*)', // all of routes
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' }
        ],
      },
    ]
  },
};

export default nextConfig;
