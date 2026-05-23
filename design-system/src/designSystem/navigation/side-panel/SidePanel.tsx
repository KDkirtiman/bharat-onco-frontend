import { useCallback, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { Portal } from '../../utils/Portal';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './sidePanel.module.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1,
  );
}

export type SidePanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  children: ReactNode;
  side?: 'left' | 'right';
  width?: number;
  closeOnOverlay?: boolean;
};

export function SidePanel({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  children,
  side = 'right',
  width = 360,
  closeOnOverlay = true,
  className,
  ...rest
}: SidePanelProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const titleId = useStableId('ds-side-panel-title');
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    if (panel) {
      const focusable = getFocusableElements(panel);
      (focusable[0] ?? panel).focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = getFocusableElements(panelRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [handleClose, isOpen]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className={styles.overlay}>
        <div
          role="presentation"
          className={styles.backdrop}
          onClick={() => closeOnOverlay && handleClose()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              if (closeOnOverlay) handleClose();
            }
          }}
        />
        <aside
          {...rest}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
          className={cn(styles.panel, styles[side], className)}
          style={{ width }}
        >
          <header className={styles.header}>
            {title ? (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            ) : null}
            <button
              type="button"
              className={styles.close}
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
          </header>
          <div className={styles.body}>{children}</div>
        </aside>
      </div>
    </Portal>
  );
}
