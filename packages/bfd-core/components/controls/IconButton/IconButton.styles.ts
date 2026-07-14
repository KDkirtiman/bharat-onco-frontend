import { cn } from '../../../lib/cn';

const base = 'rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0';

export function iconButtonClass(size: 'sm' | 'md', className?: string) {
  return cn(base, size === 'sm' ? 'p-1' : 'p-1.5', className);
}

