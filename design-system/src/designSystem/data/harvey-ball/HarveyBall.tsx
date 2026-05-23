import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { useStableId } from '../../utils/useStableId';

import styles from './harveyBall.module.css';

export type HarveyBallProps = HTMLAttributes<HTMLDivElement> & {
  value: number;
  size?: number;
  label?: string;
  showLabel?: boolean;
};

export function HarveyBall({
  value,
  size = 48,
  label,
  showLabel = true,
  className,
  ...rest
}: HarveyBallProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const labelId = useStableId('ds-harvey-ball');
  const rotation = (clamped / 100) * 360;

  return (
    <div
      {...rest}
      className={cn(styles.root, className)}
      role="img"
      aria-labelledby={showLabel ? labelId : undefined}
      aria-label={!showLabel ? `${clamped}% complete` : undefined}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" className={styles.svg}>
        <circle cx="50" cy="50" r="48" className={styles.empty} />
        <path
          d={`M 50 50 L 50 2 A 48 48 0 ${rotation > 180 ? 1 : 0} 1 ${
            50 + 48 * Math.sin((rotation * Math.PI) / 180)
          } ${50 - 48 * Math.cos((rotation * Math.PI) / 180)} Z`}
          className={styles.fill}
        />
        <circle cx="50" cy="50" r="48" className={styles.outline} fill="none" />
      </svg>
      {showLabel ? (
        <span id={labelId} className={styles.label}>
          {label ?? `${clamped}%`}
        </span>
      ) : null}
    </div>
  );
}
