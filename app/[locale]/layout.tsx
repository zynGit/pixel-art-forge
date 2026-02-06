import React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "../globals.css"
import { GoogleAnalytics } from "@next/third-parties/google"
import { ThemeProvider } from "@/components/theme-provider"
import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import { locales, defaultLocale } from "../../i18n"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const baseUrl = "https://www.pixel-art.online"

function getLocaleUrl(locale: string) {
  return locale === defaultLocale ? `${baseUrl}/` : `${baseUrl}/${locale}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const canonical = getLocaleUrl(locale)
  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = getLocaleUrl(loc)
  }
  return {
    title: "Image to Pixel Art Converter | PixelArtForge",
    description:
      "Free online pixel art converter. Instantly turn images into pixel art with pro palettes like PICO-8 & Sunset 8. 100% private, fast, and easy.",
    authors: [{ name: "PixelArtForge Team" }],
    alternates: {
      canonical,
      languages,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: "Image to Pixel Art Converter | PixelArtForge",
      description:
        "Free online pixel art converter. Instantly turn images into pixel art with pro palettes like PICO-8 & Sunset 8. 100% private, fast, and easy.",
      url: canonical,
      siteName: "PixelArtForge",
      images: [
        {
          url: "/og-image.JPG",
          width: 1200,
          height: 917,
          alt: "PixelArtForge - Image to Pixel Art Converter",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Image to Pixel Art Converter | PixelArtForge",
      description:
        "Free online pixel art converter. Instantly turn images into pixel art with pro palettes like PICO-8 & Sunset 8. 100% private, fast, and easy.",
      images: ["/og-image.JPG"],
    },

    verification: {
      yandex: 'e66aced5c5f85655',
    },
  }
}

async function getMessages(locale: string) {
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default
    return messages
  } catch (error) {
    console.error(`Missing messages for locale: ${locale}`, error)
    return null
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound()
  }

  const messages = await getMessages(locale)

  if (!messages) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}

