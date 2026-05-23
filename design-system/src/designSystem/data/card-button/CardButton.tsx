import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

import styles from './cardButton.module.css';

export type CardButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  variant?: 'default' | 'outline';
};

export function CardButton({
  selected,
  defaultSelected = false,
  onSelectedChange,
  title,
  description,
  icon,
  variant = 'default',
  className,
  disabled,
  onClick,
  ...rest
}: CardButtonProps) {
  const [isSelected, setSelected] = useControllableState({
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });

  return (
    <button
      {...rest}
      type="button"
      disabled={disabled}
      aria-pressed={isSelected}
      className={cn(
        styles.card,
        styles[variant],
        isSelected && styles.selected,
        disabled && styles.disabled,
        className,
      )}
      onClick={(event) => {
        setSelected(!isSelected);
        onClick?.(event);
      }}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.title}>{title}</span>
      {description ? <span className={styles.description}>{description}</span> : null}
      {isSelected ? <span className={styles.check} aria-hidden="true">✓</span> : null}
    </button>
  );
}
