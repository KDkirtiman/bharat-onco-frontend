import * as styles from './Checkbox.styles';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'bfd-icons';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={styles.style1}>
        <div className={styles.style2}>
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={styles.style3}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={styles.style4}
          >
            <Check className={styles.style5} />
          </label>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className={styles.style6}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
