/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  i18n: {
    locales: ['uk', 'ru'],
    defaultLocale: 'uk',
    localeDetection: false,
  },
  images: {
    domains: ['a-k.name', 'newimg.otpusk.com'],
  },
};

module.exports = nextConfig;
