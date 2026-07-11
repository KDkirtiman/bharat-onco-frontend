import type { ReactNode } from 'react';
import { Button } from '../../controls/Button';
import * as styles from './ResultState.styles';

interface ResultStateProps {
  icon: ReactNode;
  title: string;
  summary?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  iconClassName?: string;
  className?: string;
}

export function ResultState({
  icon,
  title,
  summary,
  actionLabel = 'Done',
  onAction,
  iconClassName,
  className,
}: ResultStateProps) {
  return (
    <div className={styles.style1Class(className)}>
      <div className={styles.style2Class(iconClassName)}>{icon}</div>
      <h3 className={styles.style3}>{title}</h3>
      {summary && <div className={styles.style4}>{summary}</div>}
      {onAction && (
        <Button className={styles.style5} size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
