import { sanitizeColor } from "./color";
import type { QrMatrix, QrRenderOptions } from "./types";

/** ISO/IEC 18004 requires a quiet zone of at least 4 modules. */
export const DEFAULT_MARGIN = 4;
/** Logos above this fraction of the symbol side hurt scanning even with ECC H. */
export const MAX_LOGO_RATIO = 0.25;
const MIN_LOGO_RATIO = 0.05;
/** Share of the backing square left as white padding on each side. */
const LOGO_PADDING = 0.1;
const LOGO_RADIUS = 0.12;

export interface ResolvedStyle {
  color: string;
  background: string;
  margin: number;
}

export const resolveStyle = (options: QrRenderOptions = {}): ResolvedStyle => ({
  color: sanitizeColor(options.color, "#000000"),
  background: sanitizeColor(options.background, "#FFFFFF"),
  margin: Math.max(0, Math.floor(options.margin ?? DEFAULT_MARGIN)),
});

export interface LogoLayout {
  /** Rounded backing square in module units (quiet zone included). */
  box: { x: number; y: number; size: number; radius: number };
  /** Logo image rectangle inside the backing square, aspect ratio preserved. */
  image: { x: number; y: number; width: number; height: number };
}

/**
 * Geometry of the center logo in module units, shared by SVG, canvas and PDF.
 * The backing square is snapped to whole modules with the same parity as the
 * symbol so it stays centered and aligned to the module grid.
 */
export const computeLogoLayout = (
  matrix: QrMatrix,
  margin: number,
  ratio: number = MAX_LOGO_RATIO,
  aspect = 1
): LogoLayout => {
  const clamped = Math.min(MAX_LOGO_RATIO, Math.max(MIN_LOGO_RATIO, ratio));
  let boxSize = Math.floor(matrix.size * clamped);
  if ((matrix.size - boxSize) % 2 !== 0) boxSize -= 1;
  boxSize = Math.max(3, boxSize);

  const boxStart = margin + (matrix.size - boxSize) / 2;
  const inner = boxSize * (1 - 2 * LOGO_PADDING);
  const safeAspect = aspect > 0 && Number.isFinite(aspect) ? aspect : 1;
  const width = safeAspect >= 1 ? inner : inner * safeAspect;
  const height = safeAspect >= 1 ? inner / safeAspect : inner;
  const center = margin + matrix.size / 2;

  return {
    box: { x: boxStart, y: boxStart, size: boxSize, radius: boxSize * LOGO_RADIUS },
    image: { x: center - width / 2, y: center - height / 2, width, height },
  };
};

/** Horizontal runs of dark modules: `[row, startCol, length]`. */
export const darkRuns = (matrix: QrMatrix): Array<[number, number, number]> => {
  const runs: Array<[number, number, number]> = [];
  for (let row = 0; row < matrix.size; row++) {
    const line = matrix.modules[row];
    let col = 0;
    while (col < matrix.size) {
      if (!line[col]) {
        col++;
        continue;
      }
      const start = col;
      while (col < matrix.size && line[col]) col++;
      runs.push([row, start, col - start]);
    }
  }
  return runs;
};

/** Logo aspect ratio (width / height), 1 when unknown. */
export const logoAspect = (logo: { width?: number; height?: number }): number =>
  logo.width && logo.height ? logo.width / logo.height : 1;
