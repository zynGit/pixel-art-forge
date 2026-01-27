import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BentoGrid } from "@/components/bento-grid"
// import { SEOContent } from "@/components/seo-content"
import { FAQSection } from "@/components/faq-section"
// import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PixelArtForge",
  url: "https://www.pixel-art.online/",
  description:
    "Free online pixel art converter. Instantly turn images into pixel art with pro palettes like PICO-8 & Sunset 8. 100% private, fast, and easy.",
  inLanguage: "en",
}

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PixelArtForge",
  "operatingSystem": "Web",
  "applicationCategory": "ImageEditor",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Free online pixel art converter. Instantly turn images into pixel art with pro palettes like PICO-8 & Sunset 8. 100% private, fast, and easy.",
  // "aggregateRating": {
  //   "@type": "AggregateRating",
  //   "ratingValue": "5",
  //   "ratingCount": "1" // 初始可以写 1，后续有真实评价再增加
  // },
  "featureList": [
    "Image to Pixel Art conversion",
    "PICO-8 and Sunset 8 palettes",
    "Transparent background support",
    "Browser-based local processing"
  ]
}

const homeJsonLd = [webSiteSchema, softwareAppSchema];

export default function Home() {
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
        <FAQSection />
        {/* <SEOContent /> */}
        {/* <CTASection /> */}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
