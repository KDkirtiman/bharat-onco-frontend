import { useCallback, useEffect, useRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

import styles from './timer.module.css';

export type TimerProps = HTMLAttributes<HTMLDivElement> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (seconds: number) => void;
  autoStart?: boolean;
  countDown?: boolean;
  label?: string;
};

function formatSeconds(total: number) {
  const abs = Math.abs(total);
  const minutes = Math.floor(abs / 60);
  const seconds = abs % 60;
  const prefix = total < 0 ? '-' : '';
  return `${prefix}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function Timer({
  value,
  defaultValue = 0,
  onValueChange,
  autoStart = false,
  countDown = false,
  label,
  className,
  ...rest
}: TimerProps) {
  const [seconds, setSecondsState] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const secondsRef = useRef(seconds ?? defaultValue);
  secondsRef.current = seconds ?? defaultValue;

  const setSeconds = useCallback(
    (next: number | ((prev: number) => number)) => {
      const resolved =
        typeof next === 'function' ? next(secondsRef.current ?? defaultValue) : next;
      setSecondsState(resolved);
    },
    [defaultValue, setSecondsState],
  );
  const [running, setRunning] = useControllableState({
    defaultValue: autoStart,
  });
  const intervalRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }, [setRunning]);

  const start = useCallback(() => {
    setRunning(true);
  }, [setRunning]);

  const reset = useCallback(() => {
    stop();
    setSeconds(defaultValue);
  }, [defaultValue, setSeconds, stop]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSeconds((prev) => {
        const current = prev ?? 0;
        if (countDown && current <= 0) {
          stop();
          return 0;
        }
        return countDown ? current - 1 : current + 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [countDown, running, setSeconds, stop]);

  return (
    <div {...rest} className={cn(styles.root, className)} role="group" aria-label={label ?? 'Timer'}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={styles.display} aria-live="polite">
        {formatSeconds(seconds ?? 0)}
      </span>
      <div className={styles.controls}>
        <button type="button" className={styles.btn} onClick={running ? stop : start}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button type="button" className={styles.btn} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
