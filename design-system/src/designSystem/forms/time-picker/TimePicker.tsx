import type { InputHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './timePicker.module.css';

export type TimePickerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  step?: number;
  error?: string;
};

export function TimePicker({
  value,
  defaultValue = '',
  onValueChange,
  label,
  step = 60,
  error,
  disabled,
  className,
  id,
  ...rest
}: TimePickerProps) {
  const inputId = useStableId('ds-time-picker');
  const resolvedId = id ?? inputId;

  const [selected, setSelected] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <label className={cn(styles.root, className)} htmlFor={resolvedId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input
        {...rest}
        id={resolvedId}
        type="time"
        step={step}
        disabled={disabled}
        value={selected ?? ''}
        onChange={(e) => setSelected(e.target.value)}
        className={cn(styles.input, error && styles.error, disabled && styles.disabled)}
        aria-invalid={error ? true : undefined}
      />
      {error ? (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
