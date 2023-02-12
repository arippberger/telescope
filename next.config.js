/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['avif', 'webp', 'jpeg'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
