import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './footer.module.css';

export type FooterProps = HTMLAttributes<HTMLElement> & {
  columns?: ReactNode;
  copyright?: ReactNode;
};

export function Footer({ columns, copyright, className, ...rest }: FooterProps) {
  return (
    <footer {...rest} className={cn(styles.root, className)}>
      {columns ? <div className={styles.columns}>{columns}</div> : null}
      {copyright ? <div className={styles.copyright}>{copyright}</div> : null}
    </footer>
  );
}
