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
      "PixelArtForge is a high-performance, browser-based converter that transforms any photograph or image into stunning pixel art instantly. By manually adjusting the pixel scale and applying curated professional palettes, you get crisp.",
  },
  {
    question: "What additional features does PixelArtForge offer besides pixelation?",
    answer:
      "PixelArtForge provides professional-grade tools to refine your art: 1. **Select Palette:** Choose from curated color sets like PICO-8 or Sunset 8 to give your art a specific retro era's feel. 2. **Enhancements:** We offer 'Outline' and 'Dither' effects to add depth and character. Please note that current Enhancement features are specifically optimized for images with transparent backgrounds to ensure perfect sprite generation.",
  },
  {
    question: "How long does it take to convert an image?",
    answer:
      "Most conversions complete in just a few seconds. Complex images with higher resolution outputs may take slightly longer, but typically no more than 10-15 seconds.",
  },
  {
    question: "Can I use the generated pixel art commercially?",
    answer:
      "Yes! You hold 100% ownership of the art created with PixelArtForge. Furthermore, your original images are processed entirely in your browse,they are never uploaded to our servers. This ensures the security of your privacy.",
  },
]

export function FAQSection() {
  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-0 rounded-xl border border-border lg:grid-cols-[1fr_2fr]">
          {/* Left Column - Title and Contact */}
          <div className="border-b border-border p-8 lg:border-b-0 lg:border-r lg:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
            Have any questions? Take a look at the FAQ content on the right side to see if it can be of help to you.
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
