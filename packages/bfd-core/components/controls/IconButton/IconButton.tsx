import * as styles from './IconButton.styles';
import type { ButtonHTMLAttributes, ReactNode } from 'react';


interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  size?: 'sm' | 'md';
}

export function IconButton({
  icon,
  label,
  size = 'md',
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={styles.iconButtonClass(size, className)}
      {...props}
    >
      {icon}
    </button>
  );
}
