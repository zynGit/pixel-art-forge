export type PixelateOptions = {
  targetCellsX: number
  scale: number
  palette?: string[]
  addOutline?: boolean
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

// 使用人眼感知的加权公式计算颜色距离
function getNearestColor(color: RGB, palette: RGB[]): RGB {
  let best = palette[0]
  let bestDist = Number.POSITIVE_INFINITY

  for (const p of palette) {
    // 权重：绿色 > 红色 > 蓝色
    const dr = (color.r - p.r) * 0.299
    const dg = (color.g - p.g) * 0.587
    const db = (color.b - p.b) * 0.114
    const dist = dr * dr + dg * dg + db * db
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
    if (data[i + 3] < 128) continue // 忽略半透明像素
    const nearest = getNearestColor({ r: data[i], g: data[i + 1], b: data[i + 2] }, palette)
    data[i] = nearest.r
    data[i + 1] = nearest.g
    data[i + 2] = nearest.b
    data[i + 3] = 255 // 强制非透明区域全不透明
  }
}

/**
 * 应用调色板并进行抖动处理（Floyd-Steinberg Dithering）
 */
// export function applyPaletteToImageData(
//   data: Uint8ClampedArray,
//   width: number,
//   height: number,
//   paletteRgb: RGB[]
// ) {
//   if (!paletteRgb.length) return;

//   // 使用 Float32Array 存储中间数据，防止误差在扩散过程中因取整而丢失
//   const pixels = new Float32Array(data);

//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const i = (y * width + x) * 4;

//       // 忽略全透明像素
//       if (pixels[i + 3] < 128) continue;

//       const oldR = pixels[i];
//       const oldG = pixels[i + 1];
//       const oldB = pixels[i + 2];

//       // 1. 获取匹配色
//       const newColor = getNearestColor({ r: oldR, g: oldG, b: oldB }, paletteRgb);

//       // 2. 将最终颜色存回原数组
//       data[i] = newColor.r;
//       data[i + 1] = newColor.g;
//       data[i + 2] = newColor.b;
//       data[i + 3] = 255; // 确保非透明区域完全不透明

//       // 3. 计算颜色误差 (Error)
//       const errR = oldR - newColor.r;
//       const errG = oldG - newColor.g;
//       const errB = oldB - newColor.b;

//       // 4. 将误差扩散到周围相邻的 4 个像素 (Floyd-Steinberg 矩阵)
//       // 扩散因子: 右边 (7/16), 左下 (3/16), 正下 (5/16), 右下 (1/16)
//       distributeError(pixels, x + 1, y, width, height, errR, errG, errB, 7 / 16);
//       distributeError(pixels, x - 1, y + 1, width, height, errR, errG, errB, 3 / 16);
//       distributeError(pixels, x, y + 1, width, height, errR, errG, errB, 5 / 16);
//       distributeError(pixels, x + 1, y + 1, width, height, errR, errG, errB, 1 / 16);
//     }
//   }
// }

/**
 * 辅助函数：将计算出的误差按权重叠加到指定坐标的像素上
 */
// function distributeError(
//   pixels: Float32Array,
//   x: number,
//   y: number,
//   width: number,
//   height: number,
//   errR: number,
//   errG: number,
//   errB: number,
//   weight: number
// ) {
//   if (x >= 0 && x < width && y >= 0 && y < height) {
//     const i = (y * width + x) * 4;
//     pixels[i] += errR * weight;
//     pixels[i + 1] += errG * weight;
//     pixels[i + 2] += errB * weight;
//   }
// }

function addBlackOutline(data: Uint8ClampedArray, width: number, height: number) {
  const result = new Uint8ClampedArray(data)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      if (data[idx + 3] > 0) continue // 只处理全透明像素

      const neighbors = [
        { x, y: y - 1 }, { x, y: y + 1 }, { x: x - 1, y }, { x: x + 1, y }
      ]

      for (const n of neighbors) {
        if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
          const nIdx = (n.y * width + n.x) * 4
          if (data[nIdx + 3] > 0) { // 如果邻居是不透明的
            result[idx] = 0; result[idx + 1] = 0; result[idx + 2] = 0; result[idx + 3] = 255
            break
          }
        }
      }
    }
  }
  data.set(result)
}

export async function pixelateImageFromUrl(src: string, options: PixelateOptions): Promise<string> {
  const { targetCellsX, scale, palette, addOutline } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      try {
        // 1. 核心改进：直接锁定宽度，按比例计算高度
        const smallWidth = Math.max(8, targetCellsX)
        const smallHeight = Math.round(smallWidth * (img.height / img.width))

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) return reject("No context")

        canvas.width = smallWidth
        canvas.height = smallHeight
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(img, 0, 0, smallWidth, smallHeight)

        const imageData = ctx.getImageData(0, 0, smallWidth, smallHeight)
        
        // 2. 应用色板 (这里传入了小图的宽高以支持抖动逻辑)
        if (palette?.length) {
          const paletteRgb = palette.map(hexToRgb).filter((r): r is RGB => !!r)
          // 抖动算法的调用参数
          // applyPaletteToImageData(imageData.data, smallWidth, smallHeight, paletteRgb)
          applyPaletteToImageData(imageData.data, paletteRgb)
        }

        // 3. 应用描边
        if (addOutline) {
          addBlackOutline(imageData.data, smallWidth, smallHeight)
        }

        ctx.putImageData(imageData, 0, 0)

        // 4. 导出放大图
        const exportCanvas = document.createElement("canvas")
        const exportCtx = exportCanvas.getContext("2d")
        if (!exportCtx) return reject("No export context")

        // 导出尺寸 = 小图尺寸 * 用户选的倍率 (1x/2x/4x) * 一个基础缩放值(确保下载不模糊)
        const baseMultiplier = Math.floor(img.width / smallWidth) || 1
        const finalScale = scale * baseMultiplier
        
        exportCanvas.width = smallWidth * finalScale
        exportCanvas.height = smallHeight * finalScale
        exportCtx.imageSmoothingEnabled = false
        exportCtx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height)

        exportCanvas.toBlob((blob) => {
          if (blob) resolve(URL.createObjectURL(blob))
        }, "image/png")
      } catch (e) { reject(e) }
    }
    img.src = src
  })
}