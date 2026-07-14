import { cn } from 'bfd-core';

export const style1 = 'text-warning-emphasis-mid';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'space-y-4';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'bg-muted/40 rounded-xl px-4 py-3';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'text-sm font-semibold text-foreground';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'font-normal text-muted-foreground';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

export const style6 = 'text-xs text-warning-emphasis bg-warning-surface-soft border border-warning-surface-border rounded-lg px-2.5 py-1 mt-2 inline-block';
export function style6Class(...extra: (string | undefined | false)[]) {
  return cn(style6, ...extra);
}

export const style7 = 'flex gap-2';
export function style7Class(...extra: (string | undefined | false)[]) {
  return cn(style7, ...extra);
}

export const style8 = 'text-xs text-muted-foreground';
export function style8Class(...extra: (string | undefined | false)[]) {
  return cn(style8, ...extra);
}

export const style9 = 'font-medium text-foreground';
export function style9Class(...extra: (string | undefined | false)[]) {
  return cn(style9, ...extra);
}

export const style10 = 'flex items-center gap-2 text-sm text-success-emphasis bg-success-soft border border-success-border rounded-lg px-4 py-2.5';
export function style10Class(...extra: (string | undefined | false)[]) {
  return cn(style10, ...extra);
}

export const style11 = 'shrink-0';
export function style11Class(...extra: (string | undefined | false)[]) {
  return cn(style11, ...extra);
}

export const style12 = 'flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all text-sm font-medium';
export function style12Class(...extra: (string | undefined | false)[]) {
  return cn(style12, ...extra);
}

export const style13 = 'bg-muted hover:bg-muted/80 px-4';
export function style13Class(...extra: (string | undefined | false)[]) {
  return cn(style13, ...extra);
}

