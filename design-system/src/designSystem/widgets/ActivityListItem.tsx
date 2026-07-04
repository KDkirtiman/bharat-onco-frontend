import type { HTMLAttributes } from 'react';

import styles from './widgets.module.css';

export type ActivityListItemProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  meta: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
};

export function ActivityListItem({
  title,
  meta,
  tone = 'default',
  className,
  ...rest
}: ActivityListItemProps) {
  return (
    <div {...rest} className={[styles.activityRow, className ?? ''].join(' ')}>
      <span className={[styles.dot, styles[`tone_${tone}`]].join(' ')} aria-hidden />
      <div className={styles.activityText}>
        <div className={styles.activityTitle}>{title}</div>
        <div className={styles.activityMeta}>{meta}</div>
      </div>
    </div>
  );
}
