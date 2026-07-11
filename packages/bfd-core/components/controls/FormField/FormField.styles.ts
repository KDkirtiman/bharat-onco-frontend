import { cn } from '../../../lib/cn';

export const style1 = 'text-destructive';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'text-xs text-muted-foreground font-normal ml-2';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export function formFieldLabelClass(labelVariant: 'default' | 'uppercase') {
  return cn(
    labelVariant === 'uppercase'
      ? 'block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5'
      : 'block text-sm font-medium text-foreground mb-1',
  );
}

export const style3 = 'text-xs text-destructive mt-1';

