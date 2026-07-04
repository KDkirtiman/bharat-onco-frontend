import { cn } from '../../lib/cn';

export interface FilterToggleOption<T extends string> {
  value: T;
  label: string;
}

interface FilterToggleProps<T extends string> {
  value: T;
  options: FilterToggleOption<T>[] | readonly FilterToggleOption<T>[];
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Pill-style segmented control used for period/date filters across dashboards
 * and billing (e.g. Today / Month to Date / Overall, or Today / Week / Month / Year).
 */
export function FilterToggle<T extends string>({
  value,
  options,
  onChange,
  size = 'sm',
  className,
}: FilterToggleProps<T>) {
  const pad = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm';
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'font-medium rounded-full transition-colors',
            pad,
            value === opt.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
