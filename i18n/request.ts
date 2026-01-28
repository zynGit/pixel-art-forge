import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale } from '../i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  // 从请求中获取 locale，如果没有则使用默认值
  let locale = await requestLocale

  // 验证 locale 是否有效
  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale
  }

  // 加载对应语言的 messages，如果失败则使用默认 locale
  let messages
  try {
    messages = (await import(`../messages/${locale}.json`)).default
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    // 如果加载失败且不是默认 locale，尝试加载默认 locale 的 messages
    if (locale !== defaultLocale) {
      try {
        messages = (await import(`../messages/${defaultLocale}.json`)).default
        locale = defaultLocale
      } catch (defaultError) {
        console.error(`Failed to load default locale messages: ${defaultLocale}`, defaultError)
        messages = {}
      }
    } else {
      messages = {}
    }
  }

  return {
    locale,
    messages,
  }
})
