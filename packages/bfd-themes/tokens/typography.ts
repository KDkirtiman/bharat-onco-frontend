/**
 * Canonical typography class strings for Bharat Oncology.
 */

export const fontFamily = {
  sans: 'font-sans',
  mono: 'font-mono',
} as const;

export const fontSize = {
  micro: 'text-micro',
  caption: 'text-caption',
  captionSm: 'text-caption-sm',
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
} as const;

export const fontWeight = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

/** Reusable typography presets matching mockup patterns */
export const preset = {
  sectionLabel: 'text-caption font-semibold text-muted-foreground uppercase tracking-wide',
  pageTitle: 'text-2xl font-bold text-foreground',
  sectionTitle: 'text-lg font-bold text-foreground',
  tableHeader: 'text-caption font-semibold text-muted-foreground uppercase tracking-wide',
  body: 'text-sm text-foreground',
  bodyMuted: 'text-sm text-muted-foreground',
  microBadge: 'text-micro font-medium',
  captionBadge: 'text-caption font-semibold',
} as const;

export const TYPOGRAPHY_SCALE = [
  { token: '--font-size-micro', class: 'text-micro', px: '9px', usage: 'Sidebar "Soon" badge' },
  { token: '--font-size-caption', class: 'text-caption', px: '10px', usage: 'Section labels, table meta' },
  { token: '--font-size-caption-sm', class: 'text-caption-sm', px: '11px', usage: 'Avatar initials' },
  { token: '--font-size-xs', class: 'text-xs', px: '12px', usage: 'Badges, hints, footers' },
  { token: '--font-size-sm', class: 'text-sm', px: '14px', usage: 'Body, forms, nav (most common)' },
  { token: '--font-size-base', class: 'text-base', px: '16px', usage: 'Section values' },
  { token: '--font-size-lg', class: 'text-lg', px: '18px', usage: 'Tab/section titles' },
  { token: '--font-size-xl', class: 'text-xl', px: '20px', usage: 'Login heading' },
  { token: '--font-size-2xl', class: 'text-2xl', px: '24px', usage: 'Page titles, KPI values' },
] as const;
