import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';
import { Portal } from '../../utils/Portal';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './modal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg';

type ModalContextValue = {
  titleId: string;
  onClose: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('Modal compound components must be used within Modal');
  return ctx;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1,
  );
}

export type ModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  children: ReactNode;
  className?: string;
};

function ModalRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  size = 'md',
  closeOnOverlay = true,
  children,
  className,
}: ModalProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useStableId('ds-modal-title');

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;
    if (dialog) {
      const focusable = getFocusableElements(dialog);
      (focusable[0] ?? dialog).focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
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
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className={styles.overlay}
        onClick={closeOnOverlay ? handleClose : undefined}
      >
        <ModalContext.Provider value={{ titleId, onClose: handleClose }}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(styles.dialog, styles[size], className)}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </div>
        </ModalContext.Provider>
      </div>
    </Portal>
  );
}

export type ModalHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  showClose?: boolean;
};

function ModalHeader({ children, className, showClose = true, ...rest }: ModalHeaderProps) {
  const { titleId, onClose } = useModalContext();

  return (
    <div {...rest} className={cn(styles.header, className)}>
      <div id={titleId} className={styles.title}>
        {children}
      </div>
      {showClose ? (
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ×
        </button>
      ) : null}
    </div>
  );
}

export type ModalBodyProps = HTMLAttributes<HTMLDivElement>;

function ModalBody({ className, children, ...rest }: ModalBodyProps) {
  return (
    <div {...rest} className={cn(styles.body, className)}>
      {children}
    </div>
  );
}

export type ModalFooterProps = HTMLAttributes<HTMLDivElement>;

function ModalFooter({ className, children, ...rest }: ModalFooterProps) {
  return (
    <div {...rest} className={cn(styles.footer, className)}>
      {children}
    </div>
  );
}

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
