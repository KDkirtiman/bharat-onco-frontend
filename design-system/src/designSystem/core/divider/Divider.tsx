import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

import styles from './divider.module.css';

export type DividerOrientation = 'horizontal' | 'vertical';

export type DividerProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: DividerOrientation;
  label?: string;
};

export function Divider({
  orientation = 'horizontal',
  label,
  className,
  ...rest
}: DividerProps) {
  if (!label) {
    return (
      <div
        {...rest}
        role="separator"
        aria-orientation={orientation}
        className={cn(styles.root, styles[orientation], className)}
      >
        <span className={styles.line} />
      </div>
    );
  }

  return (
    <div
      {...rest}
      role="separator"
      aria-orientation={orientation}
      className={cn(styles.root, styles[orientation], className)}
    >
      <span className={styles.line} />
      <span className={styles.label}>{label}</span>
      <span className={styles.line} />
    </div>
  );
}
