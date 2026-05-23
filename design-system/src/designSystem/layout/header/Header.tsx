import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './header.module.css';

export type HeaderProps = HTMLAttributes<HTMLElement> & {
  logo?: ReactNode;
  nav?: ReactNode;
  actions?: ReactNode;
};

export function Header({ logo, nav, actions, className, ...rest }: HeaderProps) {
  return (
    <header {...rest} className={cn(styles.root, className)}>
      {logo ? <div className={styles.logo}>{logo}</div> : null}
      {nav ? <nav className={styles.nav} aria-label="Primary">{nav}</nav> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
