import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['msw', '@mswjs/interceptors'],

  images: {
    formats: ['image/avif', 'image/webp'],
  },

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
