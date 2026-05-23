import { createElement, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

import styles from './title.module.css';

export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TitleWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TitleProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: TitleLevel;
  weight?: TitleWeight;
  children?: ReactNode;
};

export function Title({
  level = 2,
  weight = 'bold',
  className,
  children,
  ...rest
}: TitleProps) {
  return createElement(
    `h${level}`,
    {
      ...rest,
      className: cn(styles.title, styles[`level${level}`], styles[weight], className),
    },
    children,
  );
}
