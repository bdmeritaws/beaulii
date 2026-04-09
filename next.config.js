/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'beaulii.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'babshahi.s3.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
