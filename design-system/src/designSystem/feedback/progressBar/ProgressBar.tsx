import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

import styles from './progressBar.module.css';

export type ProgressBarProps = HTMLAttributes<HTMLDivElement> & {
  value?: number;
  indeterminate?: boolean;
  label?: string;
  showLabel?: boolean;
};

export function ProgressBar({
  value = 0,
  indeterminate = false,
  label,
  showLabel = false,
  className,
  ...rest
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const displayLabel = label ?? `${clamped}%`;

  return (
    <div {...rest} className={cn(styles.root, className)}>
      {showLabel || label ? (
        <div className={styles.labelRow}>
          <span className={styles.label}>{displayLabel}</span>
          {!label && !indeterminate ? (
            <span className={styles.value}>{clamped}%</span>
          ) : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-label={label}
        aria-busy={indeterminate || undefined}
        className={cn(styles.track, indeterminate && styles.indeterminate)}
      >
        {!indeterminate ? (
          <span className={styles.bar} style={{ width: `${clamped}%` }} />
        ) : (
          <span className={styles.indeterminateBar} />
        )}
      </div>
    </div>
  );
}
