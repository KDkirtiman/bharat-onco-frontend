import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './radio.module.css';

export type RadioSize = 'sm' | 'md';
export type RadioGroupLayout = 'default' | 'card';

type RadioGroupContextValue = {
  name: string;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  size: RadioSize;
  layout: RadioGroupLayout;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio must be used within a RadioGroup');
  }
  return context;
}

export type RadioGroupProps = {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: RadioSize;
  layout?: RadioGroupLayout;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

export function RadioGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  size = 'md',
  layout = 'default',
  className,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: RadioGroupProps) {
  const groupName = useStableId('ds-radio-group');
  const resolvedName = name ?? groupName;
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const contextValue = useMemo(
    () => ({
      name: resolvedName,
      value: selectedValue,
      onValueChange: setSelectedValue,
      disabled,
      size,
      layout,
    }),
    [resolvedName, selectedValue, setSelectedValue, disabled, size, layout],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(styles.group, layout === 'card' && styles.groupCard, className)}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'name' | 'checked' | 'defaultChecked' | 'onChange'
> & {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  size?: RadioSize;
};

export function Radio({
  value,
  label,
  description,
  size: sizeProp,
  disabled: disabledProp,
  id,
  className,
  ...rest
}: RadioProps) {
  const {
    name,
    value: groupValue,
    onValueChange,
    disabled: groupDisabled,
    size: groupSize,
    layout,
  } = useRadioGroupContext();
  const inputId = useStableId('ds-radio');
  const resolvedId = id ?? inputId;
  const size = sizeProp ?? groupSize;
  const disabled = disabledProp ?? groupDisabled;
  const checked = groupValue === value;

  const handleChange = useCallback(() => {
    onValueChange(value);
  }, [onValueChange, value]);

  return (
    <label
      className={cn(
        styles.root,
        styles[size],
        layout === 'card' && styles.card,
        checked && layout === 'card' && styles.cardChecked,
        disabled && styles.disabled,
        className,
      )}
    >
      <span className={styles.control}>
        <input
          {...rest}
          id={resolvedId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          className={styles.input}
          onChange={handleChange}
        />
        <span className={styles.indicator} aria-hidden="true" />
      </span>
      {(label || description) ? (
        <span className={styles.content}>
          {label ? <span className={styles.label}>{label}</span> : null}
          {description ? <span className={styles.description}>{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
