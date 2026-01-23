import { Lightbulb, Gamepad2, Brain } from "lucide-react"

const seoColumns = [
  {
    icon: Lightbulb,
    title: "Pixel Art Ideas",
    description:
      "Stuck on what to create? Our AI provides endless Pixel Art Ideas for characters, landscapes, and game assets.",
  },
  {
    icon: Gamepad2,
    title: "Game Dev Tool",
    description:
      "Perfect for indie developers. Generate Game Sprites and Minecraft Patterns in seconds.",
  },
  {
    icon: Brain,
    title: "How it Works",
    description:
      "Using advanced Neural Networks to analyze edges and map colors to professional palettes like Pico-8 and NES.",
  },
]

export function SEOContent() {
  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            AI Pixel Art Generator: Transform Photos into 8-Bit Masterpieces
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Harness the power of artificial intelligence to create stunning retro-style pixel art from any image
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {seoColumns.map((column) => (
            <div
              key={column.title}
              className="group relative rounded-2xl border border-border bg-card/50 p-8 transition-all duration-300 hover:border-accent/50 hover:bg-card/80"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -inset-px rounded-2xl bg-accent/5" />
              </div>
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <column.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {column.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {column.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
