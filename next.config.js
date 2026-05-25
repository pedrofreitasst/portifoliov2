/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // ⚙️ CDN da Behance — usado nas thumbnails dos projetos linkados de lá.
      // A Behance ocasionalmente rotaciona essas URLs; se uma imagem sumir,
      // baixe ela e coloque em /public/projects/ como fallback.
      { protocol: 'https', hostname: 'mir-s3-cdn-cf.behance.net' },
    ],
  },
};

module.exports = nextConfig;
