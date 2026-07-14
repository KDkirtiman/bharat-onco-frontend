import { cn } from 'bfd-core';

export const style1 = 'space-y-4';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'bg-muted/50 rounded-lg px-4 py-3';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'text-sm font-semibold text-foreground';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'font-normal text-muted-foreground';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'text-xs text-muted-foreground mt-0.5';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

