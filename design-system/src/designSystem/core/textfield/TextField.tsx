import type { InputHTMLAttributes } from 'react';

import styles from './textfield.module.css';

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  helperText?: string;
  error?: string;
  startAdornment?: string;
};

export function TextField({ label, helperText, error, startAdornment, id, className, ...rest }: TextFieldProps) {
  const inputId = id ?? `ds-textfield-${Math.random().toString(36).slice(2)}`;
  const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined;

  return (
    <label className={[styles.root, className ?? ''].join(' ')}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={[styles.inputWrap, error ? styles.error : ''].join(' ')}>
        {startAdornment ? <span className={styles.startAdornment} aria-hidden="true">{startAdornment}</span> : null}
        <input
          {...rest}
          id={inputId}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      </span>
      {error ? (
        <span id={`${inputId}-error`} className={styles.errorText}>
          {error}
        </span>
      ) : helperText ? (
        <span id={`${inputId}-help`} className={styles.helperText}>
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

