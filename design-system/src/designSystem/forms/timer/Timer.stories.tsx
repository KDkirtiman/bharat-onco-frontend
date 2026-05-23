import type { Meta, StoryObj } from '@storybook/react';

import { Timer } from './Timer';
const meta: Meta<typeof Timer> = {
  tags: ['autodocs'],
  title: 'Forms/Timer',
  component: Timer,
    parameters: {
    docs: {
      description: { component: "**Timer** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Timer component",
      guide: {
  "whenToUse": [
    "Use **Timer** in forms flows where this UI pattern is needed.",
    "Prefer composing with other design-system primitives rather than custom markup."
  ],
  "capabilities": [
    "Themeable via CSS variables (`ThemeProvider` or token overrides)",
    "`className` and standard HTML/React props passthrough where applicable",
    "Multiple stories demonstrating states and variants"
  ],
  "scenarios": [
    {
      "title": "Stopwatch mode",
      "description": "Counts up from zero.",
      "story": "Stopwatch"
    },
    {
      "title": "Countdown mode",
      "description": "Counts down to zero and stops.",
      "story": "Countdown"
    }
  ]
},
    },
    liveCode: `render(<Timer label="Session timer" defaultValue={90} />);`,
        usageCode: `import { Timer } from '@/designSystem';

export function Example() {
  return (
    <Timer label="Session timer" defaultValue={90} />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Timer>;

export const Stopwatch: Story = {
  name: 'Stopwatch mode',
  args: { label: 'Session timer' },
};

export const Countdown: Story = {
  name: 'Countdown mode',
  args: { label: 'Rest period', defaultValue: 60, countDown: true },
};
