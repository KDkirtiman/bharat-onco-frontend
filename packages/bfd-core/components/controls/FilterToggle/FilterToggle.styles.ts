import { cn } from '../../../lib/cn';

export const style1 = 'flex items-center gap-1.5';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export function filterToggleButtonClass(
  pad: string,
  active: boolean,
) {
  return cn(
    'font-medium rounded-full transition-colors',
    pad,
    active
      ? 'bg-primary text-primary-foreground'
      : 'bg-muted text-muted-foreground hover:bg-muted/80',
  );
}

