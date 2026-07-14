import { cn } from 'bfd-core';

export const style1 = 'px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'space-y-5';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'flex gap-1 bg-muted/50 rounded-lg p-1 w-fit';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

