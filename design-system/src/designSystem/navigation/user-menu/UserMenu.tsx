import { Avatar } from '../../core/avatar/Avatar';
import { cn } from '../../utils/cn';
import { Menu, type MenuItem } from '../menu/Menu';

import styles from './userMenu.module.css';

export type UserMenuProps = {
  name: string;
  email?: string;
  avatarSrc?: string;
  items: MenuItem[];
  onSelect?: (id: string) => void;
  className?: string;
};

export function UserMenu({
  name,
  email,
  avatarSrc,
  items,
  onSelect,
  className,
}: UserMenuProps) {
  const trigger = (
    <button type="button" className={styles.trigger} aria-label={`User menu for ${name}`}>
      <Avatar src={avatarSrc} alt={name} size="sm">
        {name.slice(0, 1).toUpperCase()}
      </Avatar>
      <span className={styles.meta}>
        <span className={styles.name}>{name}</span>
        {email ? <span className={styles.email}>{email}</span> : null}
      </span>
      <span className={styles.chevron} aria-hidden="true">
        ▾
      </span>
    </button>
  );

  return (
    <div className={cn(styles.root, className)}>
      <Menu trigger={trigger} items={items} onSelect={onSelect} align="end" />
    </div>
  );
}
