import type { HTMLAttributes, ReactNode } from 'react';

import styles from './toolbar.module.css';

export type DataTableToolbarProps = HTMLAttributes<HTMLDivElement> & {
  /** e.g. search field */
  start?: ReactNode;
  /** e.g. filter controls */
  end?: ReactNode;
};

export function DataTableToolbar({
  start,
  end,
  children,
  className,
  ...rest
}: DataTableToolbarProps) {
  const hasSlots = start != null || end != null;
  return (
    <div {...rest} className={[styles.root, className ?? ''].join(' ')}>
      {hasSlots ? (
        <>
          <div className={styles.start}>{start}</div>
          <div className={styles.end}>{end}</div>
        </>
      ) : (
        children
      )}
    </div>
  );
}
