import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';
import { Portal } from '../../utils/Portal';
import { useStableId } from '../../utils/useStableId';

import styles from './snackbar.module.css';

export type SnackbarTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type SnackbarPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type SnackbarItem = {
  id: string;
  message: ReactNode;
  tone?: SnackbarTone;
  action?: ReactNode;
  autoHideDuration?: number;
};

export type ShowSnackbarOptions = Omit<SnackbarItem, 'id'> & { id?: string };

type SnackbarContextValue = {
  show: (options: ShowSnackbarOptions) => string;
  close: (id: string) => void;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return ctx;
}

export type SnackbarProviderProps = {
  children: ReactNode;
  position?: SnackbarPosition;
  maxSnackbars?: number;
  defaultAutoHideDuration?: number;
};

export function SnackbarProvider({
  children,
  position = 'bottom-center',
  maxSnackbars = 3,
  defaultAutoHideDuration = 5000,
}: SnackbarProviderProps) {
  const [items, setItems] = useState<SnackbarItem[]>([]);
  const idCounter = useRef(0);

  const close = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const show = useCallback(
    (options: ShowSnackbarOptions) => {
      const id = options.id ?? `snackbar-${++idCounter.current}`;
      const item: SnackbarItem = {
        id,
        message: options.message,
        tone: options.tone ?? 'neutral',
        action: options.action,
        autoHideDuration: options.autoHideDuration ?? defaultAutoHideDuration,
      };

      setItems((prev) => {
        const next = [...prev, item];
        return next.length > maxSnackbars ? next.slice(next.length - maxSnackbars) : next;
      });

      return id;
    },
    [defaultAutoHideDuration, maxSnackbars],
  );

  const value = useMemo(() => ({ show, close }), [show, close]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Portal>
        <div className={cn(styles.container, styles[position])} aria-live="polite" aria-relevant="additions">
          {items.map((item) => (
            <Snackbar
              key={item.id}
              id={item.id}
              tone={item.tone}
              action={item.action}
              autoHideDuration={item.autoHideDuration}
              onClose={() => close(item.id)}
            >
              {item.message}
            </Snackbar>
          ))}
        </div>
      </Portal>
    </SnackbarContext.Provider>
  );
}

export type SnackbarProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  tone?: SnackbarTone;
  action?: ReactNode;
  autoHideDuration?: number;
  onClose?: () => void;
  children: ReactNode;
};

export function Snackbar({
  id,
  tone = 'neutral',
  action,
  autoHideDuration = 5000,
  onClose,
  className,
  children,
  ...rest
}: SnackbarProps) {
  const labelId = useStableId('ds-snackbar');

  useEffect(() => {
    if (!autoHideDuration || autoHideDuration <= 0) return;
    const timer = window.setTimeout(() => onClose?.(), autoHideDuration);
    return () => window.clearTimeout(timer);
  }, [autoHideDuration, onClose, id]);

  return (
    <div
      {...rest}
      role="status"
      aria-labelledby={labelId}
      className={cn(styles.snackbar, styles[tone], className)}
    >
      <span id={labelId} className={styles.message}>
        {children}
      </span>
      {action ? <span className={styles.action}>{action}</span> : null}
      <button type="button" className={styles.dismiss} onClick={onClose} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
