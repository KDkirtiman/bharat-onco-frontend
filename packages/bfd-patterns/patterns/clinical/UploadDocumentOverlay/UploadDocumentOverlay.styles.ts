import { cn } from 'bfd-core';

export const style1 = 'space-y-4';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'disabled:opacity-40 disabled:cursor-not-allowed';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'flex items-center gap-2';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'hidden';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-muted/30 text-muted-foreground truncate min-w-0';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

export const style6 = 'shrink-0 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors';
export function style6Class(...extra: (string | undefined | false)[]) {
  return cn(style6, ...extra);
}

export const style7 = 'bg-muted hover:bg-muted/80';
export function style7Class(...extra: (string | undefined | false)[]) {
  return cn(style7, ...extra);
}

export const style8 = 'gap-2';
export function style8Class(...extra: (string | undefined | false)[]) {
  return cn(style8, ...extra);
}

