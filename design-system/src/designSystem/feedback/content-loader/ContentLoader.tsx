import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

import styles from './contentLoader.module.css';

export type ContentLoaderProps = HTMLAttributes<HTMLDivElement> & {
  lines?: number;
  variant?: 'text' | 'card' | 'avatar';
  animated?: boolean;
};

export function ContentLoader({
  lines = 3,
  variant = 'text',
  animated = true,
  className,
  ...rest
}: ContentLoaderProps) {
  if (variant === 'avatar') {
    return (
      <div {...rest} className={cn(styles.root, className)} aria-busy="true" aria-label="Loading">
        <span className={cn(styles.avatar, animated && styles.shimmer)} />
        <div className={styles.avatarText}>
          <span className={cn(styles.line, styles.short, animated && styles.shimmer)} />
          <span className={cn(styles.line, styles.medium, animated && styles.shimmer)} />
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        {...rest}
        className={cn(styles.card, animated && styles.shimmer, className)}
        aria-busy="true"
        aria-label="Loading"
      />
    );
  }

  return (
    <div {...rest} className={cn(styles.root, className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className={cn(
            styles.line,
            i === lines - 1 && styles.short,
            animated && styles.shimmer,
          )}
        />
      ))}
    </div>
  );
}
