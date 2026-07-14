import { cn } from '../../../lib/cn';

export const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

export const variants = {
  primary:
    'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 focus:ring-primary shadow-md hover:shadow-lg active:scale-[0.98] transition-all',
  secondary:
    'bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/80 focus:ring-secondary shadow-md hover:shadow-lg active:scale-[0.98] transition-all',
  ghost:
    'bg-transparent hover:bg-gradient-to-r hover:from-brand-soft-soft hover:to-accent text-foreground focus:ring-primary transition-all',
  link:
    'bg-transparent text-primary hover:text-secondary underline-offset-4 hover:underline focus:ring-primary transition-all',
  outline:
    'bg-transparent border-2 border-primary/30 hover:bg-gradient-to-r hover:from-brand-soft-soft hover:to-accent hover:border-primary text-foreground focus:ring-primary transition-all',
  destructive:
    'bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive shadow-md hover:shadow-lg active:scale-[0.98] transition-all',
} as const;

export const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3',
  lg: 'px-6 py-4 text-lg',
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export const loaderIcon = 'mr-2 h-4 w-4 animate-spin';

export function buttonClass(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return cn(baseStyles, variants[variant], sizes[size], className);
}
