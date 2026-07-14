import { cn } from 'bfd-core';

export const style1 = 'space-y-4';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

