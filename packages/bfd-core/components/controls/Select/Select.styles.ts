import { cn } from '../../../lib/cn';

export function selectClass(
  fieldSize: 'default' | 'sm',
  error?: boolean,
  className?: string,
) {
  return cn(
    fieldSize === 'sm' ? 'field-select-sm' : 'field-select',
    'text-sm',
    error && 'border-destructive focus:ring-destructive/20',
    className,
  );
}
