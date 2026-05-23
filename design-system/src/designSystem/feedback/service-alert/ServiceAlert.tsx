import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

import styles from './serviceAlert.module.css';

export type ServiceAlertTone = 'info' | 'warning' | 'danger';
export type ServiceAlertSeverity = 'low' | 'medium' | 'high';

export type ServiceAlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: ServiceAlertTone;
  severity?: ServiceAlertSeverity;
  title: ReactNode;
  message?: ReactNode;
  dismissible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  actions?: ReactNode;
};

export function ServiceAlert({
  tone = 'info',
  severity = 'medium',
  title,
  message,
  dismissible = true,
  open,
  defaultOpen = true,
  onOpenChange,
  actions,
  className,
  ...rest
}: ServiceAlertProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  if (!isOpen) return null;

  return (
    <div
      {...rest}
      role="alert"
      className={cn(styles.root, styles[tone], styles[severity], className)}
    >
      <div className={styles.content}>
        <strong className={styles.title}>{title}</strong>
        {message ? <p className={styles.message}>{message}</p> : null}
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
      {dismissible ? (
        <button
          type="button"
          className={styles.dismiss}
          onClick={() => setOpen(false)}
          aria-label="Dismiss alert"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
