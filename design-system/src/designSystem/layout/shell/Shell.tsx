import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './shell.module.css';

export type ShellProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export function Shell({ header, sidebar, footer, className, children, ...rest }: ShellProps) {
  return (
    <div {...rest} className={cn(styles.root, className)}>
      {header}
      <div className={styles.body}>
        {sidebar ? <aside className={styles.sidebar}>{sidebar}</aside> : null}
        <main className={styles.main}>{children}</main>
      </div>
      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </div>
  );
}
