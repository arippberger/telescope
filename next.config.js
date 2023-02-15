/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'opengraph.githubassets.com',
        port: '',
        pathname: '/**',
      },
    ],

  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
