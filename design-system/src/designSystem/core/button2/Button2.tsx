import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { Icon } from '../../icons/Icon';
import { ActionMenu, type ActionMenuItem } from '../../navigation/action-menu/ActionMenu';
import { cn } from '../../utils/cn';

import styles from './button2.module.css';

export type Button2Density = 'compact' | 'default' | 'comfortable';
export type Button2Variant = 'default' | 'primary';

export type Button2Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: ReactNode;
  label: string;
  density?: Button2Density;
  variant?: Button2Variant;
  menuItems?: ActionMenuItem[];
  onMenuSelect?: (id: string) => void;
};

export function Button2({
  icon,
  label,
  density = 'default',
  variant = 'default',
  menuItems,
  onMenuSelect,
  className,
  onClick,
  disabled,
  ...rest
}: Button2Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const hasSplit = menuItems && menuItems.length > 0;

  if (!hasSplit) {
    return (
      <div className={cn(styles.root, styles[density], styles[variant], className)}>
        <button
          {...rest}
          type="button"
          className={styles.iconButton}
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
        >
          {icon}
        </button>
      </div>
    );
  }

  return (
    <div className={cn(styles.root, styles[density], styles[variant], className)}>
      <button
        {...rest}
        type="button"
        className={styles.iconButton}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
      >
        {icon}
      </button>
      <ActionMenu
        trigger={
          <button
            type="button"
            className={cn(styles.iconButton, styles.split, styles.splitButton)}
            aria-label={`${label} menu`}
            disabled={disabled}
            aria-expanded={menuOpen}
          >
            <Icon name="chevronDown" size="sm" />
          </button>
        }
        items={menuItems}
        onSelect={onMenuSelect}
        onOpenChange={setMenuOpen}
        align="end"
      />
    </div>
  );
}
