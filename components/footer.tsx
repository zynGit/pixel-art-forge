import Link from "next/link"
import { Sparkles } from "lucide-react"

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
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-10">
        {/* <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Sparkles className="h-5 w-5 text-background" />
              </div>
              <span className="text-lg font-semibold text-foreground">PixelArtForge AI</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              AI-powered creative tools for the next generation of visual content.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-accent hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div> */}

        {/* Bottom */}
        {/* <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row"> */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 PixelArtForge. Built for the Pixel Art Community.
          </p>
          {/* <div className="flex items-center gap-6">
            <Link 
              href="#" 
              className="text-sm text-muted-foreground transition-colors hover:text-accent hover:underline underline-offset-4"
            >
              Twitter
            </Link>
            <Link 
              href="#" 
              className="text-sm text-muted-foreground transition-colors hover:text-accent hover:underline underline-offset-4"
            >
              GitHub
            </Link>
            <Link 
              href="#" 
              className="text-sm text-muted-foreground transition-colors hover:text-accent hover:underline underline-offset-4"
            >
              Discord
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
