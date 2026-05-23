import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './list.module.css';

export type ListItemProps = HTMLAttributes<HTMLLIElement> & {
  leading?: ReactNode;
  trailing?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
};

export function ListItem({
  leading,
  trailing,
  description,
  className,
  children,
  ...rest
}: ListItemProps) {
  return (
    <li {...rest} className={cn(styles.item, className)}>
      {leading ? <span className={styles.leading}>{leading}</span> : null}
      <span className={styles.content}>
        <span className={styles.title}>{children}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
      {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
    </li>
  );
}

export type ListProps = HTMLAttributes<HTMLUListElement> & {
  variant?: 'plain' | 'bordered' | 'divided';
  children: ReactNode;
};

export function List({ variant = 'plain', className, children, ...rest }: ListProps) {
  return (
    <ul {...rest} className={cn(styles.list, styles[variant], className)}>
      {children}
    </ul>
  );
}

List.Item = ListItem;
