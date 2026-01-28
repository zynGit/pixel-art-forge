export const locales = ['en', 'fr', 'es', 'fil', 'pl'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

