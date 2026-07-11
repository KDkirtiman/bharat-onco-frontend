/**
 * Canonical semantic color class strings for Bharat Oncology.
 * Use these instead of raw Tailwind palette classes (bg-green-100, etc.).
 */

export const SEMANTIC_HEX = {
  success: { soft: '#dcfce7', emphasis: '#15803d', emphasisMid: '#16a34a', border: '#86efac', solid: '#22c55e' },
  info: { soft: '#dbeafe', emphasis: '#1d4ed8', emphasisMid: '#2563eb', border: '#93c5fd', solid: '#3b82f6' },
  warning: { soft: '#fef3c7', emphasis: '#b45309', emphasisMid: '#d97706', border: '#fcd34d', solid: '#f59e0b' },
  warningSurface: { soft: '#fffbeb', emphasis: '#b45309', emphasisMid: '#d97706', border: '#fde68a' },
  error: { soft: '#fee2e2', emphasis: '#b91c1c', emphasisMid: '#dc2626', border: '#fca5a5', solid: '#7f1d1d' },
  teal: { soft: '#ccfbf1', emphasis: '#0f766e', emphasisMid: '#0d9488', border: '#5eead4' },
  tealSurface: { soft: '#f0fdfa', emphasis: '#0f766e', emphasisMid: '#0d9488', border: '#99f6e4' },
  purple: { soft: '#f3e8ff', emphasis: '#7e22ce', emphasisMid: '#9333ea', border: '#d8b4fe', accent: '#7c3aed' },
  violet: { soft: '#ede9fe', emphasis: '#6d28d9', emphasisMid: '#7c3aed', border: '#c4b5fd' },
  indigo: { soft: '#e0e7ff', emphasis: '#4338ca', emphasisMid: '#4f46e5', border: '#a5b4fc', solid: '#4f46e5', solidHover: '#4338ca' },
  sky: { soft: '#e0f2fe', emphasis: '#0369a1', emphasisMid: '#0284c7', border: '#7dd3fc' },
  orange: { soft: '#ffedd5', emphasis: '#c2410c', emphasisMid: '#ea580c', border: '#fdba74' },
  orangeSurface: { soft: '#fff7ed', emphasis: '#c2410c', emphasisMid: '#ea580c', border: '#fed7aa' },
  neutral: { soft: '#f3f4f6', emphasis: '#6b7280', emphasisMid: '#4b5563', border: '#d1d5db', text: '#374151', textMuted: '#9ca3af' },
  slate: { soft: '#f1f5f9', emphasis: '#334155', emphasisMid: '#475569', border: '#e2e8f0' },
  brandSoft: { soft: '#faf5ff', emphasis: '#7c3aed', border: '#e9d5ff' },
  cyan: { soft: '#cffafe', emphasis: '#0e7490', emphasisMid: '#0891b2', border: '#67e8f9' },
  rose: { soft: '#ffe4e6', emphasis: '#be123c', emphasisMid: '#e11d48', border: '#fda4af' },
} as const;

/** Badge: soft background + emphasis text */
export const badge = {
  success: 'bg-success-soft text-success-emphasis',
  info: 'bg-info-soft text-info-emphasis',
  warning: 'bg-warning-soft text-warning-emphasis',
  warningSurface: 'bg-warning-surface-soft text-warning-surface-emphasis',
  error: 'bg-error-soft text-error-emphasis',
  errorSolid: 'bg-error-solid text-white',
  teal: 'bg-teal-soft text-teal-emphasis',
  tealSurface: 'bg-teal-surface-soft text-teal-surface-emphasis',
  purple: 'bg-purple-soft text-purple-emphasis',
  violet: 'bg-violet-soft text-violet-emphasis',
  indigo: 'bg-indigo-soft text-indigo-emphasis',
  sky: 'bg-sky-soft text-sky-emphasis',
  orange: 'bg-orange-soft text-orange-emphasis',
  orangeSurface: 'bg-orange-surface-soft text-orange-surface-emphasis',
  neutral: 'bg-neutral-soft text-neutral-emphasis',
  slate: 'bg-slate-soft text-slate-emphasis',
  brandSoft: 'bg-brand-soft-soft text-brand-soft-emphasis',
  cyan: 'bg-cyan-soft text-cyan-emphasis',
  rose: 'bg-rose-soft text-rose-emphasis',
  pink: 'bg-accent text-secondary',
  lime: 'bg-lime-soft text-lime-emphasis',
  successSolid: 'bg-success-solid text-white',
  warningSurfaceMid: 'bg-warning-surface-soft text-warning-emphasis-mid',
  destructive: 'bg-destructive/10 text-destructive',
  muted: 'bg-muted text-muted-foreground',
} as const;

