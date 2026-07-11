import { cn } from 'bfd-core';

export const style1 = 'flex flex-col md:flex-row flex-1 overflow-hidden mt-4 min-h-0';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'md:hidden shrink-0 border-b border-border bg-card overflow-x-auto';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'flex min-w-max';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'hidden md:block w-52 shrink-0 border-r border-border bg-card overflow-y-auto';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6 min-w-0';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

