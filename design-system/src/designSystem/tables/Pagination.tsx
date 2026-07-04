import type { ButtonHTMLAttributes } from 'react';

import { Icon } from '../icons/Icon';

import styles from './pagination.module.css';

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Labels for screen readers */
  labels?: { prev?: string; next?: string; page?: (n: number) => string };
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
  labels = {},
}: PaginationProps) {
  const safeCount = Math.max(1, pageCount);
  const current = clamp(page, 1, safeCount);
  const canPrev = current > 1;
  const canNext = current < safeCount;

  const prevLabel = labels.prev ?? 'Previous page';
  const nextLabel = labels.next ?? 'Next page';

  return (
    <nav
      className={[styles.root, className ?? ''].join(' ')}
      aria-label="Pagination"
    >
      <IconButton
        type="button"
        disabled={!canPrev}
        aria-label={prevLabel}
        onClick={() => canPrev && onPageChange(current - 1)}
      >
        <Icon name="chevronLeft" size="sm" />
      </IconButton>
      <span className={styles.status}>
        {labels.page ? labels.page(current) : `Page ${current} of ${safeCount}`}
      </span>
      <IconButton
        type="button"
        disabled={!canNext}
        aria-label={nextLabel}
        onClick={() => canNext && onPageChange(current + 1)}
      >
        <Icon name="chevronRight" size="sm" />
      </IconButton>
    </nav>
  );
}

function IconButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={[styles.iconBtn, className ?? ''].join(' ')} />
  );
}
