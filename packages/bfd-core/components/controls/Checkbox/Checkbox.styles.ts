import { cn } from '../../../lib/cn';

export const style1 = 'flex items-center gap-2';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'relative';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'peer sr-only';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 =
  'flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 border-border bg-background transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20 peer-hover:border-primary/50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

export const style6 = 'cursor-pointer select-none text-sm text-foreground';
export function style6Class(...extra: (string | undefined | false)[]) {
  return cn(style6, ...extra);
}

