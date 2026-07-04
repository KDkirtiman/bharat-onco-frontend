import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { IconButton } from '../controls/IconButton';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
} as const;

export type ModalSize = keyof typeof sizeClasses;

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  size?: ModalSize;
  className?: string;
  overlayClassName?: string;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
}

export function Modal({
  children,
  onClose,
  size = 'md',
  className,
  overlayClassName,
  closeOnEscape = true,
  closeOnBackdrop = false,
}: ModalProps) {
  useEffect(() => {
    if (!closeOnEscape || !onClose) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4',
        overlayClassName,
      )}
      onClick={closeOnBackdrop ? onClose : undefined}
      role="presentation"
    >
      <div
        className={cn(
          'bg-card rounded-2xl shadow-2xl border border-border w-full flex flex-col max-h-[90vh]',
          sizeClasses[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

interface ModalHeaderProps {
  title: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
}

export function ModalHeader({ title, icon, onClose, children, className }: ModalHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-border shrink-0',
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {icon && <span className="text-primary shrink-0">{icon}</span>}
        <h2 className="text-base font-semibold text-foreground truncate">{title}</h2>
      </div>
      {children}
      {onClose && (
        <IconButton
          icon={<X size={18} />}
          label="Close"
          onClick={onClose}
        />
      )}
    </div>
  );
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
  scroll?: boolean;
}

export function ModalBody({ children, className, scroll = true }: ModalBodyProps) {
  return (
    <div
      className={cn(
        'px-6 py-5',
        scroll && 'overflow-y-auto flex-1',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0',
        className,
      )}
    >
      {children}
    </div>
  );
}
