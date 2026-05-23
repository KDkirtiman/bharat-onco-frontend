import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { Select, SelectItem } from '../select/Select';

import styles from './dualSelect.module.css';

export type DualSelectOption = { value: string; label: string; disabled?: boolean };

export type DualSelectProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  leftOptions: DualSelectOption[];
  rightOptions: DualSelectOption[];
  leftValue?: string;
  rightValue?: string;
  defaultLeftValue?: string;
  defaultRightValue?: string;
  onLeftChange?: (value: string) => void;
  onRightChange?: (value: string) => void;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
};

export function DualSelect({
  leftOptions,
  rightOptions,
  leftValue,
  rightValue,
  defaultLeftValue = '',
  defaultRightValue = '',
  onLeftChange,
  onRightChange,
  leftLabel = 'From',
  rightLabel = 'To',
  disabled = false,
  className,
  ...rest
}: DualSelectProps) {
  const [left, setLeft] = useControllableState({
    value: leftValue,
    defaultValue: defaultLeftValue,
    onChange: onLeftChange,
  });
  const [right, setRight] = useControllableState({
    value: rightValue,
    defaultValue: defaultRightValue,
    onChange: onRightChange,
  });

  return (
    <div {...rest} className={cn(styles.root, className)} role="group" aria-label="Dual select">
      <div className={styles.field}>
        <span className={styles.label}>{leftLabel}</span>
        <Select
          value={left}
          onValueChange={(v) => setLeft(String(v))}
          disabled={disabled}
          placeholder="Select…"
          aria-label={leftLabel}
        >
          {leftOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <span className={styles.separator} aria-hidden="true">
        →
      </span>
      <div className={styles.field}>
        <span className={styles.label}>{rightLabel}</span>
        <Select
          value={right}
          onValueChange={(v) => setRight(String(v))}
          disabled={disabled}
          placeholder="Select…"
          aria-label={rightLabel}
        >
          {rightOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
