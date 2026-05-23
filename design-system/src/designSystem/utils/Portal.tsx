import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

export type PortalProps = {
  children: ReactNode;
  container?: Element | null;
};

export function Portal({ children, container }: PortalProps) {
  if (typeof document === 'undefined') return null;
  const target = container ?? document.body;
  return createPortal(children, target);
}
