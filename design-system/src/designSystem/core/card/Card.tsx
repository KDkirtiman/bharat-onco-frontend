import type { HTMLAttributes } from 'react';

import styles from './card.module.css';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

export function Card({ padding = 'md', className, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={[styles.card, styles[padding], className ?? ''].join(' ')}
    />
  );
}

