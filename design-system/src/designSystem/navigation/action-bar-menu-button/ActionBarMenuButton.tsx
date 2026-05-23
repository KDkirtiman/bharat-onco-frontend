import { Icon } from '../../icons/Icon';
import { cn } from '../../utils/cn';
import { ActionMenu, type ActionMenuItem } from '../action-menu/ActionMenu';

import styles from './actionBarMenuButton.module.css';

export type ActionBarMenuButtonProps = {
  items: ActionMenuItem[];
  label?: string;
  onSelect?: (id: string) => void;
  disabled?: boolean;
  className?: string;
};

export function ActionBarMenuButton({
  items,
  label = 'More actions',
  onSelect,
  disabled,
  className,
}: ActionBarMenuButtonProps) {
  return (
    <ActionMenu
      className={className}
      items={items}
      onSelect={onSelect}
      align="end"
      trigger={
        <button type="button" className={cn(styles.menuButton)} aria-label={label} disabled={disabled}>
          <Icon name="moreVertical" size="md" />
        </button>
      }
    />
  );
}
