import { useRef, useState, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { ClickAwayListener } from '../../utils/ClickAwayListener';
import { Portal } from '../../utils/Portal';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './datePicker.module.css';

export type DatePickerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  min?: string;
  max?: string;
  error?: string;
};

export function DatePicker({
  value,
  defaultValue = '',
  onValueChange,
  label,
  min,
  max,
  error,
  disabled,
  className,
  id,
  ...rest
}: DatePickerProps) {
  const inputId = useStableId('ds-date-picker');
  const resolvedId = id ?? inputId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const [selected, setSelected] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const displayValue = selected
    ? new Date(selected + 'T00:00:00').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Select date';

  const openCalendar = () => {
    if (disabled) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) setPosition({ top: rect.bottom + 4, left: rect.left });
    setOpen(true);
  };

  return (
    <div className={cn(styles.root, className)}>
      {label ? (
        <label htmlFor={resolvedId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <button
        ref={triggerRef}
        type="button"
        id={resolvedId}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(styles.trigger, error && styles.error, disabled && styles.disabled)}
        onClick={() => (open ? setOpen(false) : openCalendar())}
      >
        <span className={cn(!selected && styles.placeholder)}>{displayValue}</span>
        <span aria-hidden="true">📅</span>
      </button>
      {error ? (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      ) : null}
      {open ? (
        <Portal>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div
              className={styles.popover}
              style={{ position: 'fixed', top: position.top, left: position.left }}
              role="dialog"
              aria-label="Choose date"
            >
              <input
                {...rest}
                type="date"
                min={min}
                max={max}
                value={selected ?? ''}
                onChange={(e) => {
                  setSelected(e.target.value);
                  setOpen(false);
                }}
                className={styles.nativeInput}
              />
            </div>
          </ClickAwayListener>
        </Portal>
      ) : null}
    </div>
  );
}
