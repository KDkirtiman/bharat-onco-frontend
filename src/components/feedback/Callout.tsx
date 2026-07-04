import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

const variants = {
  warning: {
    container: 'bg-amber-50 border-amber-200',
    icon: 'text-amber-600',
    title: 'text-amber-800',
    body: 'text-amber-700',
    sub: 'text-amber-600',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-800',
    body: 'text-blue-700',
    sub: 'text-blue-600',
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    title: 'text-green-800',
    body: 'text-green-700',
    sub: 'text-green-600',
  },
  destructive: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-800',
    body: 'text-red-700',
    sub: 'text-red-600',
  },
} as const;

export type CalloutVariant = keyof typeof variants;

interface CalloutProps {
  variant?: CalloutVariant;
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export function Callout({
  variant = 'warning',
  icon,
  title,
  children,
  subtitle,
  className,
}: CalloutProps) {
  const styles = variants[variant];

  return (
    <div
      className={cn(
        'border rounded-lg px-4 py-3 flex gap-3',
        styles.container,
        className,
      )}
    >
      {icon && (
        <span className={cn('shrink-0 mt-0.5', styles.icon)}>{icon}</span>
      )}
      <div className="min-w-0">
        {title && (
          <p className={cn('text-sm font-semibold', styles.title)}>{title}</p>
        )}
        {children && (
          <div className={cn('text-sm mt-0.5', styles.body)}>{children}</div>
        )}
        {subtitle && (
          <p className={cn('text-xs mt-0.5', styles.sub)}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
