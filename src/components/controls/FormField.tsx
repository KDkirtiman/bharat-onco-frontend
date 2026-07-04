import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface FormFieldProps {
  label: ReactNode;
  required?: boolean;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
  labelVariant?: 'default' | 'uppercase';
  htmlFor?: string;
}

export function FormField({
  label,
  required,
  optional,
  hint,
  error,
  children,
  className,
  labelVariant = 'default',
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className={cn(
          labelVariant === 'uppercase'
            ? 'block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5'
            : 'block text-sm font-medium text-foreground mb-1',
        )}
      >
        {label}
        {required && <span className="text-destructive">{labelVariant === 'uppercase' ? ' *' : ' *'}</span>}
        {optional && (
          <span className="text-xs text-muted-foreground font-normal ml-2">(optional)</span>
        )}
        {hint && (
          <span className="text-xs text-muted-foreground font-normal ml-2">{hint}</span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
