import { cn } from '../../../lib/cn';

export const style1 = 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'bg-card rounded-2xl shadow-2xl border border-border w-full flex flex-col max-h-[90vh]';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'flex items-center justify-between px-6 py-4 border-b border-border shrink-0';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'px-6 py-5';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

export const style6 = 'flex items-center gap-2 min-w-0';
export function style6Class(...extra: (string | undefined | false)[]) {
  return cn(style6, ...extra);
}

export const style7 = 'text-primary shrink-0';
export function style7Class(...extra: (string | undefined | false)[]) {
  return cn(style7, ...extra);
}

export const style8 = 'text-base font-semibold text-foreground truncate';
export function style8Class(...extra: (string | undefined | false)[]) {
  return cn(style8, ...extra);
}


export const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
} as const;

export type ModalSize = keyof typeof sizeClasses;

export function modalCn(...parts: (string | undefined | false)[]) {
  return cn(...parts);
}
