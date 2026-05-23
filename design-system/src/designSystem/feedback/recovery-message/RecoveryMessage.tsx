import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './recoveryMessage.module.css';

export type RecoveryMessageProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
  illustration?: ReactNode;
};

export function RecoveryMessage({
  title,
  message,
  action,
  illustration,
  className,
  ...rest
}: RecoveryMessageProps) {
  return (
    <div {...rest} className={cn(styles.root, className)} role="status">
      {illustration ? <div className={styles.illustration}>{illustration}</div> : null}
      <h3 className={styles.title}>{title}</h3>
      {message ? <p className={styles.message}>{message}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
