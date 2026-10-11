import { computeLogoLayout, darkRuns, logoAspect, resolveStyle } from "./layout";
import type { QrMatrix, QrRenderOptions } from "./types";

export interface QrSvgOptions extends QrRenderOptions {
  /** Output width/height in px. Omit for a scalable SVG without fixed size. */
  sizePx?: number;
}

const escapeAttr = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const fmt = (value: number): string => String(Math.round(value * 1000) / 1000);

/**
 * Renders the symbol as an SVG string. Dark modules are merged into a single
 * `<path>` (one rectangle per horizontal run) and the viewBox is in module
 * units, so the file stays small and scales without loss. DOM-free.
 */
export const renderQrSvg = (matrix: QrMatrix, options: QrSvgOptions = {}): string => {
  const { color, background, margin } = resolveStyle(options);
  const total = matrix.size + margin * 2;

  const path = darkRuns(matrix)
    .map(([row, col, length]) => `M${col + margin} ${row + margin}h${length}v1h-${length}z`)
    .join("");

  const sizeAttrs = options.sizePx ? ` width="${options.sizePx}" height="${options.sizePx}"` : "";

  let logo = "";
  if (options.logo) {
    const { box, image } = computeLogoLayout(
      matrix,
      margin,
      options.logo.ratio,
      logoAspect(options.logo)
    );
    logo =
      `<rect x="${fmt(box.x)}" y="${fmt(box.y)}" width="${fmt(box.size)}" height="${fmt(box.size)}" ` +
      `rx="${fmt(box.radius)}" fill="${background}"/>` +
      `<image xlink:href="${escapeAttr(options.logo.dataUrl)}" x="${fmt(image.x)}" y="${fmt(image.y)}" ` +
      `width="${fmt(image.width)}" height="${fmt(image.height)}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `viewBox="0 0 ${total} ${total}"${sizeAttrs} shape-rendering="crispEdges">` +
    `<rect width="${total}" height="${total}" fill="${background}"/>` +
    `<path d="${path}" fill="${color}"/>` +
    logo +
    `</svg>`
  );
};
