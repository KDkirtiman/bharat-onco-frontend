import type { ReactNode } from 'react';
import type { CalloutVariant } from './Callout.styles';
import * as styles from './Callout.styles';

export type { CalloutVariant };

interface CalloutProps {
  variant?: CalloutVariant;
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export function Callout({
  variant = 'warning',
  icon,
  title,
  children,
  subtitle,
  className,
}: CalloutProps) {
  return (
    <div className={styles.calloutRoot(variant, className)}>
      {icon && <span className={styles.calloutIcon(variant)}>{icon}</span>}
      <div className={styles.calloutContent}>
        {title && <p className={styles.calloutTitle(variant)}>{title}</p>}
        {children && <div className={styles.calloutBody(variant)}>{children}</div>}
        {subtitle && <p className={styles.calloutSubtitle(variant)}>{subtitle}</p>}
      </div>
    </div>
  );
}
