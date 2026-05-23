import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

import styles from './banner.module.css';

export type BannerTone = 'success' | 'warning' | 'danger' | 'info';

export type BannerProps = HTMLAttributes<HTMLDivElement> & {
  tone?: BannerTone;
  dismissible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  actions?: ReactNode;
  children: ReactNode;
};

export function Banner({
  tone = 'info',
  dismissible = false,
  open,
  defaultOpen = true,
  onOpenChange,
  actions,
  className,
  children,
  ...rest
}: BannerProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  if (!isOpen) return null;

  return (
    <div {...rest} role="status" className={cn(styles.banner, styles[tone], className)}>
      <div className={styles.content}>{children}</div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
      {dismissible ? (
        <button
          type="button"
          className={styles.dismiss}
          onClick={() => setOpen(false)}
          aria-label="Dismiss banner"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
