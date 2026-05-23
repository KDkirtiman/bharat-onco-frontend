import {
  cloneElement,
  isValidElement,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';
import { ActionPopup, type ActionPopupAlign } from '../action-popup/ActionPopup';

import styles from './actionMenu.module.css';

export type ActionMenuItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
};

export type ActionMenuProps = {
  trigger: ReactElement;
  items: ActionMenuItem[];
  align?: ActionPopupAlign;
  onSelect?: (id: string) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export function ActionMenu({
  trigger,
  items,
  align = 'start',
  onSelect,
  onOpenChange,
  className,
}: ActionMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const setOpenState = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const handleSelect = (id: string, disabled?: boolean) => {
    if (disabled) return;
    onSelect?.(id);
    setOpenState(false);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpenState(true);
    }
  };

  const triggerNode = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (event: React.MouseEvent) => {
          (trigger.props as { onClick?: (event: React.MouseEvent) => void }).onClick?.(event);
          if (!event.defaultPrevented) setOpenState(!open);
        },
        onKeyDown: (event: KeyboardEvent) => {
          (trigger.props as { onKeyDown?: (event: KeyboardEvent) => void }).onKeyDown?.(event);
          if (!event.defaultPrevented) handleTriggerKeyDown(event);
        },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      } as Record<string, unknown>)
    : trigger;

  return (
    <div ref={rootRef} className={cn(styles.root, className)}>
      {triggerNode}
      <ActionPopup anchorRef={rootRef} open={open} onClose={() => setOpenState(false)} align={align}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            className={cn(styles.menuItem, item.destructive && styles.destructive)}
            onClick={() => handleSelect(item.id, item.disabled)}
          >
            {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
            <span>{item.label}</span>
          </button>
        ))}
      </ActionPopup>
    </div>
  );
}
