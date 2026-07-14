import * as styles from './StatusBadge.styles';

export function StatusBadge({ status }: { status: string }) {
  const { label, className } = styles.statusBadgeClass(status);
  return <span className={className}>{label}</span>;
}
