import { cn } from 'bfd-core';

export const style1 = 'max-w-4xl h-[90vh]';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'flex items-center justify-between px-6 py-4 border-b border-border shrink-0';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'text-base font-semibold text-foreground font-mono';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'text-xs text-muted-foreground mt-0.5';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'flex items-center gap-2';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

export const style6 = 'flex items-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted text-foreground transition-colors';
export function style6Class(...extra: (string | undefined | false)[]) {
  return cn(style6, ...extra);
}

export const style7 = 'flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors';
export function style7Class(...extra: (string | undefined | false)[]) {
  return cn(style7, ...extra);
}

export const style8 = 'ml-1';
export function style8Class(...extra: (string | undefined | false)[]) {
  return cn(style8, ...extra);
}

export const style9 = 'flex-1 w-full rounded-b-2xl';
export function style9Class(...extra: (string | undefined | false)[]) {
  return cn(style9, ...extra);
}

