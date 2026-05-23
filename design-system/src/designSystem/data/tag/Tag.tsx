import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './tag.module.css';

export type TagTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type TagSize = 'sm' | 'md';

export type TagProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  tone?: TagTone;
  size?: TagSize;
  removable?: boolean;
  onRemove?: () => void;
  children: ReactNode;
};

export function Tag({
  tone = 'neutral',
  size = 'md',
  removable = false,
  onRemove,
  className,
  children,
  ...rest
}: TagProps) {
  return (
    <span {...rest} className={cn(styles.tag, styles[tone], styles[size], className)}>
      <span className={styles.label}>{children}</span>
      {removable ? (
        <button type="button" className={styles.remove} onClick={onRemove} aria-label="Remove tag">
          ×
        </button>
      ) : null}
    </span>
  );
}
