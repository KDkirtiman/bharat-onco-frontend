import type { HTMLAttributes, ReactNode } from 'react';

import styles from './typography.module.css';

type BaseProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
};

export function H1({ className, ...rest }: BaseProps) {
  return <h1 {...rest} className={[styles.h1, className ?? ''].join(' ')} />;
}

export function H2({ className, ...rest }: BaseProps) {
  return <h2 {...rest} className={[styles.h2, className ?? ''].join(' ')} />;
}

export function Text({ className, ...rest }: BaseProps) {
  return <p {...rest} className={[styles.text, className ?? ''].join(' ')} />;
}

export function MutedText({ className, ...rest }: BaseProps) {
  return <p {...rest} className={[styles.muted, className ?? ''].join(' ')} />;
}

