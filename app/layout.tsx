import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Image to Pixel Art Converter | PixelArtForge',
  description: 'Free online pixel art converter. Instantly turn images into pixel art with pro palettes like PICO-8 & Sunset 8. 100% private, fast, and easy.',
  authors: [{ name: 'PixelArtForge Team' }],
  alternates: {
    canonical: 'https://www.pixel-art.online/',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}
