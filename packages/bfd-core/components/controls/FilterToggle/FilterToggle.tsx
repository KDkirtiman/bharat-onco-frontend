import * as styles from './FilterToggle.styles';
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
    <div className={styles.style1Class(className)}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={styles.filterToggleButtonClass(pad, value === opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
