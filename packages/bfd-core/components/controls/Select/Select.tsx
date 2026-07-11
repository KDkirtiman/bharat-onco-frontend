import * as styles from './Select.styles';
import { forwardRef, type SelectHTMLAttributes } from 'react';


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
        className={styles.selectClass(fieldSize, error, className)}
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
