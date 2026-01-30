import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '../i18n'

const baseUrl = 'https://www.pixel-art.online'

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: locale === defaultLocale ? `${baseUrl}/` : `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))
}
