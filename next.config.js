const withMDX = require('@next/mdx')()
const svgrWebpackConfig = require('./svgr.next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.lux.network',
        pathname: '**',
      },
      {
        protocol: "http",
        hostname: "localhost",
      }
    ],
  },
  transpilePackages: [
    '@hanzo/ui',
    '@hanzo/auth',
    '@hanzo/commerce',
    '@luxfi/ui',
    '@luxfi/data'
  ],
  productionBrowserSourceMaps: true,
  webpack: svgrWebpackConfig
}

module.exports = withMDX(nextConfig)
