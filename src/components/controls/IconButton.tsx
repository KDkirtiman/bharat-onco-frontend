import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

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
      className={cn(
        'rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0',
        size === 'sm' ? 'p-1' : 'p-1.5',
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
