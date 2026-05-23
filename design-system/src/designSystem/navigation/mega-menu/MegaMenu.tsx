import { useRef, useState, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { ClickAwayListener } from '../../utils/ClickAwayListener';
import { Portal } from '../../utils/Portal';
import { useStableId } from '../../utils/useStableId';

import styles from './megaMenu.module.css';

export type MegaMenuColumn = {
  id: string;
  title: string;
  links: { id: string; label: string; href?: string; onClick?: () => void }[];
};

export type MegaMenuProps = {
  trigger: ReactNode;
  columns: MegaMenuColumn[];
  className?: string;
};

export function MegaMenu({ trigger, columns, className }: MegaMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const menuId = useStableId('ds-mega-menu');

  return (
    <div ref={rootRef} className={cn(styles.root, className)}>
      <div
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
      >
        {trigger}
      </div>
      {open ? (
        <Portal>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div
              id={menuId}
              className={styles.panel}
              style={{
                position: 'fixed',
                top: (rootRef.current?.getBoundingClientRect().bottom ?? 0) + 4,
                left: rootRef.current?.getBoundingClientRect().left ?? 0,
              }}
              role="navigation"
              aria-label="Mega menu"
            >
              {columns.map((col) => (
                <div key={col.id} className={styles.column}>
                  <h3 className={styles.columnTitle}>{col.title}</h3>
                  <ul className={styles.linkList}>
                    {col.links.map((link) => (
                      <li key={link.id}>
                        {link.href ? (
                          <a href={link.href} className={styles.link}>
                            {link.label}
                          </a>
                        ) : (
                          <button
                            type="button"
                            className={styles.link}
                            onClick={() => {
                              link.onClick?.();
                              setOpen(false);
                            }}
                          >
                            {link.label}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ClickAwayListener>
        </Portal>
      ) : null}
    </div>
  );
}
