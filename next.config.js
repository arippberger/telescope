/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Optimize CSS for faster loading
    optimizeCss: true,
    
    // Enable server components optimization
    serverComponentsExternalPackages: ['graphql-request'],
  },

  // Performance optimizations
  images: {
    // Enable modern image formats
    formats: ['image/webp', 'image/avif'],
    
    // Add image domains for GitHub avatars
    domains: ['github.com', 'avatars.githubusercontent.com'],
    
    // Enable image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler optimizations
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets for 1 year
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Enable tree shaking for better bundle size
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Optimize chunk splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Enable bundle analyzer in development when ANALYZE=true
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      );
    }

    return config;
  },

  // Output configuration for better performance
  output: 'standalone',
  
  // Enable gzip compression
  compress: true,
  
  // Optimize for production builds
  swcMinify: true,
  
  // Enable static optimization
  trailingSlash: false,
  
  // Performance budgets (warnings in development)
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/user/:path*',
        destination: '/users/:path*',
        permanent: true,
      },
    ];
  },

  // Environment variables for build optimization
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
};

module.exports = nextConfig;
