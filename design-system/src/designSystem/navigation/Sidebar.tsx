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

function CollapseToggle({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.collapseBtn}
      onClick={onToggleCollapse}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <Icon name={collapsed ? 'chevronRight' : 'panelLeftClose'} size="sm" />
    </button>
  );
}

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
        {onToggleCollapse && !collapsed ? (
          <CollapseToggle collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
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
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon name={item.icon} size="md" />
                <span className={styles.label}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {onToggleCollapse || footer ? (
        <div className={styles.bottom}>
          {footer ? <div className={styles.footer}>{footer}</div> : null}
          {onToggleCollapse && collapsed ? (
            <CollapseToggle collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
