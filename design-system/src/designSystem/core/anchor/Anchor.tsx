import type { HTMLAttributes, MouseEvent } from 'react';

import { cn } from '../../utils/cn';

import styles from './anchor.module.css';

export type AnchorItem = {
  id: string;
  label: string;
  href: string;
};

export type AnchorProps = Omit<HTMLAttributes<HTMLElement>, 'onSelect'> & {
  items: AnchorItem[];
  activeId?: string;
  offset?: number;
  onSelect?: (id: string) => void;
};

export function Anchor({
  items,
  activeId,
  offset = 0,
  onSelect,
  className,
  ...rest
}: AnchorProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, item: AnchorItem) => {
    onSelect?.(item.id);

    const hash = item.href.startsWith('#') ? item.href.slice(1) : item.href;
    const target = document.getElementById(hash);
    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', item.href.startsWith('#') ? item.href : `#${hash}`);
  };

  return (
    <nav {...rest} aria-label="On this page" className={cn(styles.root, className)}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              className={cn(styles.link, activeId === item.id && styles.active)}
              aria-current={activeId === item.id ? 'location' : undefined}
              onClick={(event) => handleClick(event, item)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
