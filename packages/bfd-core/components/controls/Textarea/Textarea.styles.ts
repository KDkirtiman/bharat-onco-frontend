import { cn } from '../../../lib/cn';

export function textareaClass(error?: boolean, className?: string) {
  return cn(
    'field-textarea text-sm resize-none',
    error && 'border-destructive focus:ring-destructive/20',
    className,
  );
}
