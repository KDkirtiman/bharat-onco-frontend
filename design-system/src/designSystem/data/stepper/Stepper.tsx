import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './stepper.module.css';

export type StepperStep = {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type StepperProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  steps: StepperStep[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (stepId: string) => void;
  orientation?: 'horizontal' | 'vertical';
};

export function Stepper({
  steps,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  ...rest
}: StepperProps) {
  const [activeId, setActiveId] = useControllableState({
    value,
    defaultValue: defaultValue ?? steps[0]?.id,
    onChange: onValueChange,
  });
  const groupId = useStableId('ds-stepper');

  const activeIndex = steps.findIndex((s) => s.id === activeId);

  return (
    <div
      {...rest}
      id={groupId}
      role="tablist"
      aria-orientation={orientation}
      className={cn(styles.root, styles[orientation], className)}
    >
      {steps.map((step, index) => {
        const isActive = step.id === activeId;
        const isComplete = activeIndex > index;
        const isDisabled = step.disabled;

        return (
          <button
            key={step.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled || undefined}
            disabled={isDisabled}
            className={cn(
              styles.step,
              isActive && styles.active,
              isComplete && styles.complete,
              isDisabled && styles.disabled,
            )}
            onClick={() => !isDisabled && setActiveId(step.id)}
          >
            <span className={styles.marker} aria-hidden="true">
              {isComplete ? '✓' : index + 1}
            </span>
            <span className={styles.labelWrap}>
              <span className={styles.label}>{step.label}</span>
              {step.description ? (
                <span className={styles.description}>{step.description}</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
