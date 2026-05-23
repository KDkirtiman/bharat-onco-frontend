import { useCallback, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './amountField.module.css';

export type AmountFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  currency?: string;
  locale?: string;
  label?: string;
  min?: number;
  max?: number;
  error?: string;
};

function formatAmount(value: number, locale: string, currency: string) {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function AmountField({
  value,
  defaultValue = 0,
  onValueChange,
  currency = 'INR',
  locale = 'en-IN',
  label,
  min,
  max,
  error,
  disabled,
  className,
  id,
  ...rest
}: AmountFieldProps) {
  const inputId = useStableId('ds-amount-field');
  const resolvedId = id ?? inputId;

  const [amount, setAmount] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const handleChange = useCallback(
    (raw: string) => {
      let next = parseAmount(raw);
      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);
      setAmount(next);
    },
    [max, min, setAmount],
  );

  return (
    <label className={cn(styles.root, className)} htmlFor={resolvedId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={cn(styles.wrap, error && styles.error, disabled && styles.disabled)}>
        <span className={styles.prefix} aria-hidden="true">
          {currency}
        </span>
        <input
          {...rest}
          id={resolvedId}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          value={formatAmount(amount ?? 0, locale, currency)}
          onChange={(e) => handleChange(e.target.value)}
          className={styles.input}
          aria-invalid={error ? true : undefined}
        />
      </span>
      {error ? (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
