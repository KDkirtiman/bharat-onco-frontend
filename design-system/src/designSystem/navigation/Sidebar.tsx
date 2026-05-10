import type { ReactNode } from 'react';

import { Icon, type IconName } from '../icons/Icon';

import styles from './sidebar.module.css';

export type SidebarNavItem = {
  id: string;
  label: string;
  icon: IconName;
};

export type SidebarProps = {
  brandSlot?: ReactNode;
  items: SidebarNavItem[];
  /** Controlled active item id */
  activeId: string;
  /** Fired when user selects an item */
  onSelect?: (id: string) => void;
  /** Collapse sidebar to icons only */
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  /** Optional footer (e.g. Logout) */
  footer?: ReactNode;
  className?: string;
};

export function Sidebar({
  brandSlot,
  items,
  activeId,
  onSelect,
  collapsed = false,
  onToggleCollapse,
  footer,
  className,
}: SidebarProps) {
  return (
    <aside
      className={[styles.root, collapsed ? styles.collapsed : '', className ?? ''].join(' ')}
      aria-label="Main navigation"
    >
      <div className={styles.top}>
        <div className={styles.brand}>{brandSlot}</div>
        {onToggleCollapse ? (
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name="panelLeftClose" size="sm" />
          </button>
        ) : null}
      </div>
      <nav className={styles.nav} role="navigation">
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={[styles.item, activeId === item.id ? styles.active : ''].join(' ')}
                onClick={() => onSelect?.(item.id)}
                aria-current={activeId === item.id ? 'page' : undefined}
              >
                <Icon name={item.icon} size="md" />
                <span className={styles.label}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </aside>
  );
}
