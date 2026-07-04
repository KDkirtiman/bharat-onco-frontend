import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 focus:ring-primary shadow-md hover:shadow-lg active:scale-[0.98] transition-all',
    secondary:
      'bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/80 focus:ring-secondary shadow-md hover:shadow-lg active:scale-[0.98] transition-all',
    ghost:
      'bg-transparent hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-foreground focus:ring-primary transition-all',
    link:
      'bg-transparent text-primary hover:text-secondary underline-offset-4 hover:underline focus:ring-primary transition-all',
    outline:
      'bg-transparent border-2 border-primary/30 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-primary text-foreground focus:ring-primary transition-all',
    destructive:
      'bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive shadow-md hover:shadow-lg active:scale-[0.98] transition-all',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
