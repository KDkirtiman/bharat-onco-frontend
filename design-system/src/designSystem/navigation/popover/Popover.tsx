import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

import { cn } from '../../utils/cn';
import { Portal } from '../../utils/Portal';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './popover.module.css';

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export type PopoverProps = {
  trigger: ReactElement;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopoverPlacement;
  className?: string;
  contentClassName?: string;
};

export function Popover({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  className,
  contentClassName,
}: PopoverProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const popoverId = useStableId('ds-popover');

  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  const getPosition = () => {
    const anchor = rootRef.current;
    if (!anchor) return { top: 0, left: 0 };
    const rect = anchor.getBoundingClientRect();
    const isTop = placement.startsWith('top');
    const isEnd = placement.endsWith('end');
    return {
      top: isTop ? rect.top - 4 : rect.bottom + 4,
      left: isEnd ? rect.right : rect.left,
      transform: `${isTop ? 'translateY(-100%)' : ''}${isEnd ? ' translateX(-100%)' : ''}`,
    };
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || contentRef.current?.contains(target)) return;
      close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close, isOpen]);

  const triggerNode = isValidElement(trigger)
    ? cloneElement(trigger, {
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node;
          const triggerRefProp = (trigger as ReactElement & { ref?: Ref<HTMLElement> }).ref;
          if (typeof triggerRefProp === 'function') {
            triggerRefProp(node);
          } else if (triggerRefProp && typeof triggerRefProp === 'object' && 'current' in triggerRefProp) {
            (triggerRefProp as MutableRefObject<HTMLElement | null>).current = node;
          }
        },
        onClick: (event: React.MouseEvent) => {
          (trigger.props as { onClick?: (event: React.MouseEvent) => void }).onClick?.(event);
          if (!event.defaultPrevented) setOpen(!isOpen);
        },
        'aria-haspopup': 'dialog',
        'aria-expanded': isOpen,
        'aria-controls': isOpen ? popoverId : undefined,
      } as Record<string, unknown>)
    : trigger;

  return (
    <div ref={rootRef} className={cn(styles.root, className)}>
      {triggerNode}
      {isOpen ? (
        <Portal>
          <div
            ref={contentRef}
            id={popoverId}
            role="dialog"
            className={cn(styles.content, contentClassName)}
            style={{ position: 'fixed', ...getPosition() }}
          >
            {children}
          </div>
        </Portal>
      ) : null}
    </div>
  );
}
