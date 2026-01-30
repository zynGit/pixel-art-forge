export const locales = ['en', 'fr', 'es', 'fil', 'ja', 'zh'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

