import { withNextVideo } from 'next-video/process'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://chart-wild-19023806.figma.site' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext]',
      },
    })

    config.module.rules.push({
      test: /HeartbeatWorker\.js$/,
      type: 'javascript/esm',
    })

    config.resolve.alias.canvas = false

    return config
  },
  experimental: {
    extensionAlias: {
      '.js': ['.tsx', '.ts', '.jsx', '.js'],
    },
  },
}

export default withNextVideo(nextConfig)
