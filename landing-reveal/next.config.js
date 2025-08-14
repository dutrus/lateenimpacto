/** @type {import('next').NextConfig} */
const nextConfig = {
  // Eliminamos la configuración de i18n
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
