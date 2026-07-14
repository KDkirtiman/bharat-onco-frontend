import * as styles from './FormField.styles';
import type { ReactNode } from 'react';


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
        className={styles.formFieldLabelClass(labelVariant)}
      >
        {label}
        {required && <span className={styles.style1}>{labelVariant === 'uppercase' ? ' *' : ' *'}</span>}
        {optional && (
          <span className={styles.style2}>(optional)</span>
        )}
        {hint && (
          <span className={styles.style2}>{hint}</span>
        )}
      </label>
      {children}
      {error && <p className={styles.style3}>{error}</p>}
    </div>
  );
}
