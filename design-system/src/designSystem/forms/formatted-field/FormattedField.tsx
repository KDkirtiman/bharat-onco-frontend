import { useCallback, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './formattedField.module.css';

export type FormattedFieldMask = 'phone' | 'pan' | 'aadhaar' | 'custom';

export type FormattedFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange'
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  mask?: FormattedFieldMask;
  customPattern?: RegExp;
  customFormat?: (raw: string) => string;
  label?: string;
  error?: string;
};

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

function formatPan(raw: string) {
  return raw
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 10)
    .toUpperCase();
}

function formatAadhaar(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function applyMask(
  raw: string,
  mask: FormattedFieldMask,
  customFormat?: (raw: string) => string,
): string {
  switch (mask) {
    case 'phone':
      return formatPhone(raw);
    case 'pan':
      return formatPan(raw);
    case 'aadhaar':
      return formatAadhaar(raw);
    case 'custom':
      return customFormat?.(raw) ?? raw;
    default:
      return raw;
  }
}

export function FormattedField({
  value,
  defaultValue = '',
  onValueChange,
  mask = 'phone',
  customPattern,
  customFormat,
  label,
  error,
  disabled,
  className,
  id,
  placeholder,
  ...rest
}: FormattedFieldProps) {
  const inputId = useStableId('ds-formatted-field');
  const resolvedId = id ?? inputId;

  const [formatted, setFormatted] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const handleChange = useCallback(
    (raw: string) => {
      const next = applyMask(raw, mask, customFormat);
      setFormatted(next);
    },
    [customFormat, mask, setFormatted],
  );

  const placeholders: Record<FormattedFieldMask, string> = {
    phone: '987 654 3210',
    pan: 'ABCDE1234F',
    aadhaar: '1234 5678 9012',
    custom: 'Enter value',
  };

  return (
    <label className={cn(styles.root, className)} htmlFor={resolvedId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input
        {...rest}
        id={resolvedId}
        type="text"
        disabled={disabled}
        value={formatted ?? ''}
        placeholder={placeholder ?? placeholders[mask]}
        onChange={(e) => handleChange(e.target.value)}
        pattern={customPattern?.source}
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
