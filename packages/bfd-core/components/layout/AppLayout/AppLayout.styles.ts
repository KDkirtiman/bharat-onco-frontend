import { cn } from '../../../lib/cn';

export const style1 = 'h-screen flex flex-col bg-background';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'flex flex-1 overflow-hidden';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

