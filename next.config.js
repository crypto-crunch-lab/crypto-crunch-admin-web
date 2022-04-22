// 1. nextConfig
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

// 2. withLess
const withLess = require('next-with-less')

module.exports = withLess({
  // reactStrictMode: true,
  lessLoaderOptions: {},
})

module.exports = {
  reactStrictMode: true,
  // env 내용 추가
  env: {
    BASE_URL: process.env.BASE_URL,
  },
}

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/defi/list',
        permanent: true,
      },
    ]
  },
}
