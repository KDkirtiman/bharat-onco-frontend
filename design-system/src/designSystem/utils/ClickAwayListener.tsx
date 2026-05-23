import { useEffect, useRef, type ReactNode } from 'react';

export type ClickAwayListenerProps = {
  children: ReactNode;
  onClickAway: (event: MouseEvent | TouchEvent) => void;
  disabled?: boolean;
};

export function ClickAwayListener({
  children,
  onClickAway,
  disabled = false,
}: ClickAwayListenerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        onClickAway(event);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [onClickAway, disabled]);

  return <div ref={ref}>{children}</div>;
}
