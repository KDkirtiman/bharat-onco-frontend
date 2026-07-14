import { cn } from '../../../lib/cn';

export function wrapperClass(className?: string) {
  return cn('relative w-full', className);
}

export function triggerClass(
  fieldSize: 'default' | 'sm',
  error?: boolean,
  disabled?: boolean,
) {
  return cn(
    fieldSize === 'sm' ? 'field-select-sm' : 'field-select',
    'text-sm flex items-center justify-between gap-2 text-left',
    disabled && 'cursor-not-allowed opacity-50',
    error && 'border-destructive focus:ring-destructive/20',
  );
}

export function valueClass(isPlaceholder?: boolean) {
  return cn('truncate', isPlaceholder && 'text-muted-foreground');
}

export function chevronClass(fieldSize: 'default' | 'sm', open?: boolean) {
  return cn(
    'shrink-0 text-muted-foreground transition-transform',
    fieldSize === 'sm' ? 'size-3.5' : 'size-4',
    open && 'rotate-180',
  );
}

export function listboxClass() {
  return cn(
    'z-50 max-h-60 overflow-auto rounded-lg border border-border',
    'bg-input-background shadow-md py-1',
  );
}

export function optionClass(isSelected?: boolean, isDisabled?: boolean) {
  return cn(
    'px-3 py-2 text-sm cursor-pointer truncate',
    isSelected ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent',
    isDisabled && 'cursor-not-allowed opacity-50 pointer-events-none',
  );
}
