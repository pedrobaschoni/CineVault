import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O repositório tem outro package-lock.json na raiz; a raiz deste app é esta pasta.
  turbopack: { root: path.resolve(__dirname) },
  images: {
    remotePatterns: [
      // Pôsteres, fundos, fotos e logos de streaming.
      { protocol: 'https', hostname: 'image.tmdb.org' },
      // Miniaturas dos trailers.
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
};

export default nextConfig;
