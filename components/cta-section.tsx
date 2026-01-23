import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
          {/* Background effects */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[200px] w-[300px] rounded-full bg-accent/5 blur-2xl" />
          </div>

          <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to transform your creative workflow?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
                Join thousands of creators using PixelArtForge AI to bring their visions to life. Start free, upgrade when you need more.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="group bg-foreground text-background hover:bg-foreground/90"
                >
                  Start Creating for Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border bg-transparent text-foreground hover:bg-secondary"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
