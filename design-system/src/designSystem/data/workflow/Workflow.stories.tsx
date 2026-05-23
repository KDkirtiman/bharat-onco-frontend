import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { Workflow } from './Workflow';
const steps = [
  { id: 'intake', label: 'Intake', content: 'Collect patient history and symptoms.' },
  { id: 'tests', label: 'Tests', content: 'Order and review diagnostic tests.' },
  { id: 'plan', label: 'Plan', content: 'Finalize treatment plan with the care team.' },
];

const meta: Meta<typeof Workflow> = {
  tags: ['autodocs'],
  title: 'Data/Workflow',
  component: Workflow,
    parameters: {
    docs: {
      description: { component: "**Workflow** is part of the Data catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Workflow component",
      guide: {
  "whenToUse": [
    "Use **Workflow** in data flows where this UI pattern is needed.",
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
      "description": "Baseline Workflow configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <Workflow steps={[{ id: '1', label: 'Step 1' }, { id: '2', label: 'Step 2' }]} currentStep="1">
    <Text>Step content</Text>
  </Workflow>
);`,
        usageCode: `import { Text, Workflow } from '@/designSystem';

export function Example() {
  return (
    <Workflow steps={[{ id: '1', label: 'Step 1' }, { id: '2', label: 'Step 2' }]} currentStep="1">
        <Text>Step content</Text>
      </Workflow>
  );
}`,
  },
  args: { steps, onValueChange: action('onValueChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Workflow>;

export const Default: Story = {
  args: { defaultValue: 'intake' },
};
