import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

import { cn } from '../../utils/cn';
import { ActionPopup, type ActionPopupAlign } from '../action-popup/ActionPopup';

import styles from './menu.module.css';

export type MenuItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
};

export type MenuProps = {
  trigger: ReactElement;
  items: MenuItem[];
  align?: ActionPopupAlign;
  onSelect?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

function getMenuItems(container: HTMLElement | null) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])'),
  );
}

export function Menu({
  trigger,
  items,
  align = 'start',
  onSelect,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
}: MenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const handleClose = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleSelect = (id: string, disabled?: boolean) => {
    if (disabled) return;
    onSelect?.(id);
    handleClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      getMenuItems(menuRef.current)[0]?.focus();
    });
  }, [isOpen]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const menuItems = getMenuItems(menuRef.current);
    if (menuItems.length === 0) return;

    const currentIndex = menuItems.findIndex((item) => item === document.activeElement);

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const next = menuItems[(currentIndex + 1 + menuItems.length) % menuItems.length];
        next?.focus();
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prev =
          menuItems[(currentIndex - 1 + menuItems.length) % menuItems.length] ?? menuItems[0];
        prev?.focus();
        break;
      }
      case 'Home':
        event.preventDefault();
        menuItems[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
      case 'Tab':
        handleClose();
        break;
      default:
        break;
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
  };

  const triggerNode = isValidElement(trigger)
    ? cloneElement(trigger, {
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node;
          const triggerRefProp = (trigger as ReactElement & { ref?: Ref<HTMLElement> }).ref;
          if (typeof triggerRefProp === 'function') {
            triggerRefProp(node);
          } else if (
            triggerRefProp &&
            typeof triggerRefProp === 'object' &&
            'current' in triggerRefProp
          ) {
            (triggerRefProp as MutableRefObject<HTMLElement | null>).current = node;
          }
        },
        onClick: (event: React.MouseEvent) => {
          (trigger.props as { onClick?: (event: React.MouseEvent) => void }).onClick?.(event);
          if (!event.defaultPrevented) setOpen(!isOpen);
        },
        onKeyDown: (event: KeyboardEvent) => {
          (trigger.props as { onKeyDown?: (event: KeyboardEvent) => void }).onKeyDown?.(event);
          if (!event.defaultPrevented) handleTriggerKeyDown(event);
        },
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
      } as Record<string, unknown>)
    : trigger;

  return (
    <div ref={rootRef} className={cn(styles.root, className)}>
      {triggerNode}
      <ActionPopup
        anchorRef={rootRef}
        open={isOpen}
        onClose={handleClose}
        align={align}
        returnFocusRef={triggerRef}
      >
        <div ref={menuRef} role="presentation" onKeyDown={handleMenuKeyDown}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={cn(styles.item, item.destructive && styles.destructive)}
              onClick={() => handleSelect(item.id, item.disabled)}
            >
              {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </ActionPopup>
    </div>
  );
}
