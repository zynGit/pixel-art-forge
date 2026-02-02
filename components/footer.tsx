"use client"

import Link from "next/link"
import { Sparkles, Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"

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
  const [showEmail, setShowEmail] = useState(false)

  /* Removed auto-dismiss timer to allow user to read until mouse leave */

  const handleMailInteraction = () => {
    setShowEmail(true)
  }

  const handleMailLeave = () => {
    setShowEmail(false)
  }

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {t("copyright")}
          </p>
          <Mail
            className="h-5 w-5 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleMailInteraction}
            onMouseEnter={handleMailInteraction}
            onMouseLeave={handleMailLeave}
          />
        </div>
      </div>

      {/* Custom Bottom-Left Notification */}
      <div
        className={`fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-xl border border-primary/20 bg-background/95 px-5 py-4 shadow-xl backdrop-blur-md transition-all duration-300 ease-out ${showEmail
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/5">
          <Mail className="h-4 w-4" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground">Contact Support</p>
          <p className="text-xs text-muted-foreground">mailto: support@pixel-art.online</p>
        </div>
      </div>
    </footer>
  )
}
