import type { HTMLAttributes, ReactNode } from 'react';

import { UserIcon } from '../../icons/glyphs';

import styles from './avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  /** Shown when no image or image error */
  fallback?: ReactNode;
};

export function Avatar({
  src,
  alt = '',
  size = 'md',
  fallback,
  className,
  children,
  ...rest
}: AvatarProps) {
  const showImg = Boolean(src);

  return (
    <div
      {...rest}
      className={[styles.avatar, styles[size], className ?? ''].join(' ')}
      role={showImg ? undefined : 'img'}
      aria-label={showImg ? undefined : alt || 'Avatar'}
    >
      {showImg ? (
        <img src={src} alt={alt} className={styles.img} />
      ) : (
        <span className={styles.fallback} aria-hidden={Boolean(alt)}>
          {children ?? fallback ?? <UserIcon />}
        </span>
      )}
    </div>
  );
}
