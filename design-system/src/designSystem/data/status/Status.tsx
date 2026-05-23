import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './status.module.css';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type StatusVariant = 'dot' | 'badge';

export type StatusProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
  variant?: StatusVariant;
  label?: ReactNode;
  children?: ReactNode;
};

export function Status({
  tone = 'neutral',
  variant = 'badge',
  label,
  children,
  className,
  ...rest
}: StatusProps) {
  const content = children ?? label;
  return (
    <span
      {...rest}
      className={cn(styles.status, styles[tone], styles[variant], className)}
      role="status"
    >
      <span className={styles.indicator} aria-hidden="true" />
      {content ? <span className={styles.text}>{content}</span> : null}
    </span>
  );
}
