import { cn } from '../../../lib/cn';

export const style1 = 'px-4 py-4 text-center';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'text-sm text-muted-foreground';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export const style3 = 'text-xs text-muted-foreground mt-0.5';
export function style3Class(...extra: (string | undefined | false)[]) {
  return cn(style3, ...extra);
}

