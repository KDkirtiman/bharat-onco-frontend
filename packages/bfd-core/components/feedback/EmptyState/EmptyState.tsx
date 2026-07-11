import * as styles from './EmptyState.styles';
interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={styles.style1Class(className)}>
      <p className={styles.style2}>{title}</p>
      {description && (
        <p className={styles.style3}>{description}</p>
      )}
    </div>
  );
}
