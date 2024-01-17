module.exports = /** @type {import('next').NextConfig} */({
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  }
})