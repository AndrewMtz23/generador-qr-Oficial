export const QR_CONFIG = {
  MIN_SIZE: 200,
  MAX_SIZE: 2000,
  STEP_SIZE: 25,
  DEFAULT_SIZE: 500,
  DEFAULT_COLOR: "#000000",
  MAX_LOGO_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

export const BRAND_NAME = "QR Gratis";

export const STORAGE_KEYS = {
  THEME: "theme",
  LANGUAGE: "language",
} as const;

export const SUPPORTED_LANGUAGES = ["es", "en", "pt"] as const;

export const OUTPUT_FORMATS: Array<{ value: "jpg" | "png" | "pdf" | "svg"; label: string }> = [
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "pdf", label: "PDF" },
  { value: "svg", label: "SVG" },
] as const;

