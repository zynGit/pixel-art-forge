export type PixelateOptions = {
  // target horizontal cells count, e.g. 16 / 32 / 64 / 128
  targetCellsX: number
  // export scale multiplier (1x, 2x, 4x, ...)
  scale: number
  // optional palette of hex colors (e.g. ["#ff00ff", "#00ffff"])
  palette?: string[]
  // add black outline to transparent pixels adjacent to opaque pixels
  addOutline?: boolean
  // 新增：滤镜选项
  filters?: {
    brightness: number // 0-200, 100 is normal
    contrast: number   // 0-200, 100 is normal
    saturation: number // 0-200, 100 is normal
  }
}

type RGB = { r: number; g: number; b: number }

function hexToRgb(hex: string): RGB | null {
  const normalized = hex.replace("#", "")
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16)
    const g = parseInt(normalized[1] + normalized[1], 16)
    const b = parseInt(normalized[2] + normalized[2], 16)
    return { r, g, b }
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16)
    const g = parseInt(normalized.slice(2, 4), 16)
    const b = parseInt(normalized.slice(4, 6), 16)
    return { r, g, b }
  }
  return null
}

// Find nearest color in palette using Euclidean distance in RGB space
function getNearestColor(color: RGB, palette: RGB[]): RGB {
  let best = palette[0]
  let bestDist = Number.POSITIVE_INFINITY

  for (let i = 0; i < palette.length; i++) {
    const p = palette[i]
    const dr = color.r - p.r
    const dg = color.g - p.g
    const db = color.b - p.b
    const dist = dr * dr + dg * dg + db * db // squared distance, no need sqrt
    if (dist < bestDist) {
      bestDist = dist
      best = p
    }
  }

  return best
}

function applyPaletteToImageData(data: Uint8ClampedArray, palette: RGB[]) {
  if (!palette.length) return

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]

    // Skip fully transparent pixels
    if (a === 0) continue

    const nearest = getNearestColor({ r, g, b }, palette)
    data[i] = nearest.r
    data[i + 1] = nearest.g
    data[i + 2] = nearest.b
  }
}

// Add black outline to transparent pixels that are adjacent to opaque pixels
// Checks 4-neighborhood (up, down, left, right)
function addBlackOutline(data: Uint8ClampedArray, width: number, height: number) {
  // Create a copy to avoid modifying while iterating
  const result = new Uint8ClampedArray(data)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const alpha = data[idx + 3]

      // Only process transparent pixels
      if (alpha !== 0) continue

      // Check 4-neighborhood: up, down, left, right
      const neighbors = [
        { x: x, y: y - 1 }, // up
        { x: x, y: y + 1 }, // down
        { x: x - 1, y: y }, // left
        { x: x + 1, y: y }, // right
      ]

      let hasOpaqueNeighbor = false
      for (const neighbor of neighbors) {
        // Check bounds
        if (neighbor.x < 0 || neighbor.x >= width || neighbor.y < 0 || neighbor.y >= height) {
          continue
        }

        const neighborIdx = (neighbor.y * width + neighbor.x) * 4
        const neighborAlpha = data[neighborIdx + 3]

        // If any neighbor is opaque, mark this pixel for outline
        if (neighborAlpha > 0) {
          hasOpaqueNeighbor = true
          break
        }
      }

      // If adjacent to opaque pixel, set to black
      if (hasOpaqueNeighbor) {
        result[idx] = 0 // R
        result[idx + 1] = 0 // G
        result[idx + 2] = 0 // B
        result[idx + 3] = 255 // A
      }
    }
  }

  // Copy result back to original array
  data.set(result)
}

// Client-side pixelation using Canvas. Returns an object URL of a PNG image.
// Uses scheme A: slider controls logical grid cells, pixel size is derived from image width.
export async function pixelateImageFromUrl(src: string, options: PixelateOptions): Promise<string> {
  const { targetCellsX, scale, palette, addOutline, filters } = options

  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Pixelation can only run in the browser"))
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      try {
        // --- 步骤 1: 滤镜预处理 ---
        // 我们创建一个临时 Canvas 来应用 CSS 滤镜，这比手动操作 ImageData 像素快得多
        const filterCanvas = document.createElement("canvas")
        const filterCtx = filterCanvas.getContext("2d")
        if (!filterCtx) {
          reject(new Error("Canvas not supported"))
          return
        }

        filterCanvas.width = img.width
        filterCanvas.height = img.height

        if (filters) {
          // 应用滤镜字符串，例如: "brightness(120%) contrast(110%) saturate(130%)"
          filterCtx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`
        }
        
        filterCtx.drawImage(img, 0, 0)

        // --- 步骤 2: 像素化逻辑 (使用处理后的 filterCanvas 代替原图 img) ---
        const baseCanvas = document.createElement("canvas")
        const baseCtx = baseCanvas.getContext("2d")
        if (!baseCtx) {
          reject(new Error("Canvas not supported"))
          return
        }

        const isOriginalResolution = targetCellsX <= 0
        let smallWidth: number
        let smallHeight: number
        let pixel: number

        if (isOriginalResolution) {
          smallWidth = img.width
          smallHeight = img.height
          pixel = 1
        } else {
          const clampedCellsX = Math.max(4, Math.min(256, Math.floor(targetCellsX || 64)))
          const rawPixelSize = Math.floor(img.width / clampedCellsX)
          pixel = Math.max(2, Math.min(64, rawPixelSize || 8))
          smallWidth = Math.max(1, Math.round(img.width / pixel))
          smallHeight = Math.max(1, Math.round(img.height / pixel))
        }

        baseCanvas.width = smallWidth
        baseCanvas.height = smallHeight

        baseCtx.imageSmoothingEnabled = false
        baseCtx.clearRect(0, 0, smallWidth, smallHeight)
        baseCtx.drawImage(filterCanvas, 0, 0, smallWidth, smallHeight)

        // --- 步骤 3: 调色盘与轮廓 (逻辑保持不变) ---
        let imageData: ImageData | null = null
        if (palette && palette.length > 0) {
          const paletteRgb: RGB[] = []
          for (const hex of palette) {
            const rgb = hexToRgb(hex)
            if (rgb) paletteRgb.push(rgb)
          }
          if (paletteRgb.length) {
            imageData = baseCtx.getImageData(0, 0, smallWidth, smallHeight)
            applyPaletteToImageData(imageData.data, paletteRgb)
            baseCtx.putImageData(imageData, 0, 0)
          }
        }

        if (addOutline) {
          if (!imageData) {
            imageData = baseCtx.getImageData(0, 0, smallWidth, smallHeight)
          }
          addBlackOutline(imageData.data, smallWidth, smallHeight)
          baseCtx.putImageData(imageData, 0, 0)
        }

        // --- 步骤 4: 最终缩放导出 ---
        const outCanvas = document.createElement("canvas")
        const outCtx = outCanvas.getContext("2d")
        if (!outCtx) {
          reject(new Error("Canvas not supported"))
          return
        }

        const scaleFactor = Math.max(1, Math.floor(scale))
        const outWidth = smallWidth * pixel * scaleFactor
        const outHeight = smallHeight * pixel * scaleFactor
        outCanvas.width = outWidth
        outCanvas.height = outHeight

        outCtx.imageSmoothingEnabled = false
        outCtx.clearRect(0, 0, outWidth, outHeight)
        outCtx.drawImage(baseCanvas, 0, 0, outWidth, outHeight)

        outCanvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to export pixelated image"))
              return
            }
            const url = URL.createObjectURL(blob)
            resolve(url)
          },
          "image/png",
          1,
        )
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Unknown pixelation error"))
      }
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = src
  })
}

