/**
 * Edit this file to match your Figma variable collection names.
 *
 * Key   = exact Figma collection name (case-sensitive)
 * Value = output path relative to the design system repo root
 *         OR null to auto-split by the first path segment into
 *         src/tokens/components/{segment}.css
 *
 * Collections not listed here are skipped.
 */
export const COLLECTION_MAP: Record<string, string | null> = {
  Primitives: "src/tokens/primitives.css",
  "Semantic Colours": "src/tokens/semantic.css",
  "Semantic Typography": "src/tokens/semantic.css",
  "Semantic Space": "src/tokens/semantic.css",
  Components: null, // auto-splits: button/* → components/button.css, etc.
};

/**
 * Unit appended to raw float values (spacing, sizing, radius…).
 * Use "px" for pixel-based tokens, "" to emit a bare number.
 */
export const FLOAT_UNIT = "px";

/**
 * Decimal places for oklch() channel values.
 */
export const OKLCH_PRECISION = 4;
