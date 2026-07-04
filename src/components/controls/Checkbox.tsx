import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="peer sr-only"
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className="
              flex h-5 w-5 cursor-pointer items-center justify-center
              rounded border-2 border-border bg-background
              transition-all duration-200
              peer-checked:border-primary peer-checked:bg-primary
              peer-focus:ring-2 peer-focus:ring-primary/20
              peer-hover:border-primary/50
              peer-disabled:cursor-not-allowed peer-disabled:opacity-50
            "
          >
            <Check className="h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
          </label>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="cursor-pointer select-none text-sm text-foreground"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
