import type { InputHTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './checkbox.module.css';

export type CheckboxSize = 'sm' | 'md';

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'checked' | 'defaultChecked' | 'onChange'
> & {
  size?: CheckboxSize;
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({
  size = 'md',
  label,
  checked,
  defaultChecked,
  indeterminate = false,
  onCheckedChange,
  disabled,
  id,
  className,
  ...rest
}: CheckboxProps) {
  const inputId = useStableId('ds-checkbox');
  const resolvedId = id ?? inputId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked ?? false,
    onChange: onCheckedChange,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={cn(
        styles.root,
        styles[size],
        disabled && styles.disabled,
        className,
      )}
    >
      <span className={styles.control}>
        <input
          {...rest}
          ref={inputRef}
          id={resolvedId}
          type="checkbox"
          className={styles.input}
          checked={isChecked}
          disabled={disabled}
          onChange={(event) => setIsChecked(event.target.checked)}
        />
        <span className={styles.indicator} aria-hidden="true">
          {indeterminate ? (
            <span className={styles.indeterminateMark} />
          ) : isChecked ? (
            <svg viewBox="0 0 12 10" className={styles.checkIcon}>
              <path d="M1 5.5L4.5 9 11 1" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : null}
        </span>
      </span>
      {label ? (
        <span className={styles.label}>{label}</span>
      ) : null}
    </label>
  );
}
