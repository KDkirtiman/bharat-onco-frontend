import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'bfd-icons';
import * as styles from './Button.styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: styles.ButtonVariant;
  size?: styles.ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={styles.buttonClass(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className={styles.loaderIcon} />}
      {children}
    </button>
  );
}
