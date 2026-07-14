/**
 * Raw hex values for print/PDF templates (invoices, receipts) that render as
 * standalone HTML strings and can't use Tailwind utility classes.
 * Brand accents reuse SEMANTIC_HEX; this file only adds the neutral grayscale
 * needed for document body text/backgrounds so no hex is ever hand-copied.
 */
import { SEMANTIC_HEX } from './semantic-colors';

export const PRINT_NEUTRAL_HEX = {
  gray900: '#111827',
  gray700: '#374151',
  gray600: '#4b5563',
  gray400: '#9ca3af',
  gray300: '#d1d5db',
  gray200: '#e5e7eb',
  gray100: '#f3f4f6',
  gray50: '#fafafa',
  slateBody: '#1e293b',
  slateSoft: '#f1f5f9',
  white: '#ffffff',
} as const;

/** Brand + status colors reused from SEMANTIC_HEX, named for print-template use. */
export const PRINT_BRAND_HEX = {
  violetDark: SEMANTIC_HEX.violet.emphasis,
  violetMid: SEMANTIC_HEX.violet.emphasisMid,
  violetSoft: SEMANTIC_HEX.violet.soft,
  /** Lightest gradient stop; not part of SEMANTIC_HEX (violet-400) but kept here so it's still a single source. */
  violetLight: '#a855f7',
  successEmphasis: SEMANTIC_HEX.success.emphasis,
  successEmphasisMid: SEMANTIC_HEX.success.emphasisMid,
  successSoft: SEMANTIC_HEX.success.soft,
  warningEmphasis: SEMANTIC_HEX.warning.emphasis,
  warningSoft: SEMANTIC_HEX.warning.soft,
  infoEmphasis: SEMANTIC_HEX.info.emphasis,
  infoSoft: SEMANTIC_HEX.info.soft,
  neutralEmphasis: SEMANTIC_HEX.neutral.emphasis,
  neutralSoft: SEMANTIC_HEX.neutral.soft,
} as const;
