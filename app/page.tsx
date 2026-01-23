import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BentoGrid } from "@/components/bento-grid"
// import { SEOContent } from "@/components/seo-content"
import { FAQSection } from "@/components/faq-section"
// import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
