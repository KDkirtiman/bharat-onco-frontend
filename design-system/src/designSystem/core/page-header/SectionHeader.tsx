import type { HTMLAttributes, ReactNode } from 'react';

import styles from './pageHeader.module.css';

export type SectionHeaderProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  /** Right side: "Edit", icon button, etc. */
  actions?: ReactNode;
};

export function SectionHeader({ title, actions, className, ...rest }: SectionHeaderProps) {
  return (
    <div {...rest} className={[styles.sectionRoot, className ?? ''].join(' ')}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {actions ? <div className={styles.sectionActions}>{actions}</div> : null}
    </div>
  );
}
