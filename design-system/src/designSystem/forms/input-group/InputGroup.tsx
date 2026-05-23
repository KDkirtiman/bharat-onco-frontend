import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
} from 'react';

import { cn } from '../../utils/cn';

import styles from './inputGroup.module.css';

export type InputGroupPosition = 'single' | 'first' | 'middle' | 'last';

export type InputGroupProps = HTMLAttributes<HTMLDivElement>;

type GroupableChildProps = {
  className?: string;
  grouped?: InputGroupPosition;
};

export function InputGroup({ className, children, ...rest }: InputGroupProps) {
  const childArray = Children.toArray(children);
  const count = childArray.length;

  return (
    <div {...rest} className={cn(styles.root, className)}>
      {childArray.map((child, index) => {
        if (!isValidElement(child)) return child;

        const position: InputGroupPosition =
          count === 1 ? 'single' : index === 0 ? 'first' : index === count - 1 ? 'last' : 'middle';

        return cloneElement(child as ReactElement<GroupableChildProps>, {
          grouped: position,
          className: cn(
            (child as ReactElement<GroupableChildProps>).props.className,
            styles.item,
            styles[position],
          ),
        });
      })}
    </div>
  );
}
