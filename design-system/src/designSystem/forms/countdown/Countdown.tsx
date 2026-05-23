import { useEffect, useState, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

import styles from './countdown.module.css';

export type CountdownProps = HTMLAttributes<HTMLDivElement> & {
  targetDate: Date | string | number;
  onComplete?: () => void;
  format?: 'dhms' | 'hms' | 'ms';
  label?: string;
};

function getRemaining(target: number) {
  return Math.max(0, target - Date.now());
}

function formatTime(ms: number, format: CountdownProps['format']) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  if (format === 'dhms') {
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  if (format === 'hms') {
    return `${pad(hours + days * 24)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes + (hours + days * 24) * 60)}:${pad(seconds)}`;
}

export function Countdown({
  targetDate,
  onComplete,
  format = 'hms',
  label,
  className,
  ...rest
}: CountdownProps) {
  const target = new Date(targetDate).getTime();
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const tick = () => {
      const next = getRemaining(target);
      setRemaining(next);
      if (next === 0) onComplete?.();
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [onComplete, target]);

  return (
    <div
      {...rest}
      className={cn(styles.root, className)}
      role="timer"
      aria-live="polite"
      aria-label={label ?? 'Countdown'}
    >
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={styles.time}>{formatTime(remaining, format)}</span>
    </div>
  );
}
