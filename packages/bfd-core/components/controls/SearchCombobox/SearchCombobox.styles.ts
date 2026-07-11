import { cn } from '../../../lib/cn';

export const style1 = 'mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'flex items-center gap-3 w-full px-3 py-2.5 hover:bg-muted/50 transition-colors text-left';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'min-w-0';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

export const style4 = 'text-sm font-medium text-foreground truncate';
export function style4Class(...extra: (string | undefined | false)[]) {
  return cn(style4, ...extra);
}

export const style5 = 'text-xs text-muted-foreground';
export function style5Class(...extra: (string | undefined | false)[]) {
  return cn(style5, ...extra);
}

