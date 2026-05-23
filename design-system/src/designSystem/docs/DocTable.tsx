import type { ReactNode } from 'react';

import styles from './doc-table.module.css';

export type DocTableColumn = {
  key: string;
  header: string;
  width?: string;
};

export type DocTableProps = {
  columns: DocTableColumn[];
  rows: Record<string, ReactNode>[];
  caption?: string;
};

export function DocTable({ columns, rows, caption }: DocTableProps) {
  return (
    <table className={styles.table}>
      {caption ? <caption className={styles.caption}>{caption}</caption> : null}
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={col.width ? { width: col.width } : undefined}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
