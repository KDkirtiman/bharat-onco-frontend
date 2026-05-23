import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './actionBar.module.css';

export type ActionBarProps = HTMLAttributes<HTMLDivElement> & {
  sticky?: boolean;
  children: ReactNode;
};

export function ActionBar({ sticky = true, className, children, ...rest }: ActionBarProps) {
  return (
    <div {...rest} className={cn(styles.root, sticky && styles.sticky, className)} role="toolbar">
      {children}
    </div>
  );
}
