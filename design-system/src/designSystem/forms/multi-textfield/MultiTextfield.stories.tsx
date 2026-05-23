import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { MultiTextfield } from './MultiTextfield';
const meta: Meta<typeof MultiTextfield> = {
  tags: ['autodocs'],
  title: 'Forms/MultiTextfield',
  component: MultiTextfield,
    parameters: {
    docs: {
      description: { component: "**MultiTextfield** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "MultiTextfield component",
      guide: {
  "whenToUse": [
    "Use **MultiTextfield** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline MultiTextfield configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<MultiTextfield label="Tags" placeholder="Add tag" />);`,
        usageCode: `import { MultiTextfield } from '@/designSystem';

export function Example() {
  return (
    <MultiTextfield label="Tags" placeholder="Add tag" />
  );
}`,
  },
  args: { label: 'Tags', onValueChange: action('onValueChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof MultiTextfield>;

export const Default: Story = {
  args: { defaultValue: ['Oncology', 'Radiation'] },
};
