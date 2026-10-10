import { saveBlob, svgToDataUrl } from "./download";
import { createQrMatrix } from "./matrix";
import { prepareLogo, renderQrCanvas, toDataUrl, toJpegBlob, toPngBlob } from "./raster";
import { renderQrSvg } from "./svg";
import type { QrEcc, QrFormat, QrMatrix, QrRenderOptions } from "./types";

export type { QrEcc, QrFormat, QrLogo, QrMatrix, QrRenderOptions } from "./types";
export { DEFAULT_MARGIN, MAX_LOGO_RATIO } from "./layout";
export { createQrMatrix } from "./matrix";
export { renderQrSvg } from "./svg";

export interface GenerateQrInput {
  content: string;
  /** Output width/height in px. */
  sizePx: number;
  /** Dark module color. Default `#000000`. */
  color?: string;
  /** Center logo as a data URL (any browser-decodable image). */
  logoDataUrl?: string | null;
  /** Format used for `previewDataUrl`. Every format can be downloaded later. */
  format: QrFormat;
  ecc?: QrEcc;
}

export interface QrResult {
  /** Data URL of the code in `format` (PNG for PDF), ready for `<img src>` or history. */
  previewDataUrl: string;
  matrix: QrMatrix;
  /** Scalable SVG with fixed `width`/`height` of `sizePx`. */
  svg: string;
  sizePx: number;
  /** Render options needed to produce any other format later. */
  style: QrRenderOptions;
  /** `true` when the logo could not be decoded and the code was made without it. */
  logoFailed: boolean;
}

const rasterOptions = (result: Pick<QrResult, "style" | "sizePx">) => ({
  ...result.style,
  sizePx: result.sizePx,
});

/**
 * Creates a QR code entirely in the browser. `qrcode` is loaded on demand.
 * A logo that cannot be decoded is dropped (`logoFailed`) instead of failing.
 */
export const generateQr = async (input: GenerateQrInput): Promise<QrResult> => {
  const sizePx = Math.max(1, Math.round(input.sizePx));
  const matrix = await createQrMatrix(input.content, input.ecc ?? "H");

  const style: QrRenderOptions = { color: input.color };
  let logoFailed = false;
  if (input.logoDataUrl) {
    try {
      const logo = await prepareLogo(input.logoDataUrl);
      style.logo = { dataUrl: logo.dataUrl, width: logo.width, height: logo.height };
    } catch {
      logoFailed = true;
    }
  }

  const svg = renderQrSvg(matrix, { ...style, sizePx });

  let previewDataUrl: string;
  if (input.format === "svg") {
    previewDataUrl = svgToDataUrl(svg);
  } else {
    const canvas = await renderQrCanvas(matrix, rasterOptions({ style, sizePx }));
    previewDataUrl = toDataUrl(canvas, input.format === "jpg" ? "image/jpeg" : "image/png");
  }

  return { previewDataUrl, matrix, svg, sizePx, style, logoFailed };
};

/** Encodes an existing result in the requested format. Also used by bulk/templates. */
export const encodeQr = async (result: QrResult, format: QrFormat): Promise<Blob> => {
  switch (format) {
    case "svg":
      return new Blob([result.svg], { type: "image/svg+xml" });
    case "pdf": {
      const { createQrPdfBlob } = await import("./pdf");
      return createQrPdfBlob(result.matrix, result.style);
    }
    case "jpg":
      return toJpegBlob(await renderQrCanvas(result.matrix, rasterOptions(result)));
    case "png":
      return toPngBlob(await renderQrCanvas(result.matrix, rasterOptions(result)));
  }
};

/** Downloads `result` as `<filename>.<format>`. */
export const downloadQr = async (
  result: QrResult,
  format: QrFormat,
  filename: string
): Promise<void> => {
  saveBlob(await encodeQr(result, format), `${filename}.${format}`);
};
