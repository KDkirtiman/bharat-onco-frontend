import type { LabelHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './label.module.css';

export type LabelSize = 'sm' | 'md';

export type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> & {
  /** Associates with a labelable control. Omit when the field uses `aria-labelledby` (e.g. custom Select). */
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  size?: LabelSize;
  children: ReactNode;
};

export function Label({
  htmlFor,
  required = false,
  hint,
  size = 'md',
  className,
  children,
  ...rest
}: LabelProps) {
  return (
    <label
      {...rest}
      htmlFor={htmlFor}
      className={cn(styles.root, styles[size], className)}
    >
      <span className={styles.text}>
        {children}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}
