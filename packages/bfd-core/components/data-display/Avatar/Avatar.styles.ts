import { cn } from '../../../lib/cn';

export type AvatarSize = 'sm' | 'md' | 'lg';

export const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-caption-sm',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
};

const base =
  'rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary shrink-0';

export function avatarClass(size: AvatarSize, className?: string) {
  return cn(base, sizeClasses[size], className);
}
