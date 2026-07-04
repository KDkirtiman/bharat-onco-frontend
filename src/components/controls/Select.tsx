import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options?: SelectOption[];
  placeholder?: string;
  error?: boolean;
  fieldSize?: 'default' | 'sm';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, fieldSize = 'default', className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          fieldSize === 'sm' ? 'field-select-sm' : 'field-select',
          'text-sm',
          error && 'border-destructive focus:ring-destructive/20',
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );
  },
);

Select.displayName = 'Select';
