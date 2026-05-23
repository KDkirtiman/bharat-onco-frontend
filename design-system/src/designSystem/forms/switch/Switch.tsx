import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './switch.module.css';

export type SwitchSize = 'sm' | 'md';

export type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'role' | 'type' | 'onChange'
> & {
  size?: SwitchSize;
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  size = 'md',
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  id,
  className,
  ...rest
}: SwitchProps) {
  const switchId = useStableId('ds-switch');
  const resolvedId = id ?? switchId;
  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked ?? false,
    onChange: onCheckedChange,
  });

  return (
    <label
      className={cn(
        styles.root,
        styles[size],
        disabled && styles.disabled,
        className,
      )}
    >
      <button
        {...rest}
        id={resolvedId}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        className={cn(styles.track, isChecked && styles.trackChecked)}
        onClick={() => setIsChecked(!isChecked)}
      >
        <span className={styles.thumb} aria-hidden="true" />
      </button>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
}
