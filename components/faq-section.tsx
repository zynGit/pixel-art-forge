import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    question: "What is PixelArtForge?",
    answer:
      "PixelArtForge is a professional image to pixel art converter that transforms any photo into crisp pixel art instantly. Fine-tune your image to pixel results with precise resolution control and curated professional palettes for the ultimate retro aesthetic.",
  },
  {
    question: "How do I apply professional palettes to my pixel art?",
    answer: `To the left of the image upload area, you will find the "Select Palette" panel. Simply click on any professional preset (such as PICO-8 or Sunset 8) to instantly apply classic retro color profiles to your image to pixel art conversion.

Real-time Interaction: Hover your mouse over any color strip to reveal the palette's name. The "Active" label will indicate which palette is currently selected.

Flexible Control: Use the toggle switch at the top to enable or disable the palette effect at any time. This allows you to easily compare the original image colors with the professional retro results.

By using these curated palettes, your pixel art generator can produce more authentic artwork that adheres to classic retro hardware standards.`,
  },
  {
    question: "What additional features does PixelArtForge offer besides pixelation?",
    answer: `PixelArtForge is a comprehensive image to pixel art converter featuring advanced refinement tools:

1. Curated Palettes: Instantly apply iconic color sets like PICO-8 or Sunset 8 to achieve authentic retro aesthetics.

2. Pixel Enhancements: Add depth with specialized Outline and Dither effects. These are precision-optimized for transparent images, making it the perfect pixel art generator for creating high-quality game sprites.`,
  },
  {
    question: "How long does it take to convert an image to pixel art?",
    answer:
      "Conversion is instant for most images. Since PixelArtForge uses a high-performance browser-based pixel art generator, your photos are processed locally in seconds.",
  },
  {
    question: "Can I use the generated pixel art for commercial projects?",
    answer: `Absolutely!You retain 100% ownership and full commercial rights for all artwork created with our image to pixel art converter.
For your security, PixelArtForge processes images entirely in your browser. Your original files are never uploaded to our servers, ensuring your creative work and privacy remain completely under your control.`,
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

export function FAQSection() {
  return (
    <section className="py-10 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-0 rounded-xl border border-border lg:grid-cols-[1fr_2fr]">
          {/* Left Column - Title and Contact */}
          <div className="border-b border-border p-8 lg:border-b-0 lg:border-r lg:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Image to Pixel Art FAQ
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Have questions about our pixel art generator? Check the details on the right for tips on professional image to pixel art conversion and palette settings.
            </p>
            {/* <p className="mt-2 text-muted-foreground">
              Email:{" "}
              <span className="text-foreground">support@PixelArtForge.ai</span>
            </p>
            <p className="mt-6 text-muted-foreground">
              Or contact us via{" "}
              <Link
                href="#"
                className="text-accent hover:underline underline-offset-4 transition-colors"
              >
                Discord
              </Link>
            </p> */}
          </div>

          {/* Right Column - Accordion FAQ */}
          <div className="p-8 lg:p-10">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-border"
                >
                  <AccordionTrigger className="text-base font-medium text-foreground hover:text-accent hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
