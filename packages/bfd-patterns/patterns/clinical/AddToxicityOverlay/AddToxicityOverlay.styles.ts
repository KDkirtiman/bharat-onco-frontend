import { cn } from 'bfd-core';

export const style1 = 'text-xs px-2 py-0.5 rounded-full border transition-colors';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'flex-1 py-2 rounded-lg border text-sm font-semibold transition-all';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'bg-background border-0';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'space-y-5';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'grid grid-cols-2 gap-4';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

export const style6 = 'flex flex-wrap gap-1.5 mt-2';
export function style6Class(...extra: (string | undefined | false)[]) {
  return cn(style6, ...extra);
}

export const style7 = 'flex gap-2';
export function style7Class(...extra: (string | undefined | false)[]) {
  return cn(style7, ...extra);
}

export const style8 = 'mt-2 text-xs text-muted-foreground italic leading-relaxed';
export function style8Class(...extra: (string | undefined | false)[]) {
  return cn(style8, ...extra);
}

export const style9 = 'bg-muted/30 rounded-xl p-4 space-y-3';
export function style9Class(...extra: (string | undefined | false)[]) {
  return cn(style9, ...extra);
}

export const style10 = 'grid grid-cols-2 gap-4 pt-1';
export function style10Class(...extra: (string | undefined | false)[]) {
  return cn(style10, ...extra);
}

