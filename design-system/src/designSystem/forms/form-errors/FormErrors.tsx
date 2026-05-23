import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

import styles from './formErrors.module.css';

export type FormErrorItem = {
  field: string;
  message: string;
};

export type FormErrorsProps = HTMLAttributes<HTMLDivElement> & {
  errors: FormErrorItem[];
};

export function FormErrors({ errors, className, ...rest }: FormErrorsProps) {
  if (errors.length === 0) return null;

  return (
    <div
      {...rest}
      role="alert"
      className={cn(styles.root, className)}
    >
      <p className={styles.title}>Please fix the following errors:</p>
      <ul className={styles.list}>
        {errors.map((error) => (
          <li key={`${error.field}-${error.message}`} className={styles.item}>
            <span className={styles.field}>{error.field}</span>
            <span className={styles.message}>{error.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
