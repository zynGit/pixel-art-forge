"use client"

import { Image, Gamepad2, Paintbrush } from "lucide-react"
import { useTranslations } from "next-intl"

const columnKeys = [
  { key: "imageToPixelArt", icon: Image },
  { key: "gameDevTool", icon: Gamepad2 },
  { key: "pixelArtMaker", icon: Paintbrush },
] as const

export function SEOContent() {
  const t = useTranslations("SEOContent")

  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {columnKeys.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="group relative rounded-2xl border border-border bg-card/50 p-8 transition-all duration-300 hover:border-accent/50 hover:bg-card/80"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -inset-px rounded-2xl bg-accent/5" />
              </div>
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {t(`columns.${key}.title`)}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {t(`columns.${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
