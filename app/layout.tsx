import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'PixelArtForge | Professional Image to Pixel Art Converter',
  description: 'Convert any image to crisp pixel art instantly. 100% private, browser-based algorithmic processing with professional palettes like PICO-8 and Sunset 8. No AI blur, just precision.',
  keywords: [
    'pixel art converter', 
    'image to pixel art', 
    'game asset creator', 
    'PICO-8 palette', 
    'retro art generator', 
    'transparent pixel sprite'
  ],
  authors: [{ name: 'PixelArtForge Team' }],
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
      </body>
    </html>
  )
}
