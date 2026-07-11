import * as styles from './Input.styles';
import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'bfd-icons';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, type, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={styles.style1}>
        <div className={styles.style2}>
          {icon && (
            <div className={styles.style3}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full rounded-lg border border-border bg-input-background px-4 py-3
              ${icon ? 'pl-12' : ''}
              ${isPassword ? 'pr-12' : ''}
              text-foreground placeholder:text-muted-foreground
              transition-all duration-200
              focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
              hover:border-primary/50
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
              ${className}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.style4}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && (
          <p className={styles.style5}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
