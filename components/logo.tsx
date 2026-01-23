interface LogoProps {
  className?: string
  showText?: boolean
  size?: number
}

export function Logo({ className = "", showText = true, size = 32 }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/icon.png"
        alt="PixelArtForge Logo"
        width={size}
        height={size}
        className="object-contain"
      />
      
      {showText && (
        <svg
          width="120"
          height={size}
          viewBox="0 0 120 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* "PixelArtForge" text */}
          <text
            x="0"
            y="21"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="16"
            fontWeight="700"
            fill="#64748b"
          >
            PixelArt
            <tspan fill="#00bca2">Forge</tspan>
          </text>
          
          {/* "AI" badge */}
          {/* <rect x="85" y="8" width="24" height="16" rx="4" fill="#3b82f6" />
          <text
            x="97"
            y="20"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="10"
            fontWeight="700"
            fill="white"
            textAnchor="middle"
          >
            AI
          </text> */}
        </svg>
      )}
    </div>
  )
}

// Icon-only version for favicons, small spaces
export function LogoIcon({ className = "", size = 32 }: Omit<LogoProps, "showText">) {
  return (
    <img
      src="/icon.png"
      alt="PixelArtForge"
      width={size}
      height={size}
      className={className}
    />
  )
}
