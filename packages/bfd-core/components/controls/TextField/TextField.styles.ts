import { cn } from '../../../lib/cn';

export const style1 = 'relative';
export function style1Class(...extra: (string | undefined | false)[]) {
  return cn(style1, ...extra);
}

export const style2 = 'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none';
export function style2Class(...extra: (string | undefined | false)[]) {
  return cn(style2, ...extra);
}

export function textFieldInputClass(
  fieldSize: 'default' | 'sm',
  hasIcon: boolean,
  error?: boolean,
  className?: string,
) {
  return cn(
    fieldSize === 'sm' ? 'field-input-sm' : 'field-input',
    'text-sm',
    hasIcon && 'pl-9',
    error && 'border-destructive focus:ring-destructive/20',
    className,
  );
}

