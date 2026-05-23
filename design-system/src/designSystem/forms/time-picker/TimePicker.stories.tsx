import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { TimePicker } from './TimePicker';
const meta: Meta<typeof TimePicker> = {
  tags: ['autodocs'],
  title: 'Forms/TimePicker',
  component: TimePicker,
    parameters: {
    docs: {
      description: { component: "**TimePicker** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "TimePicker component",
      guide: {
  "whenToUse": [
    "Use **TimePicker** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline TimePicker configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<TimePicker label="Time" />);`,
        usageCode: `import { TimePicker } from '@/designSystem';

export function Example() {
  return (
    <TimePicker label="Time" />
  );
}`,
  },
  args: { label: 'Appointment time', onValueChange: action('onValueChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  args: { defaultValue: '09:30' },
};
