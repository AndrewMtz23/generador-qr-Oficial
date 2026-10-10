const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Returns `value` when it is a `#RGB`/`#RRGGBB` color, otherwise `fallback`. */
export const sanitizeColor = (value: string | undefined | null, fallback: string): string =>
  value && HEX_COLOR.test(value) ? value : fallback;

/** Converts `#RGB` or `#RRGGBB` into `[r, g, b]` (0-255). */
export const hexToRgb = (hex: string): [number, number, number] => {
  const full =
    hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
  return [
    parseInt(full.slice(1, 3), 16),
    parseInt(full.slice(3, 5), 16),
    parseInt(full.slice(5, 7), 16),
  ];
};
