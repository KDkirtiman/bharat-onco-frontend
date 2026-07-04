import type { HTMLAttributes, ReactNode } from 'react';

import { MutedText } from '../typography/Typography';

import styles from './pageHeader.module.css';

export type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right side: buttons, links, etc. */
  actions?: ReactNode;
  as?: 'header' | 'div';
};

export function PageHeader({
  title,
  subtitle,
  actions,
  as: Tag = 'header',
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <Tag {...rest} className={[styles.root, className ?? ''].join(' ')}>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <MutedText className={styles.subtitle}>{subtitle}</MutedText> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </Tag>
  );
}
