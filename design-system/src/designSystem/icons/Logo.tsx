import type { ImgHTMLAttributes } from 'react';

import logoSvg from './bharat-oncology-logo.svg';

import styles from './logo.module.css';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

export type LogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  /** Visual height preset; width scales with the logo aspect ratio. */
  size?: LogoSize;
  alt?: string;
};

const sizeClass: Record<LogoSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
};

/** Official Bharat Oncology wordmark (ribbon, heart, and logotype). */
export function Logo({ size = 'md', className, alt = 'Bharat Oncology', ...rest }: LogoProps) {
  return (
    <img
      {...rest}
      src={logoSvg}
      alt={alt}
      className={[styles.logo, sizeClass[size], className].filter(Boolean).join(' ')}
    />
  );
}
