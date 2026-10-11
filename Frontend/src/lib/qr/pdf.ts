import { hexToRgb } from "./color";
import { computeLogoLayout, darkRuns, logoAspect, resolveStyle } from "./layout";
import type { QrMatrix, QrRenderOptions } from "./types";

/** Same page and margins the previous raster-based PDF export used (A4, 20 mm). */
const PAGE_MARGIN_MM = 20;
/** Tiny overlap between rows so PDF viewers do not draw hairline seams. */
const SEAM_OVERLAP = 0.015;

const imageFormat = (dataUrl: string): "PNG" | "JPEG" | "WEBP" => {
  const match = /^data:image\/(png|jpe?g|webp)/i.exec(dataUrl);
  const type = match?.[1].toLowerCase();
  if (type === "jpg" || type === "jpeg") return "JPEG";
  if (type === "webp") return "WEBP";
  return "PNG";
};

/**
 * Vector PDF: A4 portrait with the symbol centered at the largest square that
 * fits inside the 20 mm page margins. Modules are filled rectangles (one per
 * horizontal run); jsPDF is loaded on demand.
 */
export const createQrPdfBlob = async (
  matrix: QrMatrix,
  options: QrRenderOptions = {}
): Promise<Blob> => {
  const { jsPDF } = await import("jspdf");
  const { color, background, margin } = resolveStyle(options);

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const side = Math.min(pageWidth, pageHeight) - PAGE_MARGIN_MM * 2;
  const left = (pageWidth - side) / 2;
  const top = (pageHeight - side) / 2;
  const unit = side / (matrix.size + margin * 2);

  const [bgR, bgG, bgB] = hexToRgb(background);
  pdf.setFillColor(bgR, bgG, bgB);
  pdf.rect(left, top, side, side, "F");

  const [r, g, b] = hexToRgb(color);
  pdf.setFillColor(r, g, b);
  for (const [row, col, length] of darkRuns(matrix)) {
    pdf.rect(
      left + (col + margin) * unit,
      top + (row + margin) * unit,
      length * unit,
      unit * (1 + SEAM_OVERLAP),
      "F"
    );
  }

  if (options.logo) {
    const { box, image } = computeLogoLayout(
      matrix,
      margin,
      options.logo.ratio,
      logoAspect(options.logo)
    );
    pdf.setFillColor(bgR, bgG, bgB);
    pdf.roundedRect(
      left + box.x * unit,
      top + box.y * unit,
      box.size * unit,
      box.size * unit,
      box.radius * unit,
      box.radius * unit,
      "F"
    );
    pdf.addImage(
      options.logo.dataUrl,
      imageFormat(options.logo.dataUrl),
      left + image.x * unit,
      top + image.y * unit,
      image.width * unit,
      image.height * unit
    );
  }

  return pdf.output("blob");
};

/**
 * Wraps an existing raster image (data URL) into an A4 PDF. Only used for
 * history entries saved before the in-browser engine, which have no matrix.
 */
export const createImagePdfBlob = async (
  imageDataUrl: string,
  width: number,
  height: number
): Promise<Blob> => {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const maxWidth = pdf.internal.pageSize.getWidth() - PAGE_MARGIN_MM * 2;
  const maxHeight = pdf.internal.pageSize.getHeight() - PAGE_MARGIN_MM * 2;
  const aspect = width / height;
  let imgWidth = maxWidth;
  let imgHeight = maxWidth / aspect;
  if (imgHeight > maxHeight) {
    imgHeight = maxHeight;
    imgWidth = maxHeight * aspect;
  }
  pdf.addImage(
    imageDataUrl,
    imageFormat(imageDataUrl),
    (pdf.internal.pageSize.getWidth() - imgWidth) / 2,
    (pdf.internal.pageSize.getHeight() - imgHeight) / 2,
    imgWidth,
    imgHeight
  );
  return pdf.output("blob");
};
