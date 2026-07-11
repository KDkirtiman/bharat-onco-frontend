import * as styles from './Avatar.styles';

interface AvatarProps {
  name: string;
  size?: styles.AvatarSize;
  className?: string;
}

export function Avatar({ name, size = 'sm', className }: AvatarProps) {
  const initial = name.trim()[0]?.toUpperCase() ?? '?';

  return (
    <div className={styles.avatarClass(size, className)} aria-hidden>
      {initial}
    </div>
  );
}
