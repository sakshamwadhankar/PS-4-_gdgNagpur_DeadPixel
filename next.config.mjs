/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./prisma/**/*'],
  },
};

export default nextConfig;
