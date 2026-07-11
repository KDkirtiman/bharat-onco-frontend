import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import * as styles from './Table.styles';

export function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return <table {...rest} className={styles.tableClass(className)} />;
}

export function TableHead({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...rest} className={styles.tableHeadClass(className)} />;
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TableRow({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...rest} className={styles.tableRowClass(className)} />;
}

export function Th({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...rest} className={styles.thClass(className)} />;
}

export function Td({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...rest} className={styles.tdClass(className)} />;
}
