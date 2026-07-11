import * as styles from './Textarea.styles';
import { forwardRef, type TextareaHTMLAttributes } from 'react';


interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={styles.textareaClass(error, className)}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
