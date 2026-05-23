import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { MutedText } from '../typography/Typography';

import styles from './pageHeader.module.css';

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
};

export type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  as?: 'header' | 'div';
};

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumbs,
  as: Tag = 'header',
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <Tag {...rest} className={cn(styles.root, className)}>
      <div className={styles.text}>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((item, i) => (
                <li key={i}>
                  {item.href ? (
                    <a href={item.href} onClick={item.onClick}>
                      {item.label}
                    </a>
                  ) : (
                    <button type="button" className={styles.crumbBtn} onClick={item.onClick}>
                      {item.label}
                    </button>
                  )}
                  {i < breadcrumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <MutedText className={styles.subtitle}>{subtitle}</MutedText> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </Tag>
  );
}
