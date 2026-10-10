import { computeLogoLayout, darkRuns, logoAspect, resolveStyle } from "./layout";
import type { QrMatrix, QrRenderOptions } from "./types";

export interface QrCanvasOptions extends QrRenderOptions {
  /** Canvas width/height in px. */
  sizePx: number;
}

/** Logo normalized for embedding: PNG data URL with known natural size. */
export interface PreparedLogo {
  dataUrl: string;
  width: number;
  height: number;
}

export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image could not be loaded"));
    img.src = src;
  });

/**
 * Decodes the uploaded logo and downscales it (long side <= `maxSide`) to a PNG
 * data URL, so SVG/PDF exports never embed a multi-megabyte original.
 * Animated GIFs keep only their first frame.
 */
export const prepareLogo = async (dataUrl: string, maxSide = 512): Promise<PreparedLogo> => {
  const img = await loadImage(dataUrl);
  const naturalWidth = img.naturalWidth || maxSide;
  const naturalHeight = img.naturalHeight || maxSide;
  const scale = Math.min(1, maxSide / Math.max(naturalWidth, naturalHeight));
  const width = Math.max(1, Math.round(naturalWidth * scale));
  const height = Math.max(1, Math.round(naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);
  return { dataUrl: canvas.toDataURL("image/png"), width, height };
};

const roundedRectPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  radius: number
): void => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + size, y, x + size, y + size, radius);
  ctx.arcTo(x + size, y + size, x, y + size, radius);
  ctx.arcTo(x, y + size, x, y, radius);
  ctx.arcTo(x, y, x + size, y, radius);
  ctx.closePath();
};

/**
 * Draws the symbol on a canvas of exactly `sizePx` px. Module edges are snapped
 * to whole pixels (integer scaling when `sizePx` is a multiple of the module
 * count, at most 1 px of difference between modules otherwise) so edges stay
 * crisp. The logo uses the same geometry as the SVG renderer.
 */
export const renderQrCanvas = async (
  matrix: QrMatrix,
  options: QrCanvasOptions
): Promise<HTMLCanvasElement> => {
  const { color, background, margin } = resolveStyle(options);
  const sizePx = Math.max(1, Math.round(options.sizePx));
  const total = matrix.size + margin * 2;
  const scale = sizePx / total;
  const snap = (modules: number): number => Math.round(modules * scale);

  const canvas = document.createElement("canvas");
  canvas.width = sizePx;
  canvas.height = sizePx;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, sizePx, sizePx);

  ctx.fillStyle = color;
  for (const [row, col, length] of darkRuns(matrix)) {
    const x0 = snap(col + margin);
    const x1 = snap(col + margin + length);
    const y0 = snap(row + margin);
    const y1 = snap(row + margin + 1);
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }

  if (options.logo) {
    const logoImg = await loadImage(options.logo.dataUrl);
    const aspect = options.logo.width ? logoAspect(options.logo) : logoAspect({
      width: logoImg.naturalWidth,
      height: logoImg.naturalHeight,
    });
    const { box, image } = computeLogoLayout(matrix, margin, options.logo.ratio, aspect);
    ctx.fillStyle = background;
    roundedRectPath(ctx, box.x * scale, box.y * scale, box.size * scale, box.radius * scale);
    ctx.fill();
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(logoImg, image.x * scale, image.y * scale, image.width * scale, image.height * scale);
  }

  return canvas;
};

export const toDataUrl = (
  canvas: HTMLCanvasElement,
  type: "image/png" | "image/jpeg" = "image/png",
  quality = 0.92
): string => canvas.toDataURL(type, quality);

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: "image/png" | "image/jpeg",
  quality?: number
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
      type,
      quality
    );
  });

export const toPngBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  canvasToBlob(canvas, "image/png");

export const toJpegBlob = (canvas: HTMLCanvasElement, quality = 0.92): Promise<Blob> =>
  canvasToBlob(canvas, "image/jpeg", quality);
