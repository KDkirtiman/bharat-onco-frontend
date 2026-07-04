import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  icon?: ReactNode;
  error?: boolean;
  fieldSize?: 'default' | 'sm';
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ icon, error, fieldSize = 'default', className, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            fieldSize === 'sm' ? 'field-input-sm' : 'field-input',
            'text-sm',
            icon && 'pl-9',
            error && 'border-destructive focus:ring-destructive/20',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

TextField.displayName = 'TextField';
