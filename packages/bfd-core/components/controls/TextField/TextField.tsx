import * as styles from './TextField.styles';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';


interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  icon?: ReactNode;
  error?: boolean;
  fieldSize?: 'default' | 'sm';
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ icon, error, fieldSize = 'default', className, ...props }, ref) => {
    return (
      <div className={styles.style1}>
        {icon && (
          <span className={styles.style2}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={styles.textFieldInputClass(fieldSize, !!icon, error, className)}
          {...props}
        />
      </div>
    );
  },
);

TextField.displayName = 'TextField';
