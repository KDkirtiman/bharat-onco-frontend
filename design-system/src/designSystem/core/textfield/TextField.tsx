import type { InputHTMLAttributes, ReactNode } from 'react';
import { useCallback } from 'react';

import { cn } from '../../utils/cn';
import { useStableId } from '../../utils/useStableId';

import styles from './textfield.module.css';

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  helperText?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  inputClassName?: string;
  /** Applied when nested in {@link InputGroup} */
  grouped?: 'single' | 'first' | 'middle' | 'last';
};

export function TextField({
  label,
  helperText,
  error,
  startAdornment,
  endAdornment,
  clearable = false,
  onClear,
  id,
  className,
  inputClassName,
  grouped,
  value,
  defaultValue,
  onChange,
  ...rest
}: TextFieldProps) {
  const inputId = useStableId('ds-textfield');
  const resolvedId = id ?? inputId;
  const describedBy = error ? `${resolvedId}-error` : helperText ? `${resolvedId}-help` : undefined;

  const showClear =
    clearable &&
    !rest.disabled &&
    !rest.readOnly &&
    (value !== undefined ? String(value).length > 0 : false);

  const handleClear = useCallback(() => {
    onClear?.();
    onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  }, [onClear, onChange]);

  return (
    <label className={cn(styles.root, grouped && styles.groupedRoot, className)}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span
        className={cn(
          styles.inputWrap,
          error && styles.error,
          grouped && styles.groupedWrap,
          grouped && styles[`grouped_${grouped}`],
        )}
      >
        {startAdornment ? (
          <span className={styles.adornment} aria-hidden="true">
            {startAdornment}
          </span>
        ) : null}
        <input
          {...rest}
          id={resolvedId}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          className={cn(styles.input, inputClassName)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        {showClear ? (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear input"
          >
            ×
          </button>
        ) : null}
        {endAdornment ? (
          <span className={styles.adornment} aria-hidden="true">
            {endAdornment}
          </span>
        ) : null}
      </span>
      {error ? (
        <span id={`${resolvedId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={`${resolvedId}-help`} className={styles.helperText}>
          {helperText}
        </span>
      ) : null}
    </label>
  );
}
