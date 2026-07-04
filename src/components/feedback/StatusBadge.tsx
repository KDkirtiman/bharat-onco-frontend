import { cn } from '../../lib/cn';
import { APPOINTMENT_STATUS_CONFIG } from '../../datapoints/scheduling';

export function StatusBadge({ status }: { status: string }) {
  const cfg = APPOINTMENT_STATUS_CONFIG[status] ?? { label: status, className: 'bg-muted text-muted-foreground' };
  return (
    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap', cfg.className)}>
      {cfg.label}
    </span>
  );
}
