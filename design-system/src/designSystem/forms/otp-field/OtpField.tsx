import {
  useCallback,
  useEffect,
  useRef,
  type ClipboardEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './otpField.module.css';

export type OtpFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange'
> & {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
};

function clampLength(length?: number) {
  if (length === undefined) return 6;
  return Math.min(8, Math.max(4, length));
}

function sanitizeOtp(value: string) {
  return value.replace(/\D/g, '');
}

export function OtpField({
  length: lengthProp,
  value,
  defaultValue,
  onValueChange,
  onComplete,
  disabled,
  id,
  className,
  ...rest
}: OtpFieldProps) {
  const length = clampLength(lengthProp);
  const fieldId = useStableId('ds-otp');
  const resolvedId = id ?? fieldId;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otpValue, setOtpValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });

  const digits = Array.from({ length }, (_, index) => otpValue?.[index] ?? '');

  const previousLengthRef = useRef((otpValue ?? '').length);

  useEffect(() => {
    const normalized = sanitizeOtp(otpValue ?? '').slice(0, length);
    if (normalized !== (otpValue ?? '')) {
      setOtpValue(normalized);
      return;
    }

    const wasComplete = previousLengthRef.current === length;
    previousLengthRef.current = normalized.length;

    if (!wasComplete && normalized.length === length) {
      onComplete?.(normalized);
    }
  }, [length, onComplete, otpValue, setOtpValue]);

  const updateValue = useCallback(
    (next: string) => {
      const normalized = sanitizeOtp(next).slice(0, length);
      setOtpValue(normalized);
    },
    [length, setOtpValue],
  );

  const focusInput = (index: number) => {
    const target = inputRefs.current[index];
    target?.focus();
    target?.select();
  };

  const handleChange = (index: number, nextDigit: string) => {
    const digit = sanitizeOtp(nextDigit).slice(-1);
    const chars = digits.slice();
    chars[index] = digit;
    const next = chars.join('').replace(/\s/g, '');
    updateValue(next);
    if (digit && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = sanitizeOtp(event.clipboardData.getData('text'));
    if (!pasted) return;
    updateValue(pasted);
    const focusIndex = Math.min(pasted.length, length) - 1;
    if (focusIndex >= 0) {
      focusInput(focusIndex);
    }
  };

  return (
    <div
      className={cn(styles.root, className)}
      role="group"
      aria-label={rest['aria-label'] ?? 'One-time passcode'}
    >
      {digits.map((digit, index) => (
        <input
          {...rest}
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node;
          }}
          id={index === 0 ? resolvedId : `${resolvedId}-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          className={styles.input}
          aria-label={`Digit ${index + 1} of ${length}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.currentTarget.select()}
        />
      ))}
    </div>
  );
}
