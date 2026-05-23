import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './card.module.css';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'elevated' | 'outlined' | 'flat';
};

function CardRoot({ padding = 'md', variant = 'elevated', className, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={cn(styles.card, styles[padding], styles[variant], className)}
    />
  );
}

export type CardSectionProps = HTMLAttributes<HTMLDivElement>;

function CardHeader({ className, ...rest }: CardSectionProps) {
  return <div {...rest} className={cn(styles.header, className)} />;
}

function CardBody({ className, ...rest }: CardSectionProps) {
  return <div {...rest} className={cn(styles.body, className)} />;
}

function CardFooter({ className, ...rest }: CardSectionProps) {
  return <div {...rest} className={cn(styles.footer, className)} />;
}

export type CardCompoundProps = CardProps & {
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
};

export function Card({ header, footer, children, padding = 'md', ...rest }: CardCompoundProps) {
  if (!header && !footer) {
    return <CardRoot padding={padding} {...rest}>{children}</CardRoot>;
  }
  return (
    <CardRoot padding="none" {...rest}>
      {header ? <CardHeader>{header}</CardHeader> : null}
      {children ? <CardBody className={padding !== 'none' ? styles[`pad_${padding}`] : undefined}>{children}</CardBody> : null}
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </CardRoot>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
