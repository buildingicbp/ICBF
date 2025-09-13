/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'media.graphassets.com' },
    ],
  },
  experimental: {
    // Disable static generation for auth callback to avoid build issues
    workerThreads: false,
    cpus: 1
  },
}

export default nextConfig
