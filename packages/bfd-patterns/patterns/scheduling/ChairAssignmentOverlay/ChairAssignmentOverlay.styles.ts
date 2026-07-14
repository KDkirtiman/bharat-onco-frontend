import { cn } from 'bfd-core';

export const style1 = 'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'text-caption font-medium px-1.5 py-0.5 rounded-full leading-tight';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'shadow-xl';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'text-indigo-emphasis-mid';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'px-6 py-3 bg-muted/30 border-b border-border shrink-0';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

export const style6 = 'text-sm font-medium text-foreground';
export function style6Class(...extra: (string | undefined | false)[]) {
  return cn(style6, ...extra);
}

export const style7 = 'text-xs text-muted-foreground';
export function style7Class(...extra: (string | undefined | false)[]) {
  return cn(style7, ...extra);
}

export const style8 = 'max-h-72 py-4 space-y-4';
export function style8Class(...extra: (string | undefined | false)[]) {
  return cn(style8, ...extra);
}

export const style9 = 'text-center py-8 text-muted-foreground';
export function style9Class(...extra: (string | undefined | false)[]) {
  return cn(style9, ...extra);
}

export const style10 = 'opacity-30 mx-auto mb-2';
export function style10Class(...extra: (string | undefined | false)[]) {
  return cn(style10, ...extra);
}

export const style11 = 'text-sm';
export function style11Class(...extra: (string | undefined | false)[]) {
  return cn(style11, ...extra);
}

export const style12 = 'text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2';
export function style12Class(...extra: (string | undefined | false)[]) {
  return cn(style12, ...extra);
}

export const style13 = 'grid grid-cols-4 gap-2';
export function style13Class(...extra: (string | undefined | false)[]) {
  return cn(style13, ...extra);
}

export const style14 = 'text-xs font-bold';
export function style14Class(...extra: (string | undefined | false)[]) {
  return cn(style14, ...extra);
}

export const style15 = 'justify-between';
export function style15Class(...extra: (string | undefined | false)[]) {
  return cn(style15, ...extra);
}

export const style16 = 'flex gap-2';
export function style16Class(...extra: (string | undefined | false)[]) {
  return cn(style16, ...extra);
}

export const style17 = 'bg-muted hover:bg-muted/80 px-4';
export function style17Class(...extra: (string | undefined | false)[]) {
  return cn(style17, ...extra);
}

export const style18 = 'flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-solid text-white rounded-lg hover:bg-indigo-solid-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors';
export function style18Class(...extra: (string | undefined | false)[]) {
  return cn(style18, ...extra);
}

