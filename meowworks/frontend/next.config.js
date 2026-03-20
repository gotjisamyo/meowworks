/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/agents', destination: '/dashboard', permanent: false },
      { source: '/analytics', destination: '/dashboard', permanent: false },
      { source: '/crm', destination: '/dashboard', permanent: false },
      { source: '/inventory', destination: '/dashboard', permanent: false },
      { source: '/marketing', destination: '/dashboard', permanent: false },
      { source: '/pricing', destination: '/dashboard', permanent: false },
      { source: '/projects', destination: '/dashboard', permanent: false },
      { source: '/team', destination: '/dashboard', permanent: false },
      { source: '/admin', destination: '/dashboard', permanent: false },
      { source: '/admin/:path*', destination: '/dashboard', permanent: false },
    ];
  },
};

module.exports = nextConfig;
