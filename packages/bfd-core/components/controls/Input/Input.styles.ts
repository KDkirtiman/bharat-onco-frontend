import { cn } from '../../../lib/cn';

export const style1 = 'w-full';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'relative';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'mt-1.5 text-sm text-destructive';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

