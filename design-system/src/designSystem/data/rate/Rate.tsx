import { useCallback, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './rate.module.css';

export type RateProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  count?: number;
  allowHalf?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  icon?: ReactNode;
  label?: string;
};

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Rate({
  value,
  defaultValue = 0,
  onValueChange,
  count = 5,
  allowHalf = false,
  disabled = false,
  readOnly = false,
  icon,
  label,
  className,
  ...rest
}: RateProps) {
  const groupId = useStableId('ds-rate');
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const setRating = useCallback(
    (next: number) => {
      if (disabled || readOnly) return;
      setCurrent(next);
    },
    [disabled, readOnly, setCurrent],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || readOnly) return;
    const val = current ?? 0;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      setRating(Math.min(count, val + 1));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      setRating(Math.max(0, val - 1));
    }
  };

  return (
    <div
      {...rest}
      id={groupId}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={count}
      aria-valuenow={current}
      aria-label={label ?? 'Rating'}
      tabIndex={disabled || readOnly ? -1 : 0}
      className={cn(styles.root, disabled && styles.disabled, className)}
      onKeyDown={handleKeyDown}
    >
      {Array.from({ length: count }, (_, i) => {
        const index = i + 1;
        const filled = (current ?? 0) >= index;
        const half = allowHalf && (current ?? 0) >= index - 0.5 && (current ?? 0) < index;
        return (
          <button
            key={index}
            type="button"
            className={cn(styles.star, filled && styles.filled, half && styles.half)}
            disabled={disabled || readOnly}
            aria-label={`Rate ${index} of ${count}`}
            onClick={() => setRating(index)}
          >
            {icon ?? <StarIcon />}
          </button>
        );
      })}
    </div>
  );
}
