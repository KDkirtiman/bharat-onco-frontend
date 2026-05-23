import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { DatePicker } from '../date-picker/DatePicker';

import styles from './hybridDateRangeSelector.module.css';

export type DateRangePreset = {
  id: string;
  label: string;
  start: string;
  end: string;
};

export type HybridDateRangeSelectorProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  start?: string;
  end?: string;
  defaultStart?: string;
  defaultEnd?: string;
  onRangeChange?: (range: { start: string; end: string }) => void;
  presets?: DateRangePreset[];
  label?: string;
  disabled?: boolean;
};

const defaultPresets: DateRangePreset[] = [
  {
    id: '7d',
    label: 'Last 7 days',
    start: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
  },
  {
    id: '30d',
    label: 'Last 30 days',
    start: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
  },
  {
    id: '90d',
    label: 'Last 90 days',
    start: new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
  },
];

export function HybridDateRangeSelector({
  start,
  end,
  defaultStart = '',
  defaultEnd = '',
  onRangeChange,
  presets = defaultPresets,
  label = 'Date range',
  disabled = false,
  className,
  ...rest
}: HybridDateRangeSelectorProps) {
  const [startDate, setStartDate] = useControllableState({
    value: start,
    defaultValue: defaultStart,
  });
  const [endDate, setEndDate] = useControllableState({
    value: end,
    defaultValue: defaultEnd,
  });

  const updateRange = (nextStart: string, nextEnd: string) => {
    setStartDate(nextStart);
    setEndDate(nextEnd);
    onRangeChange?.({ start: nextStart, end: nextEnd });
  };

  return (
    <div {...rest} className={cn(styles.root, className)} role="group" aria-label={label}>
      <span className={styles.label}>{label}</span>
      <div className={styles.presets} role="toolbar" aria-label="Date presets">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            className={styles.presetBtn}
            onClick={() => updateRange(preset.start, preset.end)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className={styles.pickers}>
        <DatePicker
          label="Start"
          value={startDate}
          onValueChange={(v) => updateRange(v, endDate ?? '')}
          disabled={disabled}
        />
        <DatePicker
          label="End"
          value={endDate}
          onValueChange={(v) => updateRange(startDate ?? '', v)}
          disabled={disabled}
          min={startDate}
        />
      </div>
    </div>
  );
}
