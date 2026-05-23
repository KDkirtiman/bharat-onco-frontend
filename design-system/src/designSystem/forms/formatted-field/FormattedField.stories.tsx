import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { FormattedField } from './FormattedField';
const meta: Meta<typeof FormattedField> = {
  tags: ['autodocs'],
  title: 'Forms/FormattedField',
  component: FormattedField,
    parameters: {
    docs: {
      description: { component: "**FormattedField** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "FormattedField component",
      guide: {
  "whenToUse": [
    "Use **FormattedField** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline FormattedField configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<FormattedField label="Phone" format="phone" />);`,
        usageCode: `import { FormattedField } from '@/designSystem';

export function Example() {
  return (
    <FormattedField label="Phone" format="phone" />
  );
}`,
  },
  args: { onValueChange: action('onValueChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof FormattedField>;

export const Phone: Story = {
  args: { label: 'Phone', mask: 'phone' },
};

export const Pan: Story = {
  args: { label: 'PAN', mask: 'pan' },
};
