/** @type {import('next').NextConfig} */
const nextConfig = {
  // External packages for server components
  serverExternalPackages: ['graphql-request'],

  // Performance optimizations
  images: {
    // Enable modern image formats
    formats: ['image/webp', 'image/avif'],
    
    // Use remotePatterns instead of deprecated domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'repository-images.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'opengraph.githubassets.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.githubassets.com',
      },
    ],
    
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
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
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
