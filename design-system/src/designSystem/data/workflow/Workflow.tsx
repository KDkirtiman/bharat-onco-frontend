import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { Stepper, type StepperStep } from '../stepper/Stepper';

import styles from './workflow.module.css';

export type WorkflowStep = StepperStep & {
  content: ReactNode;
};

export type WorkflowProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  steps: WorkflowStep[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (stepId: string) => void;
  orientation?: 'horizontal' | 'vertical';
};

export function Workflow({
  steps,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  ...rest
}: WorkflowProps) {
  const [activeId, setActiveId] = useControllableState({
    value,
    defaultValue: defaultValue ?? steps[0]?.id,
    onChange: onValueChange,
  });

  const stepperSteps: StepperStep[] = steps.map(({ content: _c, ...step }) => step);
  const activeStep = steps.find((s) => s.id === activeId) ?? steps[0];

  return (
    <div {...rest} className={cn(styles.root, className)}>
      <Stepper
        steps={stepperSteps}
        value={activeId}
        onValueChange={setActiveId}
        orientation={orientation}
      />
      <div className={styles.panel} role="tabpanel" aria-labelledby={activeId}>
        {activeStep?.content}
      </div>
    </div>
  );
}
