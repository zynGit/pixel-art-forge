import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BentoGrid } from "@/components/bento-grid"
import { SEOContent } from "@/components/seo-content"
import { FAQSection } from "@/components/faq-section"
// import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { defaultLocale } from "@/i18n"

const baseUrl = "https://www.pixel-art.online"

function getLocaleUrl(locale: string) {
  return locale === defaultLocale ? `${baseUrl}/` : `${baseUrl}/${locale}`
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeUrl = getLocaleUrl(locale)

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PixelArtForge",
    url: localeUrl,
    description:
      "Free online pixel art converter. Instantly turn images into pixel art with pro palettes like PICO-8 & Sunset 8. 100% private, fast, and easy.",
    inLanguage: locale,
  }

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PixelArtForge",
    url: localeUrl,
    inLanguage: locale,
    operatingSystem: "Web",
    applicationCategory: "ImageEditor",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free online pixel art converter. Instantly turn images into pixel art with pro palettes like PICO-8 & Sunset 8. 100% private, fast, and easy.",
    featureList: [
      "Image to Pixel Art conversion",
      "PICO-8 and Sunset 8 palettes",
      "Transparent background support",
      "Browser-based local processing",
    ],
  }

  const homeJsonLd = [webSiteSchema, softwareAppSchema];

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Header />
      <main>
        <HeroSection />
        <BentoGrid />
        <SEOContent />
        <FAQSection />
        {/* <CTASection /> */}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

