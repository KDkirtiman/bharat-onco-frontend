import { cn } from '../../../lib/cn';

export const style1 = 'fixed inset-0 bg-black/40 z-40';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'flex flex-col h-full w-56';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'flex items-center gap-1.5 mb-2';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'text-primary';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'text-xs font-semibold text-primary tracking-wide';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

export const style6 = 'w-full text-sm font-medium bg-card text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer';
export function style6Class(...extra: (string | undefined | false)[]) {
  return cn(style6, ...extra);
}

export const style7 = 'w-full text-sm font-medium bg-card text-foreground border border-border rounded-lg px-3 py-2';
export function style7Class(...extra: (string | undefined | false)[]) {
  return cn(style7, ...extra);
}

export const style8 = 'flex-1 py-3 overflow-y-auto overflow-x-hidden';
export function style8Class(...extra: (string | undefined | false)[]) {
  return cn(style8, ...extra);
}

export const style9 = 'truncate flex-1';
export function style9Class(...extra: (string | undefined | false)[]) {
  return cn(style9, ...extra);
}

export const style10 = 'shrink-0 text-micro text-sidebar-foreground/50 font-medium';
export function style10Class(...extra: (string | undefined | false)[]) {
  return cn(style10, ...extra);
}

export const style11 = 'shrink-0 text-caption font-bold px-1.5 py-0.5 rounded-full bg-warning-soft text-warning-emphasis';
export function style11Class(...extra: (string | undefined | false)[]) {
  return cn(style11, ...extra);
}

export const style12 = 'absolute top-1 right-1 w-2 h-2 rounded-full bg-warning-solid';
export function style12Class(...extra: (string | undefined | false)[]) {
  return cn(style12, ...extra);
}

export const style13 = 'flex items-center gap-2 px-4 py-3 border-t border-sidebar-border text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors';
export function style13Class(...extra: (string | undefined | false)[]) {
  return cn(style13, ...extra);
}