/** Badge with border (selectable chips, grade selectors) */
export const badgeBorder = {
  success: 'bg-success-soft text-success-emphasis border-success-border',
  info: 'bg-info-soft text-info-emphasis border-info-border',
  warning: 'bg-warning-soft text-warning-emphasis border-warning-border',
  orange: 'bg-orange-soft text-orange-emphasis border-orange-border',
  error: 'bg-error-soft text-error-emphasis border-error-border',
  errorSolid: 'bg-error-solid text-white border-error-solid',
  destructive: 'bg-destructive/10 text-destructive border-destructive/30',
} as const;

/** Callout container + text hierarchy */
export const callout = {
  warning: {
    container: 'bg-warning-surface-soft border-warning-surface-border',
    icon: 'text-warning-emphasis-mid',
    title: 'text-warning-emphasis',
    body: 'text-warning-emphasis',
    sub: 'text-warning-emphasis-mid',
  },
  info: {
    container: 'bg-info-soft border-info-border',
    icon: 'text-info-emphasis-mid',
    title: 'text-info-emphasis',
    body: 'text-info-emphasis',
    sub: 'text-info-emphasis-mid',
  },
  success: {
    container: 'bg-success-soft border-success-border',
    icon: 'text-success-emphasis-mid',
    title: 'text-success-emphasis',
    body: 'text-success-emphasis',
    sub: 'text-success-emphasis-mid',
  },
  destructive: {
    container: 'bg-error-soft border-error-border',
    icon: 'text-error-emphasis-mid',
    title: 'text-error-emphasis',
    body: 'text-error-emphasis',
    sub: 'text-error-emphasis-mid',
  },
} as const;

/** Text-only emphasis (KPI values, icons, amounts) */
export const textEmphasis = {
  success: 'text-success-emphasis-mid',
  info: 'text-info-emphasis-mid',
  warning: 'text-warning-emphasis-mid',
  error: 'text-error-emphasis-mid',
  teal: 'text-teal-emphasis-mid',
  indigo: 'text-indigo-emphasis-mid',
  purple: 'text-purple-emphasis-mid',
  neutral: 'text-neutral-emphasis',
  destructive: 'text-destructive',
} as const;

/** Surface panels (alerts, info boxes) */
export const surface = {
  warning: 'bg-warning-surface-soft border-warning-surface-border',
  warningHover: 'hover:bg-warning-soft',
  info: 'bg-info-soft border-info-border',
  success: 'bg-success-soft',
  brandSoft: 'bg-brand-soft-soft border-brand-soft-border',
  brandSoftText: 'text-purple-emphasis-mid',
} as const;

/** Solid action buttons */
export const buttonSolid = {
  indigo: 'bg-indigo-solid text-white hover:bg-indigo-solid-hover',
  warning: 'bg-warning-solid text-white hover:bg-warning-emphasis-mid',
} as const;

/** Border accents */
export const borderAccent = {
  purple: 'border-l-purple-accent',
  purpleStrong: 'border-purple-emphasis',
  indigo: 'border-indigo-emphasis-mid',
  indigoSoft: 'hover:border-indigo-border',
} as const;

/** Print / document neutral palette */
export const print = {
  text: 'text-print-text',
  muted: 'text-print-muted',
  label: 'text-print-label',
  border: 'border-print-border',
  borderStrong: 'border-print-text',
  header: 'text-purple-emphasis',
  rowAlt: 'bg-neutral-soft',
  tableHead: 'bg-neutral-soft',
} as const;

/** Solid primary action buttons on appointment cards */
export const actionPrimary = {
  teal: 'bg-teal-emphasis-mid text-white hover:bg-teal-emphasis',
  violet: 'bg-violet-emphasis-mid text-white hover:bg-violet-emphasis',
  warning: 'bg-warning-solid text-white hover:bg-warning-emphasis-mid',
  sky: 'bg-sky-emphasis-mid text-white hover:bg-sky-emphasis',
  success: 'bg-success-emphasis-mid text-white hover:bg-success-emphasis',
  error: 'bg-error-emphasis-mid text-white hover:bg-error-emphasis',
  errorDark: 'bg-error-emphasis text-white hover:bg-error-solid',
  indigo: 'bg-indigo-solid text-white hover:bg-indigo-solid-hover',
  primary: 'bg-primary text-white hover:bg-primary/90',
} as const;

/** Card left-border accents */
export const cardAccent = {
  success: 'border-l-success-emphasis-mid',
  warning: 'border-l-warning-solid',
  brand: 'border-l-purple-accent',
} as const;

export type BadgeVariant = keyof typeof badge;
export type CalloutVariant = keyof typeof callout;
