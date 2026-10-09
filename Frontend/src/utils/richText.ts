/**
 * Copy in the locale files may contain internal links written as `[label](/path)`.
 * `RichText` renders them as router links; `stripRichText` returns the same visible text
 * (used for JSON-LD so structured data matches what the page shows).
 */
export const RICH_LINK_SPLIT = /(\[[^\]]+\]\(\/[^)\s]*\))/g;
export const RICH_LINK_ONE = /^\[([^\]]+)\]\((\/[^)\s]*)\)$/;

export function stripRichText(text: string): string {
  return text
    .split(RICH_LINK_SPLIT)
    .map((part) => part.replace(RICH_LINK_ONE, "$1"))
    .join("");
}
