import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '', // 如果有私有路径
    },
    sitemap: 'https://www.pixel-art.online/sitemap.xml',
  }
}