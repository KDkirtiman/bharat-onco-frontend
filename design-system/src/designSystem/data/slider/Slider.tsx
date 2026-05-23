import type { InputHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './slider.module.css';

export type SliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  label?: string;
};

export function Slider({
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = false,
  label,
  disabled,
  className,
  id,
  ...rest
}: SliderProps) {
  const inputId = useStableId('ds-slider');
  const resolvedId = id ?? inputId;

  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const pct = max === min ? 0 : (((current ?? 0) - min) / (max - min)) * 100;

  return (
    <label className={cn(styles.root, className)} htmlFor={resolvedId}>
      {label || showValue ? (
        <span className={styles.header}>
          {label ? <span className={styles.label}>{label}</span> : null}
          {showValue ? <span className={styles.value}>{current}</span> : null}
        </span>
      ) : null}
      <span className={styles.trackWrap}>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.fill} style={{ width: `${pct}%` }} />
        </span>
        <input
          {...rest}
          id={resolvedId}
          type="range"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={current}
          onChange={(e) => setCurrent(Number(e.target.value))}
          className={styles.input}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
        />
      </span>
    </label>
  );
}
