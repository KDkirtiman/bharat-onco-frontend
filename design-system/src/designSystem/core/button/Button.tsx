import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Applied when nested in {@link InputGroup} */
  grouped?: 'single' | 'first' | 'middle' | 'last';
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  startIcon,
  endIcon,
  grouped,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      {...rest}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        grouped && styles.grouped,
        grouped && styles[`grouped_${grouped}`],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
    >
      {startIcon ? <span className={styles.icon} aria-hidden="true">{startIcon}</span> : null}
      <span className={styles.content}>{children}</span>
      {endIcon ? <span className={styles.icon} aria-hidden="true">{endIcon}</span> : null}
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
    </button>
  );
}
