import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Fase 2: pôsteres e fotos vêm do TMDB.
    remotePatterns: [{ protocol: 'https', hostname: 'image.tmdb.org' }],
  },
};

export default nextConfig;
