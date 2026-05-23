import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { DatePicker } from './DatePicker';
const meta: Meta<typeof DatePicker> = {
  tags: ['autodocs'],
  title: 'Forms/DatePicker',
  component: DatePicker,
    parameters: {
    docs: {
      description: { component: "**DatePicker** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "DatePicker component",
      guide: {
  "whenToUse": [
    "Use **DatePicker** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline DatePicker configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<DatePicker label="Appointment" />);`,
        usageCode: `import { DatePicker } from '@/designSystem';

export function Example() {
  return (
    <DatePicker label="Appointment" />
  );
}`,
  },
  args: { label: 'Appointment date', onValueChange: action('onValueChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: '2026-06-15' },
};
