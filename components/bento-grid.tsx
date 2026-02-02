"use client"

import { useRef, useState } from "react"
import { Upload, Check, ArrowRight, Download, Twitter, Cpu, RotateCcw, Info } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMobile } from "@/components/ui/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { pixelateImageFromUrl } from "@/lib/pixelate"
// import { pixelateImageFromUrl } from "@/lib/pixelate-dithering"
import { useTranslations } from "next-intl"
import { debounce } from '@/lib/utils'

const palettes = [
  {
    name: "PICO_8", colors: [
      "#000000", "#1D2B53", "#7E2553", "#008751",
      "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8",
      "#FF004D", "#FFA300", "#FFEC27", "#00E436",
      "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"
    ]
  },
  {
    name: "LOST_CENTURY", colors: [
      "#d1b187", "#c77b58", "#ae5d40", "#79444a",
      "#4b3d44", "#ba9158", "#927441", "#4d4539",
      "#77743b", "#b3a555", "#d2c9a5", "#8caba1",
      "#4b726e", "#574852", "#847875", "#ab9b8e"
    ]
  },
  { name: "SUNSET_8", colors: ["#FFF474", "#F3B05A", "#F4874B", "#F06553", "#A3586D", "#5C4A72", "#3C3B5F", "#3C3B5F"] },
  { name: "TWILIGHT_5", colors: ["#fbbbad", "#ee8695", "#4a7a96", "#333f58", "#292831"] },
  { name: "Gameboy", colors: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"] },
  { name: "Retro NES", colors: ["#000000", "#fcfcfc", "#f83800", "#7c7c7c"] },
  { name: "Cyberpunk", colors: ["#0d0221", "#ff00ff", "#00ffff", "#ffff00"] },
  { name: "Monochrome", colors: ["#000000", "#555555", "#aaaaaa", "#ffffff"] },
  { name: "Sunset", colors: ["#1a1423", "#ff6b35", "#f7c59f", "#004e64"] },
  { name: "Ocean", colors: ["#03071e", "#0077b6", "#00b4d8", "#90e0ef"] },
  { name: "Forest", colors: ["#1b4332", "#2d6a4f", "#52b788", "#95d5b2"] },
  { name: "Candy", colors: ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1bd"] },

]

const pixelArtIdeas = [
  { id: 1, title: "Cyberpunk City", category: "Landscape" },
  { id: 2, title: "Pixel Samurai", category: "Character" },
  { id: 3, title: "Retro Spaceship", category: "Vehicle" },
  { id: 4, title: "Magic Potion", category: "Item" },
  { id: 5, title: "Dragon Boss", category: "Character" },
]

export function BentoGrid() {
  const t = useTranslations("BentoGrid")
  const isMobile = useIsMobile()
  const [selectedPalette, setSelectedPalette] = useState(-1)
  const [lastSelectedPalette, setLastSelectedPalette] = useState(0)
  const [paletteEnabled, setPaletteEnabled] = useState(false)
  // index into GRID_PRESETS
  const [resolutionIndex, setResolutionIndex] = useState(6) // default 64px
  const [pixelationEnabled, setPixelationEnabled] = useState(true) // ON = 有像素化, OFF = 原图分辨率
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
  // 新增：图像处理参数状态
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  })

  const GRID_PRESETS = [
    { value: 16, label: "16", tagline: t("taglines.retroSprite") },
    { value: 32, label: "32", tagline: t("taglines.eightBit") },
    { value: 48, label: "48", tagline: "" },
    { value: 64, label: "64", tagline: t("taglines.indieDetail") },
    { value: 80, label: "80", tagline: "" },
    { value: 96, label: "96", tagline: "" },
    { value: 128, label: "128", tagline: t("taglines.photoReal") },
    { value: 144, label: "144", tagline: "" },
    { value: 192, label: "192", tagline: t("taglines.highRes") },
    { value: 256, label: "256", tagline: t("taglines.ultraDetail") },
  ] as const

  const currentPreset = GRID_PRESETS[resolutionIndex]

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: t("toasts.unsupportedFile"),
        description: t("toasts.unsupportedFileDesc"),
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
    currentFilters = filters, // 传入当前滤镜
    pixelationEnabledOverride?: boolean // 切换开关时传入新值，避免闭包滞后
  ) => {
    try {
      const index =
        typeof presetIndex === "number"
          ? Math.max(0, Math.min(GRID_PRESETS.length - 1, presetIndex))
          : resolutionIndex
      const effective = typeof pixelationEnabledOverride === "boolean" ? pixelationEnabledOverride : pixelationEnabled
      const effectiveCellsX = effective ? GRID_PRESETS[index].value : 0
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
        targetCellsX: effectiveCellsX,
        scale,
        palette: activePalette,
        addOutline: shouldAddOutline,
        filters: currentFilters, // 传递滤镜参数
      })
      setPixelUrl(url)

      // toast({
      //   title: "Conversion complete",
      //   description: "Your image has been converted to pixel art.",
      // })
    } catch (error) {
      console.error(error)
      toast({
        title: t("toasts.conversionFailed"),
        description: t("toasts.conversionFailedDesc"),
        variant: "destructive",
      })
    }
  }
  // 1. 引入 useRef 来记录最新的转换请求 ID
  const processingId = useRef(0);

  // 2. 编写一个带有防抖功能的处理函数
  const debouncedConvert = useRef(
    debounce(async (params) => {
      const currentId = ++processingId.current;

      try {
        const url = await pixelateImageFromUrl(params.url, params.options);

        // 检查这是否仍然是最新的请求，防止竞态条件
        if (currentId === processingId.current) {
          // 只有在确认要替换新图时，才延迟撤销旧图
          // 不要立即执行 revoke，或者保留一个旧 URL 队列
          setPixelUrl(url);
        } else {
          URL.revokeObjectURL(url); // 如果不是最新的，直接销毁
        }
      } catch (e) {
        console.error(e);
      }
    }, 50) // 50ms 的防抖，平衡灵敏度与性能
  ).current;
  // 3. 滤镜变更处理函数
  const handleFilterChange = (key: keyof typeof filters, value: number[]) => {
    const newFilters = { ...filters, [key]: value[0] };
    setFilters(newFilters);

    if (originalUrl) {
      debouncedConvert({
        url: originalUrl,
        options: {
          targetCellsX: pixelationEnabled ? GRID_PRESETS[resolutionIndex].value : 0,
          scale: 1,
          palette: paletteEnabled && selectedPalette >= 0 ? palettes[selectedPalette].colors : [],
          addOutline: enhancements.addOutline,
          filters: newFilters,
        }
      });
    }
  };

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

  const handlePixelationChange = (checked: boolean) => {
    setPixelationEnabled(checked)
    if (originalUrl) {
      convertToPixelArt(originalUrl, undefined, undefined, undefined, filters, checked)
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
    if (!pixelationEnabled) return 1
    const targetCellsX = GRID_PRESETS[resolutionIndex].value
    const baseWidth = 512
    return Math.max(2, Math.floor(baseWidth / targetCellsX))
  }

  const handleDownload = async () => {
    if (!originalUrl) return;

    try {
      toast({ title: t("toasts.generating") });

      const scale = getScaleFromExport();
      // 注意：这里我们只传 scale 变量，pixelate.ts 内部会自动处理基础放大
      const exportUrl = await pixelateImageFromUrl(originalUrl, {
        targetCellsX: pixelationEnabled ? GRID_PRESETS[resolutionIndex].value : 0,
        scale,
        palette: paletteEnabled && selectedPalette >= 0 ? palettes[selectedPalette].colors : [],
        addOutline: enhancements.addOutline,
      });

      const link = document.createElement("a");
      link.href = exportUrl;
      link.download = `PixelArtForge-${Date.now()}.png`;
      link.click();

      // 提示：不需要立刻 revoke，让浏览器完成下载过程
      toast({ title: t("toasts.downloadStarted") });
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetFilters = () => {
    const defaultFilters = { brightness: 100, contrast: 100, saturation: 100 };
    setFilters(defaultFilters);
    if (originalUrl) {
      convertToPixelArt(originalUrl, undefined, undefined, undefined, defaultFilters)
    }
  };

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
                <h3 className="text-sm font-semibold text-foreground">{t("selectPalette")}</h3>
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
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {palettes.map((palette, index) => (
                  <div key={palette.name} className="flex flex-col items-center gap-1">
                    <button
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
                      className={`group/palette cursor-pointer relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${selectedPalette === index
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-background shadow-[0_0_12px_rgba(0,200,180,0.4)]"
                        : "hover:scale-110"
                        }`}
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
                    <span className="text-[10px] text-muted-foreground truncate max-w-full text-center" title={palette.name}>
                      {palette.name}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {t("active")}<span className="text-accent">{paletteEnabled && selectedPalette >= 0 ? palettes[selectedPalette]?.name : t("none")}</span>
              </p>
              <div className="mt-4 rounded-lg bg-accent/10 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-accent">{t("quickTip")}</span> {t("tipContent")}
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
              <span>{t("cpuBadge")}</span>
            </div>
            <div className="relative flex h-full flex-col">
              {/* Upload Area */}
              <div
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-4 transition-colors cursor-pointer ${isDragging
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
                  {t("uploadTitle")}
                </p>
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  {t("uploadSubtitle")}
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
                <Tabs defaultValue="pixel">
                  <TabsList className="flex w-fit items-center justify-start gap-0 rounded-lg border-0 bg-transparent p-0 h-auto text-xs text-muted-foreground">
                    <TabsTrigger value="pixel" className="flex-none rounded-md border border-transparent px-2 py-1 text-xs data-[state=active]:border-accent dark:data-[state=active]:border-accent data-[state=active]:text-accent">
                      {t("pixelArt")}
                    </TabsTrigger>
                    <TabsTrigger value="original" className="flex-none rounded-md border border-transparent px-2 py-1 text-xs data-[state=active]:border-accent dark:data-[state=active]:border-accent data-[state=active]:text-accent">
                      {t("originalImage")}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="pixel" forceMount className="mt-0 data-[state=inactive]:hidden">
                    <div
                      className={`mt-3 w-full rounded-lg bg-secondary/50 overflow-auto ${enhancements.gridOverlay ? "grid-overlay" : ""
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
                          className="w-full h-auto max-w-full"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      ) : (
                        <span className="text-xs text-accent">{t("pixelArt")}</span>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="original" forceMount className="mt-0 data-[state=inactive]:hidden">
                    <div className="mt-3 w-full rounded-lg bg-secondary/50 overflow-auto">
                      {originalUrl ? (
                        <img
                          src={originalUrl}
                          alt="Original"
                          className="w-full h-auto max-w-full"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">{t("originalImage")}</span>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Export Controls */}
              <div className={`mt-5 flex items-center gap-3 ${pixelUrl ? " block" : " hidden"}`}>
                <div className="flex flex-1 items-center gap-2">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 bg-accent text-background hover:bg-accent/90"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t("downloadBtn")}
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
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{t("resolution")}</h3>
                <div className="flex items-center gap-2 shrink-0">
                  <Label htmlFor="pixelation-switch" className="text-xs text-muted-foreground cursor-pointer whitespace-nowrap">
                    {t("pixelationEnabled")}
                  </Label>
                  <Switch
                    id="pixelation-switch"
                    checked={pixelationEnabled}
                    onCheckedChange={handlePixelationChange}
                    disabled={!originalUrl}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Slider
                  value={[resolutionIndex]}
                  onValueChange={handleResolutionChange}
                  min={0}
                  max={GRID_PRESETS.length - 1}
                  step={1}
                  className="w-full **:data-[slot=slider-track]:h-1 **:data-[slot=slider-thumb]:size-3"
                  disabled={!originalUrl}
                />
                <div className="mt-2 flex justify-between">
                  {GRID_PRESETS.map((preset, index) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={async () => {
                        setResolutionIndex(index)
                        if (originalUrl) await convertToPixelArt(originalUrl, index)
                      }}
                      disabled={!originalUrl}
                      className={`text-xs transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${index === resolutionIndex
                        ? "text-accent font-medium"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {t("output")}{" "}
                <span className="text-accent font-medium">
                  {pixelationEnabled
                    ? `${currentPreset.label}${currentPreset.tagline ? ` · ${currentPreset.tagline}` : ""}`
                    : t("outputOriginal")}
                </span>
              </p>
              <div className="mt-4 rounded-lg bg-accent/10 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                  <span className="font-medium text-accent">{t("quickTip")}</span> {t("resolutionTipContent")}
                </p>
              </div>
            </div>
          </div>

          {/* Enhancements Card - Middle Right */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-5 transition-all duration-300 hover:border-accent/50 md:col-span-1">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute -inset-px rounded-2xl bg-accent/5" />
            </div>
            <div className="relative">
              <h3 className="text-sm font-semibold text-foreground">{t("enhancements.title")}</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="add-outline" className="text-xs text-muted-foreground cursor-pointer">
                      {t("enhancements.addOutline")}
                    </Label>
                    {isMobile ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="shrink-0 rounded p-0.5 text-muted-foreground/70 hover:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={t("enhancements.addOutlineHint")}
                          >
                            <Info className="size-3.5" aria-hidden />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent side="top" className="max-w-50 w-auto p-3 text-sm">
                          {t("enhancements.addOutlineHint")}
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex shrink-0 cursor-default rounded p-0.5 text-muted-foreground/70" aria-hidden>
                            <Info className="size-3.5" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-50">
                          {t("enhancements.addOutlineHint")}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
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
                {/* <div className="flex items-center justify-between">
                  <Label htmlFor="grid-overlay" className="text-xs text-muted-foreground cursor-pointer">
                    {t("enhancements.gridOverlay")}
                  </Label>
                  <Switch
                    id="grid-overlay"
                    disabled={!originalUrl}
                    checked={enhancements.gridOverlay}
                    onCheckedChange={(checked) =>
                      setEnhancements((prev) => ({ ...prev, gridOverlay: checked }))
                    }
                  />
                </div> */}
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-5 transition-all duration-300 hover:border-accent/50 md:col-span-1">
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{t("imageAdjust.title")}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 -mr-2.5 flex items-center gap-1.5 text-muted-foreground hover:text-accent-foreground"
                  onClick={handleResetFilters}
                  title={t("imageAdjust.resetTitle")}
                  disabled={!originalUrl}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t("imageAdjust.reset")}
                </Button>
              </div>
              <div className="space-y-6">
                {/* Brightness */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>{t("imageAdjust.brightness")}</span>
                    <span className="text-accent">{filters.brightness}%</span>
                  </div>
                  <Slider
                    disabled={!originalUrl}
                    value={[filters.brightness]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={(v) => handleFilterChange('brightness', v)}
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>{t("imageAdjust.contrast")}</span>
                    <span className="text-accent">{filters.contrast}%</span>
                  </div>
                  <Slider
                    disabled={!originalUrl}
                    value={[filters.contrast]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={(v) => handleFilterChange('contrast', v)}
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>{t("imageAdjust.saturation")}</span>
                    <span className="text-accent">{filters.saturation}%</span>
                  </div>
                  <Slider
                    disabled={!originalUrl}
                    value={[filters.saturation]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={(v) => handleFilterChange('saturation', v)}
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
