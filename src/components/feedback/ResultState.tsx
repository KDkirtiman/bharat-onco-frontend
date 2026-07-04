import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../controls/Button';

interface ResultStateProps {
  icon: ReactNode;
  title: string;
  summary?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  iconClassName?: string;
  className?: string;
}

export function ResultState({
  icon,
  title,
  summary,
  actionLabel = 'Done',
  onAction,
  iconClassName,
  className,
}: ResultStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-10 text-center', className)}>
      <div
        className={cn(
          'w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5',
          iconClassName,
        )}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-5">{title}</h3>
      {summary && (
        <div className="w-full bg-muted/40 rounded-xl px-5 py-4 text-left space-y-2 mb-8">
          {summary}
        </div>
      )}
      {onAction && (
        <Button className="w-full rounded-xl py-2.5" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
