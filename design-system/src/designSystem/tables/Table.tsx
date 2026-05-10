import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

import styles from './table.module.css';

export type TableProps = HTMLAttributes<HTMLTableElement>;

export function Table({ className, ...rest }: TableProps) {
  return <table {...rest} className={[styles.table, className ?? ''].join(' ')} />;
}

export function TableHead({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...rest} className={[styles.head, className ?? ''].join(' ')} />;
}

export function TableBody({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...rest} className={[className ?? ''].join(' ')} />;
}

export function TableRow({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...rest} className={[styles.row, className ?? ''].join(' ')} />;
}

export function Th({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...rest} className={[styles.th, className ?? ''].join(' ')} />;
}

export function Td({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...rest} className={[styles.td, className ?? ''].join(' ')} />;
}
