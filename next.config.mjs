/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fix for Next.js HMR cross-origin blocking (Hot Reloading issue)
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.100.6'],
};

export default nextConfig;
