import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'cilsrdpvqtgutxprdofn.supabase.co', // For the FASHN logo
      'cdn.fashn.ai', // For FASHN API result images
      'api.fashn.ai', // Another potential domain for FASHN images
      'v3.fal.media', // For example images in documentation
      'custom-icon-badges.demolab.com', // For badges
      'img.shields.io', // For badges
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: [] }
  },
};

export default nextConfig;
