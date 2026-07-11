import { cn } from '../../../lib/cn';

export const style1 = 'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-input rounded-md bg-input-background hover:bg-input/50 transition-colors outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50 disabled:cursor-not-allowed';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'relative';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'size-4 opacity-50';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'absolute z-50 mt-1 rounded-md border border-border bg-card shadow-md p-3 w-auto';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'p-0';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

export const style6 = 'flex justify-center items-center gap-2 mb-2';
export function style6Class(...extra: (string | undefined | false)[]) {
  return cn(style6, ...extra);
}

export const style7 = 'px-2 py-1 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring/50';
export function style7Class(...extra: (string | undefined | false)[]) {
  return cn(style7, ...extra);
}

export const style8 = 'size-4';
export function style8Class(...extra: (string | undefined | false)[]) {
  return cn(style8, ...extra);
}

export const navBtnClass =
  'size-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-input text-sm hover:bg-accent hover:text-accent-foreground';

export const dayBtnClass =
  'size-8 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground';

export function triggerButtonClass(hasValue: boolean) {
  return cn(
    'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-input rounded-md bg-input-background hover:bg-input/50 transition-colors outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50 disabled:cursor-not-allowed',
    !hasValue && 'text-muted-foreground',
  );
}

export const dayCellClass =
  'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected])]:rounded-md';

