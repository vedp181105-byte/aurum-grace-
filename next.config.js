/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  async rewrites() {
    // Proxy /api/* requests to Express backend (port 3000)
    return [
      { source: '/api/:path*', destination: 'http://localhost:3000/api/:path*' },
    ];
  },
};

module.exports = nextConfig;
