import { cn } from '../../../lib/cn';
import { APPOINTMENT_STATUS_CONFIG } from '../../../datapoints/scheduling';

export function statusBadgeClass(status: string) {
  const cfg = APPOINTMENT_STATUS_CONFIG[status] ?? { label: status, className: 'bg-muted text-muted-foreground' };
  return { label: cfg.label, className: cn('text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap', cfg.className) };
}
