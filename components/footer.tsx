import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

const footerLinks = {
  Product: [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "API", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Tutorials", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Community", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Press", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
}

export function Footer() {
  const t = useTranslations("Footer")
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-10">
        {/* ... */}
        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}
