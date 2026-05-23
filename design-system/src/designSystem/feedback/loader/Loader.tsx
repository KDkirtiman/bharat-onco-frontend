import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

import styles from './loader.module.css';

export type LoaderSize = 'sm' | 'md' | 'lg';
export type LoaderVariant = 'spinner' | 'linear';

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  variant?: LoaderVariant;
  size?: LoaderSize;
  label?: string;
};

export function Loader({
  variant = 'spinner',
  size = 'md',
  label = 'Loading',
  className,
  ...rest
}: LoaderProps) {
  if (variant === 'linear') {
    return (
      <div
        {...rest}
        role="progressbar"
        aria-label={label}
        aria-busy="true"
        className={cn(styles.linear, styles[`linear-${size}`], className)}
      >
        <span className={styles.linearBar} />
      </div>
    );
  }

  return (
    <div
      {...rest}
      role="status"
      aria-label={label}
      aria-busy="true"
      className={cn(styles.spinner, styles[size], className)}
    />
  );
}
