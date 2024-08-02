/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd25sqaee97ji3k.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
export default nextConfig;
