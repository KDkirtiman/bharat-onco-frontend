import { cn } from 'bfd-core';

export const style1 = 'flex items-center justify-between py-2.5 border-b border-border last:border-0';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'text-sm text-muted-foreground';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'text-sm font-medium text-foreground text-right max-w-[60%]';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'py-2';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'justify-between';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

export const style6 = 'bg-muted hover:bg-muted/80 px-4';
export function style6Class(...extra: (string | undefined | false)[]) {
  return cn(style6, ...extra);
}

export const style7 = 'px-4 font-semibold';
export function style7Class(...extra: (string | undefined | false)[]) {
  return cn(style7, ...extra);
}

