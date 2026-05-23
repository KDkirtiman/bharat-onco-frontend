import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

import { Portal } from '../../utils/Portal';
import { cn } from '../../utils/cn';
import { useStableId } from '../../utils/useStableId';

import styles from './actionPopup.module.css';

export type ActionPopupAlign = 'start' | 'end';

export type ActionPopupProps = {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  align?: ActionPopupAlign;
  className?: string;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function ActionPopup({
  anchorRef,
  open,
  onClose,
  children,
  align = 'start',
  className,
  returnFocusRef,
}: ActionPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const menuId = useStableId('action-popup');
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    if (!anchor || !popup) return;

    const rect = anchor.getBoundingClientRect();
    const popupWidth = popup.offsetWidth;
    const left = align === 'end' ? rect.right - popupWidth : rect.left;

    setPosition({
      top: rect.bottom + 4,
      left,
    });
  }, [align, anchorRef]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popupRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        returnFocusRef?.current?.focus();
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorRef, onClose, open, returnFocusRef, updatePosition]);

  if (!open) return null;

  return (
    <Portal>
      <div
        ref={popupRef}
        id={menuId}
        role="menu"
        className={cn(styles.popup, styles[`align${align === 'end' ? 'End' : 'Start'}`], className)}
        style={{ top: position.top, left: position.left }}
      >
        {children}
      </div>
    </Portal>
  );
}
