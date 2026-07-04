import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'field-textarea text-sm resize-none',
          error && 'border-destructive focus:ring-destructive/20',
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
