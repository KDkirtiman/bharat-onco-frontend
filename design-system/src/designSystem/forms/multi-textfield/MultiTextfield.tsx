import { useCallback, useState, type HTMLAttributes, type KeyboardEvent } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './multiTextfield.module.css';

export type MultiTextfieldProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  maxItems?: number;
  disabled?: boolean;
  error?: string;
};

export function MultiTextfield({
  value,
  defaultValue = [],
  onValueChange,
  label,
  placeholder = 'Type and press Enter',
  maxItems,
  disabled = false,
  error,
  className,
  ...rest
}: MultiTextfieldProps) {
  const inputId = useStableId('ds-multi-textfield');
  const [items, setItems] = useControllableState<string[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [draft, setDraft] = useState('');

  const addItem = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const current = items ?? [];
      if (maxItems !== undefined && current.length >= maxItems) return;
      if (current.includes(trimmed)) return;
      setItems([...current, trimmed]);
      setDraft('');
    },
    [items, maxItems, setDraft, setItems],
  );

  const removeItem = (index: number) => {
    const current = items ?? [];
    setItems(current.filter((_, i) => i !== index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addItem(draft ?? '');
    } else if (event.key === 'Backspace' && !(draft ?? '') && (items ?? []).length > 0) {
      removeItem((items ?? []).length - 1);
    }
  };

  return (
    <div {...rest} className={cn(styles.root, className)}>
      {label ? (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <div
        className={cn(styles.field, error && styles.error, disabled && styles.disabled)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      >
        {(items ?? []).map((item, index) => (
          <span key={`${item}-${index}`} className={styles.chip}>
            {item}
            {!disabled ? (
              <button
                type="button"
                className={styles.chipRemove}
                onClick={() => removeItem(index)}
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            ) : null}
          </span>
        ))}
        {!disabled && (maxItems === undefined || (items ?? []).length < maxItems) ? (
          <input
            id={inputId}
            type="text"
            value={draft ?? ''}
            placeholder={(items ?? []).length === 0 ? placeholder : ''}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input}
            aria-label={label ?? 'Add value'}
          />
        ) : null}
      </div>
      {error ? (
        <span id={`${inputId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
