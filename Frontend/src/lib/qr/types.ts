/** Error correction levels defined by ISO/IEC 18004. */
export type QrEcc = "L" | "M" | "Q" | "H";

/** Square symbol without quiet zone. `modules[row][col]` is `true` for a dark module. */
export interface QrMatrix {
  size: number;
  version: number;
  modules: boolean[][];
}

/** Logo drawn at the center of the symbol. */
export interface QrLogo {
  /** Image data URL (PNG/JPEG/GIF/SVG). */
  dataUrl: string;
  /** Backing square side as a fraction of the symbol side. Never above 0.25. */
  ratio?: number;
  /** Natural image size, used to keep the aspect ratio. Defaults to square. */
  width?: number;
  height?: number;
}

/** Options shared by every renderer (SVG, canvas, PDF). */
export interface QrRenderOptions {
  /** Dark module color as `#RGB` or `#RRGGBB`. Default `#000000`. */
  color?: string;
  /** Background color as `#RGB` or `#RRGGBB`. Default `#FFFFFF`. */
  background?: string;
  /** Quiet zone in modules. Default 4 (ISO/IEC 18004). */
  margin?: number;
  logo?: QrLogo;
}

export type QrFormat = "png" | "jpg" | "svg" | "pdf";
