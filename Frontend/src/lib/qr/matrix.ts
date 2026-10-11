import type { QrEcc, QrMatrix } from "./types";

type QrCodeModule = typeof import("qrcode");

/** Loads `qrcode` on demand so it stays out of the initial bundle. */
const loadQrCode = async (): Promise<QrCodeModule> => {
  const mod = (await import("qrcode")) as QrCodeModule & { default?: QrCodeModule };
  return mod.default && typeof mod.default.create === "function" ? mod.default : mod;
};

/**
 * Encodes `content` (UTF-8) into a QR symbol matrix without quiet zone.
 * Throws when the content does not fit in the largest QR version.
 */
export const createQrMatrix = async (content: string, ecc: QrEcc = "H"): Promise<QrMatrix> => {
  const { create } = await loadQrCode();
  const qr = create(content, { errorCorrectionLevel: ecc });
  const size = qr.modules.size;
  const modules: boolean[][] = [];
  for (let row = 0; row < size; row++) {
    const line: boolean[] = [];
    for (let col = 0; col < size; col++) {
      line.push(Boolean(qr.modules.get(row, col)));
    }
    modules.push(line);
  }
  return { size, version: qr.version, modules };
};
