import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './message.module.css';

export type MessageTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type MessageProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: MessageTone;
  children: ReactNode;
};

export function Message({ tone = 'neutral', className, children, ...rest }: MessageProps) {
  return (
    <span
      {...rest}
      role={tone === 'danger' ? 'alert' : undefined}
      className={cn(styles.message, styles[tone], className)}
    >
      {children}
    </span>
  );
}
