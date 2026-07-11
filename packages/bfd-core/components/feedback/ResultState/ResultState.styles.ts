import { cn } from '../../../lib/cn';

export const style1 = 'flex flex-col items-center px-6 py-10 text-center';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'w-16 h-16 bg-success-soft rounded-full flex items-center justify-center mb-5';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'text-lg font-bold text-foreground mb-5';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'w-full bg-muted/40 rounded-xl px-5 py-4 text-left space-y-2 mb-8';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'w-full rounded-xl py-2.5';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

