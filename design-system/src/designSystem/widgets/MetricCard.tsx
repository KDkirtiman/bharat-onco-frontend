import type { HTMLAttributes, ReactNode } from 'react';

import styles from './widgets.module.css';

export type MetricCardProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  value: ReactNode;
  footer?: ReactNode;
  /** e.g. decorative icon corner */
  adornment?: ReactNode;
};

export function MetricCard({ title, value, footer, adornment, className, ...rest }: MetricCardProps) {
  return (
    <div {...rest} className={[styles.metric, className ?? ''].join(' ')}>
      <div className={styles.metricTop}>
        <span className={styles.metricTitle}>{title}</span>
        {adornment ? <span className={styles.metricAdornment}>{adornment}</span> : null}
      </div>
      <div className={styles.metricValue}>{value}</div>
      {footer ? <div className={styles.metricFooter}>{footer}</div> : null}
    </div>
  );
}
