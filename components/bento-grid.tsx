"use client"

import { useRef, useState } from "react"
import { Upload, Check, ArrowRight, Download, Twitter, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { pixelateImageFromUrl } from "@/lib/pixelate"

const palettes = [
  {name: "PICO_8", colors: [
    "#000000", "#1D2B53", "#7E2553", "#008751", 
    "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8", 
    "#FF004D", "#FFA300", "#FFEC27", "#00E436", 
    "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"
  ]},
  { name: "Gameboy", colors: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"] },
  {name: "LOST_CENTURY", colors: [
    "#1a1c2c", "#5d275d", "#b13e53", "#ef7d57", 
    "#ffcd75", "#a7f070", "#38b764", "#257179", 
    "#29366f", "#3b5dc9", "#41a6f6", "#73eff7", 
    "#f4f4f4", "#94b0c2", "#566c86", "#333c57"
  ]},
  {name: "TWILIGHT_5", colors: ["#140c1c", "#442434", "#30346d", "#597dce", "#d27d2c"]},
  { name: "Retro NES", colors: ["#000000", "#fcfcfc", "#f83800", "#7c7c7c"] },
  { name: "Cyberpunk", colors: ["#0d0221", "#ff00ff", "#00ffff", "#ffff00"] },
  { name: "Monochrome", colors: ["#000000", "#555555", "#aaaaaa", "#ffffff"] },
  { name: "Sunset", colors: ["#1a1423", "#ff6b35", "#f7c59f", "#004e64"] },
  { name: "Ocean", colors: ["#03071e", "#0077b6", "#00b4d8", "#90e0ef"] },
  { name: "Forest", colors: ["#1b4332", "#2d6a4f", "#52b788", "#95d5b2"] },
  { name: "Candy", colors: ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1bd"] },
  
  {
    name: "SUNSET_8", colors: ["#000000", "#1D2B53", "#7E2553", "#AB5236", "#FF004D", "#FFA300", "#FFEC27", "#FFF1E8"]},
  
]

const GRID_PRESETS = [
  { value: 16, label: "16", tagline: "Retro Sprite" },
  { value: 32, label: "32", tagline: "8-bit Classic" },
  { value: 48, label: "48", tagline: "" },
  { value: 64, label: "64", tagline: "Indie Detail" },
  { value: 80, label: "80", tagline: "" },
  { value: 96, label: "96", tagline: "" },
  { value: 128, label: "128", tagline: "Photo Real" },
  { value: 144, label: "144", tagline: "Photo Real" },
] as const

const pixelArtIdeas = [
  { id: 1, title: "Cyberpunk City", category: "Landscape" },
  { id: 2, title: "Pixel Samurai", category: "Character" },
  { id: 3, title: "Retro Spaceship", category: "Vehicle" },
  { id: 4, title: "Magic Potion", category: "Item" },
  { id: 5, title: "Dragon Boss", category: "Character" },
]

export function BentoGrid() {
  const [selectedPalette, setSelectedPalette] = useState(-1)
  const [lastSelectedPalette, setLastSelectedPalette] = useState(0)
  const [paletteEnabled, setPaletteEnabled] = useState(false)
  // index into GRID_PRESETS
  const [resolutionIndex, setResolutionIndex] = useState(6) // default 64px
  const [exportScale, setExportScale] = useState("1x")
  const [enhancements, setEnhancements] = useState({
    removeBackground: false,
    addOutline: false,
    gridOverlay: false,
  })
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [pixelUrl, setPixelUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()
  const currentPreset = GRID_PRESETS[resolutionIndex]

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Unsupported file",
        description: "Please upload an image file (PNG, JPG, WEBP).",
        variant: "destructive",
      })
      return
    }

    // Revoke old URLs to avoid memory leaks
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl)
    }
    if (pixelUrl) {
      URL.revokeObjectURL(pixelUrl)
    }

    const url = URL.createObjectURL(file)
    setOriginalUrl(url)
    setPixelUrl(null)

    await convertToPixelArt(url)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const convertToPixelArt = async (
    sourceUrl: string,
    presetIndex?: number,
    paletteIndex?: number,
    addOutlineOverride?: boolean,
  ) => {
    try {
      const index =
        typeof presetIndex === "number"
          ? Math.max(0, Math.min(GRID_PRESETS.length - 1, presetIndex))
          : resolutionIndex
      const targetCellsX = GRID_PRESETS[index].value
      // Preview always uses scale 1, export scale is only applied when downloading
      const scale = 1

      const paletteIdx =
        typeof paletteIndex === "number"
          ? paletteIndex
          : selectedPalette
      // If paletteIndex is explicitly provided, use it regardless of paletteEnabled state
      // Otherwise, check paletteEnabled state
      const activePalette =
        (typeof paletteIndex === "number" || paletteEnabled) && paletteIdx >= 0 && paletteIdx < palettes.length
          ? palettes[paletteIdx].colors
          : []

      const shouldAddOutline =
        typeof addOutlineOverride === "boolean"
          ? addOutlineOverride
          : enhancements.addOutline

      // Revoke previous pixel art URL if any
      if (pixelUrl) {
        URL.revokeObjectURL(pixelUrl)
      }

      const url = await pixelateImageFromUrl(sourceUrl, {
        targetCellsX,
        scale,
        palette: activePalette,
        addOutline: shouldAddOutline,
      })
      setPixelUrl(url)

      // toast({
      //   title: "Conversion complete",
      //   description: "Your image has been converted to pixel art.",
      // })
    } catch (error) {
      console.error(error)
      toast({
        title: "Conversion failed",
        description: "We couldn't convert your image. Please try another image.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleResolutionChange = async (values: number[]) => {
    const index = values[0]
    setResolutionIndex(index)

    if (originalUrl) {
      await convertToPixelArt(originalUrl, index)
    }
  }

  const getScaleFromExport = () => {
    const parsed = parseInt(exportScale.replace("x", ""), 10)
    return Number.isNaN(parsed) ? 1 : Math.max(1, parsed)
  }

  // Calculate pixel size for grid overlay
  // This is an approximation based on targetCellsX and scale
  // Assumes a typical image width of 512px for calculation
  const getPixelSizeForGrid = () => {
    const targetCellsX = GRID_PRESETS[resolutionIndex].value
    // const scale = getScaleFromExport()
    // Estimate pixel size: assume base image width of 512px
    const baseWidth = 512
    const pixelSize = Math.max(2, Math.floor(baseWidth / targetCellsX))
    // return pixelSize * scale
    return pixelSize
  }

  const handleDownload = async () => {
    if (!originalUrl) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image before downloading.",
        variant: "destructive",
      })
      return
    }

    try {
      // Show loading toast
      toast({
        title: "Generating high-quality export",
        description: `Creating ${exportScale} scale version...`,
      })

      // Get current settings
      const targetCellsX = GRID_PRESETS[resolutionIndex].value
      const scale = getScaleFromExport()
      const activePalette =
        paletteEnabled && selectedPalette >= 0 && selectedPalette < palettes.length
          ? palettes[selectedPalette].colors
          : []

      // Generate high-quality pixelated image with export scale
      const exportUrl = await pixelateImageFromUrl(originalUrl, {
        targetCellsX,
        scale,
        palette: activePalette,
        addOutline: enhancements.addOutline,
      })

      // Generate filename: PixelArtForge-{paletteName}-{timestamp}.png
      const paletteName =
        selectedPalette >= 0 && selectedPalette < palettes.length
          ? palettes[selectedPalette].name.toLowerCase().replace(/\s+/g, "-")
          : "default"
      const timestamp = Date.now()
      const filename = `PixelArtForge-${paletteName}-${timestamp}.png`

      // Create download link
      const link = document.createElement("a")
      link.href = exportUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Revoke the export URL after download
      setTimeout(() => {
        URL.revokeObjectURL(exportUrl)
      }, 100)

      toast({
        title: "Download started",
        description: `Your ${exportScale} scale pixel art has been exported. Check your downloads folder.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Download failed",
        description: "Something went wrong while generating the export. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = () => {
    toast({
      title: "Share to X/Twitter",
      description: "Opening share dialog...",
    })
  }

  return (
    <section id="features" className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Transform any image into pixel art
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Powerful tools designed for creating stunning pixel art in seconds
          </p>
        </div> */}

        {/* Bento Grid */}
        <div className="mt-1 grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-[auto_auto_auto]">
          
          {/* Color Palette Card - Top Left */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-5 transition-all duration-300 hover:border-accent/50 md:col-span-1">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -inset-px rounded-2xl bg-accent/5" />
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Select Palette</h3>
                <Switch
                  checked={paletteEnabled}
                  disabled={!originalUrl}
                  onCheckedChange={async (checked) => {
                    setPaletteEnabled(checked)
                    if (checked) {
                      const targetIndex =
                        lastSelectedPalette >= 0 && lastSelectedPalette < palettes.length
                          ? lastSelectedPalette
                          : 0
                      setSelectedPalette(targetIndex)
                      if (originalUrl) {
                        await convertToPixelArt(originalUrl, undefined, targetIndex)
                      }
                    } else {
                      if (selectedPalette >= 0 && selectedPalette < palettes.length) {
                        setLastSelectedPalette(selectedPalette)
                      }
                      setSelectedPalette(-1)
                      if (originalUrl) {
                        // Pass -1 to explicitly disable palette, avoiding async state issue
                        await convertToPixelArt(originalUrl, undefined, -1)
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {palettes.map((palette, index) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={async () => {
                      if (!paletteEnabled) {
                        setPaletteEnabled(true)
                      }
                      setLastSelectedPalette(index)
                      setSelectedPalette(index)
                      if (originalUrl) {
                        await convertToPixelArt(originalUrl, undefined, index)
                      }
                    }}
                    className={`group/palette relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                      selectedPalette === index
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-background shadow-[0_0_12px_rgba(0,200,180,0.4)]"
                        : "hover:scale-110"
                    }`}
                    title={palette.name}
                  >
                    <div className="flex h-full w-full overflow-hidden rounded-full">
                      {palette.colors.map((color, i) => (
                        <div
                          key={`${palette.name}-${i}`}
                          className="h-full flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    {selectedPalette === index && (
                      <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent">
                        <Check className="h-2.5 w-2.5 text-background" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Active: <span className="text-accent">{paletteEnabled && selectedPalette >= 0 ? palettes[selectedPalette]?.name : "None"}</span>
              </p>
              <div className="mt-4 rounded-lg bg-accent/10 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-accent">Quick Tip:</span> Hover over any palette to see its name, and click to apply. You can use the toggle switch to instantly compare your original photo colors with the new pixel art generator results.
                </p>
              </div>
            </div>
          </div>

          {/* Center Canvas Area - Main */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 transition-all duration-300 hover:border-accent/50 md:col-span-2 md:row-span-2">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -inset-px rounded-2xl bg-accent/5" />
            </div>
            {/* Powered by AI Badge */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-secondary/80 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <Cpu className="h-3 w-3 text-accent" />
              <span>Fast. Local. Precise.</span>
            </div>
            <div className="relative flex h-full flex-col">
              {/* Upload Area */}
              <div
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-4 transition-colors cursor-pointer ${
                  isDragging
                    ? "border-accent bg-accent/10"
                    : "border-border bg-secondary/30 hover:border-accent/50 hover:bg-secondary/50"
                }`}
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <Upload className="h-8 w-8 text-accent" />
                </div>
                <p className="mt-4 text-center text-sm font-medium text-foreground">
                  Drag & drop or Click to upload
                </p>
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  PNG, JPG, WEBP images
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Pixel Art Preview */}
              <div className={`mt-5 rounded-xl border border-border bg-secondary/30 p-4 ${pixelUrl ? " block" : " hidden"}`}>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="text-accent">Pixel Art</span>
                </div>
                <div
                  className={`mt-3 w-full rounded-lg bg-secondary/50 overflow-auto ${
                    enhancements.gridOverlay ? "grid-overlay" : ""
                  }`}
                  style={
                    enhancements.gridOverlay
                      ? {
                          "--pixel-size": getPixelSizeForGrid(),
                        } as React.CSSProperties
                      : undefined
                  }
                >
                  {pixelUrl ? (
                    <img
                      src={pixelUrl}
                      alt="Pixel art"
                      className="block"
                    />
                  ) : (
                    <span className="text-xs text-accent">Pixel Art</span>
                  )}
                </div>
              </div>

              {/* Export Controls */}
              <div className={`mt-5 flex items-center gap-3 ${pixelUrl ? " block" : " hidden"}`}>
                <div className="flex flex-1 items-center gap-2">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 bg-accent text-background hover:bg-accent/90"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG (HD)
                  </Button>
                  <Select value={exportScale} onValueChange={setExportScale}>
                    <SelectTrigger className="w-20 border-border bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1x">1x</SelectItem>
                      <SelectItem value="2x">2x</SelectItem>
                      <SelectItem value="4x">4x</SelectItem>
                      <SelectItem value="8x">8x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="border-border bg-transparent hover:bg-accent/10 hover:text-accent hover:border-accent/50"
                  title="Share to X/Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Button> */}
              </div>
            </div>
          </div>

          {/* Resolution Card - Top Right */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-5 transition-all duration-300 hover:border-accent/50 md:col-span-1">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -inset-px rounded-2xl bg-accent/5" />
            </div>
            <div className="relative">
              <h3 className="text-sm font-semibold text-foreground">Resolution</h3>
              <div className="mt-6">
                <Slider
                  value={[resolutionIndex]}
                  onValueChange={handleResolutionChange}
                  min={0}
                  max={GRID_PRESETS.length - 1}
                  step={1}
                  className="w-full"
                  disabled={!originalUrl}
                />
                <div className="mt-3 flex justify-between">
                  {GRID_PRESETS.map((preset, index) => (
                    <span
                      key={preset.value}
                      className={`text-xs transition-colors ${
                        index === resolutionIndex
                          ? "text-accent font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {preset.label}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Output:{" "}
                <span className="text-accent font-medium">
                  {currentPreset.label}
                  {currentPreset.tagline ? ` · ${currentPreset.tagline}` : ""}
                </span>
              </p>
            </div>
          </div>

          {/* Enhancements Card - Middle Right */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-5 transition-all duration-300 hover:border-accent/50 md:col-span-1">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -inset-px rounded-2xl bg-accent/5" />
            </div>
            <div className="relative">
              <h3 className="text-sm font-semibold text-foreground">Enhancements</h3>
              <div className="mt-4 space-y-4">
                {/* <div className="flex items-center justify-between">
                  <Label htmlFor="remove-bg" className="text-xs text-muted-foreground cursor-pointer">
                    Remove Background
                  </Label>
                  <Switch
                    id="remove-bg"
                    checked={enhancements.removeBackground}
                    onCheckedChange={(checked) =>
                      setEnhancements((prev) => ({ ...prev, removeBackground: checked }))
                    }
                  />
                </div> */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="add-outline" className="text-xs text-muted-foreground cursor-pointer">
                    Add Black Outline
                  </Label>
                  <Switch
                    id="add-outline"
                    disabled={!originalUrl}
                    checked={enhancements.addOutline}
                    onCheckedChange={async (checked) => {
                      setEnhancements((prev) => ({ ...prev, addOutline: checked }))
                      if (originalUrl) {
                        await convertToPixelArt(originalUrl, undefined, undefined, checked)
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="grid-overlay" className="text-xs text-muted-foreground cursor-pointer">
                    Grid Overlay
                  </Label>
                  <Switch
                    id="grid-overlay"
                    disabled={!originalUrl}
                    checked={enhancements.gridOverlay}
                    onCheckedChange={(checked) =>
                      setEnhancements((prev) => ({ ...prev, gridOverlay: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/*Pixel Art Ideas - Bottom Wide */}
          {/* <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-5 transition-all duration-300 hover:border-accent/50 md:col-span-4">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -inset-px rounded-2xl bg-accent/5" />
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground"> Pixel Art Ideas</h3>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-accent">
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
              
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {pixelArtIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex-shrink-0 w-44 rounded-xl border border-border bg-secondary/30 p-3 transition-all hover:border-accent/50 hover:bg-secondary/50"
                  >
                    <div className="aspect-square w-full rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden">
                      <div className="grid grid-cols-4 grid-rows-4 gap-0.5 p-4 w-full h-full">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={`pixel-${idea.id}-${i}`}
                            className="rounded-sm"
                            style={{
                              backgroundColor: palettes[idea.id % palettes.length].colors[i % 4],
                              opacity: Math.random() > 0.3 ? 1 : 0.5,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-foreground truncate">{idea.title}</p>
                      <p className="text-xs text-muted-foreground">{idea.category}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full text-xs h-7 hover:bg-accent/10 hover:text-accent hover:border-accent/50 bg-transparent"
                    >
                      Try this
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
