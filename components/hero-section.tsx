 "use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ImageComparison from "@/components/react-compare-slider"
import { useTranslations } from "next-intl"

export function HeroSection() {
  const t = useTranslations("HeroSection")

  return (
    <section className="relative overflow-hidden pt-32 pb-10 sm:pt-40 sm:pb-12">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-20 right-1/4 h-[300px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:center">
          {/* 左侧文字区域 */}
          <div className="w-full text-center md:w-3/5 md:text-left">
            <div className="mx-auto max-w-2xl">
              <h1 className=" text-5xl font-bold tracking-tight text-foreground leading-normal">
                {t("title")}
              </h1>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* 右侧图片对比区域 */}
          <div className="w-full md:w-2/5">
            <div className="mx-auto max-w-md md:max-w-sm">
              <ImageComparison />
            </div>
          </div>
          {/* Badge */}
          {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Now in public beta
          </div> */}

          {/* Headline */}
          {/* <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Create stunning visuals with{" "}
            <span className="text-accent">AI-powered</span> precision
          </h1> */}

          {/* Subheadline */}
          {/* <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Transform your creative vision into reality. Generate, edit, and enhance images using cutting-edge artificial intelligence technology.
          </p> */}

          {/* CTA Buttons */}
          {/* <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group bg-foreground text-background hover:bg-foreground/90">
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border bg-transparent text-foreground hover:bg-secondary"
            >
              View Documentation
            </Button>
          </div> */}

          {/* Social proof */}
          {/* <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Trusted by creators worldwide</p>
            <div className="flex items-center gap-8 opacity-60">
              {["Vercel", "Stripe", "Linear", "Notion"].map((company) => (
                <span key={company} className="text-sm font-medium text-muted-foreground">
                  {company}
                </span>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
