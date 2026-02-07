import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Allow BMKG images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-apps.bmkg.go.id',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'api.bmkg.go.id',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
