import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { AmountField } from './AmountField';
const meta: Meta<typeof AmountField> = {
  tags: ['autodocs'],
  title: 'Forms/AmountField',
  component: AmountField,
    parameters: {
    docs: {
      description: { component: "**AmountField** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "AmountField component",
      guide: {
  "whenToUse": [
    "Use **AmountField** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline AmountField configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<AmountField label="Amount" currency="INR" defaultValue={1500} />);`,
        usageCode: `import { AmountField } from '@/designSystem';

export function Example() {
  return (
    <AmountField label="Amount" currency="INR" defaultValue={1500} />
  );
}`,
  },
  args: { label: 'Treatment cost', onValueChange: action('onValueChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof AmountField>;

export const Default: Story = {
  args: { defaultValue: 15000 },
};
