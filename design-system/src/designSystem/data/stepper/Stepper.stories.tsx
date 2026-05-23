import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { Stepper } from './Stepper';
const steps = [
  { id: 'intake', label: 'Intake', description: 'Patient details' },
  { id: 'diagnosis', label: 'Diagnosis', description: 'Review findings' },
  { id: 'plan', label: 'Plan', description: 'Treatment plan' },
];

const meta: Meta<typeof Stepper> = {
  tags: ['autodocs'],
  title: 'Data/Stepper',
  component: Stepper,
    parameters: {
    docs: {
      description: { component: "**Stepper** is part of the Data catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Stepper component",
      guide: {
  "whenToUse": [
    "Use **Stepper** in data flows where this UI pattern is needed.",
    "Prefer composing with other design-system primitives rather than custom markup."
  ],
  "capabilities": [
    "Themeable via CSS variables (`ThemeProvider` or token overrides)",
    "`className` and standard HTML/React props passthrough where applicable",
    "Multiple stories demonstrating states and variants"
  ],
  "scenarios": [
    {
      "title": "Default",
      "description": "Baseline Stepper configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Stepper steps={['Draft', 'Review', 'Done']} currentStep={1} />);`,
        usageCode: `import { Stepper } from '@/designSystem';

export function Example() {
  return (
    <Stepper steps={['Draft', 'Review', 'Done']} currentStep={1} />
  );
}`,
  },
  args: { steps, onValueChange: action('onValueChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  args: { defaultValue: 'intake' },
};

export const Vertical: Story = {
  args: { defaultValue: 'diagnosis', orientation: 'vertical' },
};
